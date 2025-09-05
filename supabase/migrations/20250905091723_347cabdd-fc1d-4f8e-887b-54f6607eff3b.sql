-- Create achievements for lesson completion badges
INSERT INTO achievements (name, description, icon, points, badge_color) VALUES 
('First Steps', 'Complete your first lesson', 'star', 10, 'primary'),
('Science Explorer', 'Complete 3 science lessons', 'microscope', 25, 'success'),
('Math Wizard', 'Complete 3 mathematics lessons', 'calculator', 25, 'info'),
('Tech Innovator', 'Complete 3 technology lessons', 'code', 25, 'warning'),
('Language Master', 'Complete 3 language lessons', 'book-open', 25, 'success'),
('Social Studies Scholar', 'Complete 3 social studies lessons', 'target', 25, 'primary'),
('Subject Champion', 'Complete all lessons in any subject', 'trophy', 50, 'warning'),
('Learning Streak', 'Complete lessons for 7 days in a row', 'flame', 30, 'warning'),
('Grade Achiever', 'Complete all subjects in your grade', 'award', 100, 'success'),
('Perfect Score', 'Get 100% on any lesson quiz', 'zap', 20, 'warning')
ON CONFLICT (name) DO NOTHING;

-- Function to award achievements based on progress
CREATE OR REPLACE FUNCTION award_lesson_completion_achievements()
RETURNS TRIGGER AS $$
DECLARE
    subject_lesson_count INTEGER;
    total_subject_lessons INTEGER := 6; -- Each subject has 6 lessons
    user_first_lesson BOOLEAN;
    subject_completed BOOLEAN;
    existing_achievement_id UUID;
BEGIN
    -- Only process if lesson was just completed
    IF NEW.completed = TRUE AND (OLD.completed IS NULL OR OLD.completed = FALSE) THEN
        
        -- Check if this is user's first lesson completion
        SELECT COUNT(*) = 0 INTO user_first_lesson
        FROM user_progress 
        WHERE user_id = NEW.user_id AND completed = TRUE AND id != NEW.id;
        
        -- Award "First Steps" achievement for first lesson completion
        IF user_first_lesson THEN
            SELECT id INTO existing_achievement_id FROM achievements WHERE name = 'First Steps';
            IF existing_achievement_id IS NOT NULL THEN
                INSERT INTO user_achievements (user_id, achievement_id)
                VALUES (NEW.user_id, existing_achievement_id)
                ON CONFLICT (user_id, achievement_id) DO NOTHING;
            END IF;
        END IF;
        
        -- Count completed lessons in this subject
        SELECT COUNT(*) INTO subject_lesson_count
        FROM user_progress 
        WHERE user_id = NEW.user_id 
        AND subject_id = NEW.subject_id 
        AND completed = TRUE;
        
        -- Award subject-specific achievements at 3 lessons
        IF subject_lesson_count = 3 THEN
            CASE NEW.subject_id
                WHEN 'science' THEN
                    SELECT id INTO existing_achievement_id FROM achievements WHERE name = 'Science Explorer';
                WHEN 'mathematics' THEN
                    SELECT id INTO existing_achievement_id FROM achievements WHERE name = 'Math Wizard';
                WHEN 'technology' THEN
                    SELECT id INTO existing_achievement_id FROM achievements WHERE name = 'Tech Innovator';
                WHEN 'languages' THEN
                    SELECT id INTO existing_achievement_id FROM achievements WHERE name = 'Language Master';
                WHEN 'socialstudies' THEN
                    SELECT id INTO existing_achievement_id FROM achievements WHERE name = 'Social Studies Scholar';
                ELSE
                    existing_achievement_id := NULL;
            END CASE;
            
            IF existing_achievement_id IS NOT NULL THEN
                INSERT INTO user_achievements (user_id, achievement_id)
                VALUES (NEW.user_id, existing_achievement_id)
                ON CONFLICT (user_id, achievement_id) DO NOTHING;
            END IF;
        END IF;
        
        -- Award "Subject Champion" for completing all lessons in a subject
        IF subject_lesson_count = total_subject_lessons THEN
            SELECT id INTO existing_achievement_id FROM achievements WHERE name = 'Subject Champion';
            IF existing_achievement_id IS NOT NULL THEN
                INSERT INTO user_achievements (user_id, achievement_id)
                VALUES (NEW.user_id, existing_achievement_id)
                ON CONFLICT (user_id, achievement_id) DO NOTHING;
            END IF;
        END IF;
        
        -- Award "Perfect Score" achievement for 100% score
        IF NEW.score >= 100 THEN
            SELECT id INTO existing_achievement_id FROM achievements WHERE name = 'Perfect Score';
            IF existing_achievement_id IS NOT NULL THEN
                INSERT INTO user_achievements (user_id, achievement_id)
                VALUES (NEW.user_id, existing_achievement_id)
                ON CONFLICT (user_id, achievement_id) DO NOTHING;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for awarding achievements
DROP TRIGGER IF EXISTS trigger_award_achievements ON user_progress;
CREATE TRIGGER trigger_award_achievements
    AFTER INSERT OR UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION award_lesson_completion_achievements();

-- Prevent duplicate points by updating the existing trigger function
CREATE OR REPLACE FUNCTION public.update_user_streak_and_points()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update points if lesson was just completed (prevent duplicates)
    IF NEW.completed = TRUE AND (OLD IS NULL OR OLD.completed = FALSE) THEN
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
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;