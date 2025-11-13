-- Create storage bucket for educational content if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('educational-content', 'educational-content', true)
ON CONFLICT (id) DO NOTHING;