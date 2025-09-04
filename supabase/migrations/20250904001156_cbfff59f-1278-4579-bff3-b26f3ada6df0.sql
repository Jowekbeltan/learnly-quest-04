-- Add profile picture support and streak tracking
ALTER TABLE public.profiles 
ADD COLUMN avatar_url TEXT,
ADD COLUMN last_activity_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN max_daily_points INTEGER DEFAULT 0;

-- Create user roles enum and table
CREATE TYPE public.user_role AS ENUM ('student', 'teacher', 'admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create teacher content table
CREATE TABLE public.teacher_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL, -- Store lesson content structure
  difficulty TEXT DEFAULT 'beginner',
  estimated_duration INTEGER DEFAULT 15, -- in minutes
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on teacher_content
ALTER TABLE public.teacher_content ENABLE ROW LEVEL SECURITY;

-- Create policies for teacher_content
CREATE POLICY "Teachers can manage their own content"
ON public.teacher_content
FOR ALL
USING (auth.uid() = teacher_id);

CREATE POLICY "Everyone can view approved content"
ON public.teacher_content
FOR SELECT
USING (status = 'approved');

-- Create content reviews table
CREATE TABLE public.content_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES public.teacher_content(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on content_reviews
ALTER TABLE public.content_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for content_reviews
CREATE POLICY "Users can view reviews for content they can see"
ON public.content_reviews
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.teacher_content 
    WHERE id = content_id AND status = 'approved'
  )
);

CREATE POLICY "Users can create reviews for approved content"
ON public.content_reviews
FOR INSERT
WITH CHECK (
  auth.uid() = reviewer_id AND
  EXISTS (
    SELECT 1 FROM public.teacher_content 
    WHERE id = content_id AND status = 'approved'
  )
);

-- Create chatbot conversations table
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'New Conversation',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on chat_conversations
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_conversations
CREATE POLICY "Users can manage their own conversations"
ON public.chat_conversations
FOR ALL
USING (auth.uid() = user_id);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_messages
CREATE POLICY "Users can view messages in their conversations"
ON public.chat_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_conversations 
    WHERE id = conversation_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert messages in their conversations"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_conversations 
    WHERE id = conversation_id AND user_id = auth.uid()
  )
);

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Create storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create function to update streak and daily points
CREATE OR REPLACE FUNCTION public.update_user_streak_and_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user's daily points and streak
  UPDATE public.profiles 
  SET 
    total_points = total_points + COALESCE(NEW.score, 0),
    max_daily_points = CASE 
      WHEN last_activity_date = CURRENT_DATE THEN GREATEST(max_daily_points, COALESCE(NEW.score, 0))
      ELSE COALESCE(NEW.score, 0)
    END,
    current_streak = CASE
      WHEN last_activity_date = CURRENT_DATE THEN current_streak
      WHEN last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN current_streak + 1
      ELSE 1
    END,
    last_activity_date = CURRENT_DATE,
    updated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for streak and points update
CREATE TRIGGER update_user_streak_and_points_trigger
  AFTER INSERT OR UPDATE ON public.user_progress
  FOR EACH ROW
  WHEN (NEW.completed = true)
  EXECUTE FUNCTION public.update_user_streak_and_points();

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Update triggers for updated_at columns
CREATE TRIGGER update_teacher_content_updated_at
  BEFORE UPDATE ON public.teacher_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_reviews_updated_at
  BEFORE UPDATE ON public.content_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();