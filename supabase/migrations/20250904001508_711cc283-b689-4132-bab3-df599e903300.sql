-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.update_user_streak_and_points()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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
$$;