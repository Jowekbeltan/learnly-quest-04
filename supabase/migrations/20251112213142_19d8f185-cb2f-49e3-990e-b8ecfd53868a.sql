-- Allow all authenticated users to view profiles for leaderboard purposes
CREATE POLICY "Anyone can view all profiles for leaderboard"
ON public.profiles
FOR SELECT
USING (true);

-- Note: The existing "Users can view their own profile" policy will be evaluated
-- alongside this one, so users can still see their own profiles