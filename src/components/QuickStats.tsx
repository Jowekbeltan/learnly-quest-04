import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Flame, TrendingUp, Star, Award } from "lucide-react";

const QuickStats = () => {
  const stats = {
    totalPoints: 1250,
    currentStreak: 7,
    weeklyGoal: 85, // percentage
    level: 5,
    nextLevelPoints: 1500,
    badges: 12,
    rank: 23,
    totalUsers: 1247
  };

  const recentAchievements = [
    { name: "Math Master", icon: "🧮", points: 50, date: "2 days ago" },
    { name: "Science Explorer", icon: "🔬", points: 75, date: "1 week ago" },
    { name: "Quick Learner", icon: "⚡", points: 30, date: "1 week ago" }
  ];

  const levelProgress = ((stats.totalPoints - (stats.level - 1) * 300) / 300) * 100;

  return (
    <div className="space-y-6">
      {/* Level & Points */}
      <Card className="bg-hero-gradient text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">Level {stats.level}</h3>
              <p className="text-white/80">You're doing great!</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.totalPoints}</p>
              <p className="text-white/80">Total Points</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {stats.level + 1}</span>
              <span>{stats.totalPoints}/{stats.nextLevelPoints}</span>
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
            <p className="text-2xl font-bold">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trophy className="h-4 w-4 text-accent" />
            </div>
            <p className="text-2xl font-bold">#{stats.rank}</p>
            <p className="text-xs text-muted-foreground">Leaderboard</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="h-4 w-4 text-secondary" />
            </div>
            <p className="text-2xl font-bold">{stats.weeklyGoal}%</p>
            <p className="text-xs text-muted-foreground">Weekly Goal</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">{stats.badges}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
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
          {recentAchievements.map((achievement, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl">{achievement.icon}</span>
                <div>
                  <p className="font-medium text-sm">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">{achievement.date}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-accent border-accent">
                +{achievement.points} pts
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;