import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import TeacherDashboard from '@/components/TeacherDashboard';
import ThemeSettings from '@/components/ThemeSettings';
import { ContentUploadDialog } from '@/components/ContentUploadDialog';
import { 
  ArrowLeft, 
  Trophy, 
  Target, 
  Flame, 
  Star, 
  BookOpen, 
  Calendar,
  User,
  Edit2,
  Check,
  X,
  Users,
  Settings,
  LogOut
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  badge_color: string;
  earned_at?: string;
}

interface UserProgress {
  subject_id: string;
  completed_lessons: number;
  total_score: number;
}

const Profile = () => {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [userRole, setUserRole] = useState<string>('student');
  const [isTeacher, setIsTeacher] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    display_name: '',
    username: ''
  });

  useEffect(() => {
    if (user) {
      fetchData();
      checkUserRole();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setEditedProfile({
        display_name: profile.display_name || '',
        username: profile.username || ''
      });
    }
  }, [profile]);

  const checkUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const roles = data.map(r => r.role);
        setUserRole(roles[0]);
        setIsTeacher(roles.includes('teacher'));
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const becomeTeacher = async () => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: user?.id, role: 'teacher' }]);

      if (error) throw error;

      setIsTeacher(true);
      toast({
        title: "Welcome to the teacher community!",
        description: "You can now create and share educational content."
      });
    } catch (error) {
      console.error('Error becoming teacher:', error);
      toast({
        title: "Error",
        description: "Failed to register as teacher",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully"
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        variant: "destructive"
      });
    }
  };

  const fetchData = async () => {
    try {
      // Fetch all achievements
      const { data: allAchievements } = await supabase
        .from('achievements')
        .select('*')
        .order('points', { ascending: true });

      // Fetch user's earned achievements
      const { data: earnedAchievements } = await supabase
        .from('user_achievements')
        .select(`
          achievement_id,
          earned_at,
          achievements:achievement_id (
            id, name, description, icon, points, badge_color
          )
        `)
        .eq('user_id', user!.id);

      // Fetch user progress
      const { data: progress } = await supabase
        .from('user_progress')
        .select('subject_id, completed, score')
        .eq('user_id', user!.id)
        .eq('completed', true);

      setAchievements(allAchievements || []);
      
      const userAchievementsData = earnedAchievements?.map(ua => ({
        ...ua.achievements,
        earned_at: ua.earned_at
      })) || [];
      setUserAchievements(userAchievementsData);

      // Process progress data
      const progressMap = new Map();
      progress?.forEach(p => {
        const key = p.subject_id;
        if (!progressMap.has(key)) {
          progressMap.set(key, { subject_id: key, completed_lessons: 0, total_score: 0 });
        }
        const current = progressMap.get(key);
        current.completed_lessons += 1;
        current.total_score += p.score || 0;
      });
      
      setUserProgress(Array.from(progressMap.values()));
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: editedProfile.display_name,
          username: editedProfile.username
        })
        .eq('user_id', user!.id);

      if (error) throw error;

      await refreshProfile();
      setEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getIconComponent = (iconName: string, className: string = "h-4 w-4") => {
    const icons: { [key: string]: any } = {
      trophy: Trophy,
      target: Target,
      flame: Flame,
      star: Star,
      'book-open': BookOpen,
      calendar: Calendar,
      zap: Target,
      calculator: Target,
      microscope: Target,
      code: Target
    };
    
    const IconComponent = icons[iconName] || Trophy;
    return <IconComponent className={className} />;
  };

  const getBadgeColorClass = (color: string) => {
    const colors: { [key: string]: string } = {
      primary: 'bg-primary text-primary-foreground',
      warning: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    };
    return colors[color] || colors.primary;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Please sign in to view your profile.</p>
            <Link to="/auth">
              <Button className="mt-4">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  const nextLevelPoints = profile?.level ? profile.level * 1000 : 1000;
  const currentLevelProgress = profile?.total_points ? (profile.total_points % 1000) / 10 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <TabsList className="grid w-fit grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="learning" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Learning
              </TabsTrigger>
              {isTeacher && (
                <TabsTrigger value="teaching" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Teaching
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Profile Info */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center space-y-4">
                      <ProfilePictureUpload currentAvatarUrl={profile?.avatar_url} />
                      
                      {editing ? (
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="display_name">Display Name</Label>
                            <Input
                              id="display_name"
                              value={editedProfile.display_name}
                              onChange={(e) => setEditedProfile(prev => ({ ...prev, display_name: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              value={editedProfile.username}
                              onChange={(e) => setEditedProfile(prev => ({ ...prev, username: e.target.value }))}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleUpdateProfile}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-lg font-semibold">{profile?.display_name || 'Anonymous Learner'}</h3>
                          <p className="text-muted-foreground">{user.email}</p>
                          {profile?.username && (
                            <p className="text-sm text-muted-foreground">@{profile.username}</p>
                          )}
                          <div className="flex flex-col gap-2 mt-2">
                            <Badge variant="outline" className="capitalize">
                              {userRole}
                            </Badge>
                            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit Profile
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Level</span>
                        <Badge variant="secondary">Level {profile?.level || 1}</Badge>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Progress to Level {(profile?.level || 1) + 1}</span>
                          <span>{profile?.total_points || 0} / {nextLevelPoints} pts</span>
                        </div>
                        <Progress value={currentLevelProgress} />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Current Streak</span>
                        <div className="flex items-center gap-1">
                          <Flame className="h-4 w-4 text-orange-500" />
                          <span className="font-medium">{profile?.current_streak || 0} days</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Points</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{profile?.total_points || 0}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Max Daily Points</span>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4 text-primary" />
                          <span className="font-medium">{profile?.max_daily_points || 0}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Teacher Registration */}
                    {!isTeacher && (
                      <div className="space-y-3">
                        <h4 className="font-medium">Become a Teacher</h4>
                        <p className="text-sm text-muted-foreground">
                          Share your knowledge and create educational content for other learners.
                        </p>
                        <Button onClick={becomeTeacher} size="sm" className="w-full">
                          <Users className="h-4 w-4 mr-2" />
                          Register as Teacher
                        </Button>
                      </div>
                    )}

                    <Separator />

                    {/* Theme Settings */}
                    <ThemeSettings />

                    <Separator />

                    {/* Account Actions */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Account Settings</h4>
                      <Button variant="outline" onClick={handleSignOut} size="sm" className="w-full">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Learning Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Learning Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userProgress.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {userProgress.map((progress) => (
                          <div key={progress.subject_id} className="p-4 border rounded-lg">
                            <h3 className="font-medium capitalize mb-2">{progress.subject_id}</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Lessons Completed</span>
                                <span className="font-medium">{progress.completed_lessons}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Total Score</span>
                                <span className="font-medium">{progress.total_score} pts</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No progress yet. Start learning to see your stats here!
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Earned Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Earned Achievements ({userAchievements.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userAchievements.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {userAchievements.map((achievement) => (
                          <div key={achievement.id} className="p-4 border rounded-lg bg-accent/5">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${getBadgeColorClass(achievement.badge_color)}`}>
                                {getIconComponent(achievement.icon)}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{achievement.name}</h3>
                                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="secondary">+{achievement.points} pts</Badge>
                                  {achievement.earned_at && (
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(achievement.earned_at).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No achievements earned yet. Complete lessons to unlock achievements!
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Available Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Available Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {achievements
                        .filter(a => !userAchievements.find(ua => ua.id === a.id))
                        .map((achievement) => (
                          <div key={achievement.id} className="p-4 border rounded-lg opacity-60">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${getBadgeColorClass(achievement.badge_color)}`}>
                                {getIconComponent(achievement.icon)}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{achievement.name}</h3>
                                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                <Badge variant="outline" className="mt-2">+{achievement.points} pts</Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Track your progress across all subjects and continue your learning journey.
                </p>
                <Button onClick={() => window.location.href = '/'}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {isTeacher && (
            <TabsContent value="teaching" className="space-y-6">
              <TeacherDashboard />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;