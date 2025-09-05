import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Flame, TrendingUp, Star, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  badge_color: string;
  earned_at?: string;
}

const QuickStats = () => {
  const { user, profile } = useAuth();
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [totalAchievements, setTotalAchievements] = useState(0);

  useEffect(() => {
    if (user) {
      fetchRecentAchievements();
    }
  }, [user]);

  const fetchRecentAchievements = async () => {
    try {
      // Fetch user's recent achievements
      const { data: earnedAchievements } = await supabase
        .from('user_achievements')
        .select(`
          earned_at,
          achievements:achievement_id (
            id, name, description, icon, points, badge_color
          )
        `)
        .eq('user_id', user!.id)
        .order('earned_at', { ascending: false })
        .limit(3);

      const achievementsData = earnedAchievements?.map(ua => ({
        ...ua.achievements,
        earned_at: ua.earned_at
      })) || [];

      setRecentAchievements(achievementsData);
      setTotalAchievements(earnedAchievements?.length || 0);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 14) return '1 week ago';
    return `${Math.floor(diffInDays / 7)} weeks ago`;
  };

  const getIconEmoji = (iconName: string) => {
    const icons: { [key: string]: string } = {
      trophy: "🏆",
      star: "⭐",
      flame: "🔥",
      calculator: "🧮",
      microscope: "🔬",
      code: "💻",
      'book-open': "📖",
      target: "🎯",
      award: "🏅",
      zap: "⚡"
    };
    return icons[iconName] || "🏆";
  };

  if (!profile) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Loading your stats...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPoints = profile.total_points || 0;
  const currentStreak = profile.current_streak || 0;
  const level = profile.level || 1;
  const maxDailyPoints = profile.max_daily_points || 0;
  const nextLevelPoints = level * 1000;
  const levelProgress = ((totalPoints % 1000) / 1000) * 100;

  return (
    <div className="space-y-6">
      {/* Level & Points */}
      <Card className="bg-hero-gradient text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">Level {level}</h3>
              <p className="text-white/80">You're doing great!</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{totalPoints}</p>
              <p className="text-white/80">Total Points</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {level + 1}</span>
              <span>{totalPoints}/{nextLevelPoints}</span>
            </div>
            <Progress value={levelProgress} className="bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Flame className="h-4 w-4 text-warning" />
            </div>
            <p className="text-2xl font-bold">{currentStreak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trophy className="h-4 w-4 text-accent" />
            </div>
            <p className="text-2xl font-bold">{maxDailyPoints}</p>
            <p className="text-xs text-muted-foreground">Max Daily</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="h-4 w-4 text-secondary" />
            </div>
            <p className="text-2xl font-bold">{Math.round(levelProgress)}%</p>
            <p className="text-xs text-muted-foreground">Level Progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">{totalAchievements}</p>
            <p className="text-xs text-muted-foreground">Achievements</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentAchievements.length > 0 ? (
            recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getIconEmoji(achievement.icon)}</span>
                  <div>
                    <p className="font-medium text-sm">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {achievement.earned_at ? formatDate(achievement.earned_at) : 'Recently'}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-accent border-accent">
                  +{achievement.points} pts
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Complete lessons to earn achievements!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;