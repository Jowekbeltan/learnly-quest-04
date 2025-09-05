-- First remove any duplicate user achievements
DELETE FROM user_achievements 
WHERE id NOT IN (
    SELECT MIN(id) 
    FROM user_achievements 
    GROUP BY user_id, achievement_id
);

-- Add unique constraint for user achievements to prevent duplicates
ALTER TABLE user_achievements ADD CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id);

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