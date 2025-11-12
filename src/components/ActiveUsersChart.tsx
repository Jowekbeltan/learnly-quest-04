import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ActiveUserData {
  date: string;
  users: number;
}

interface LevelDistribution {
  level: string;
  count: number;
}

const ActiveUsersChart = () => {
  const [weeklyActivity, setWeeklyActivity] = useState<ActiveUserData[]>([]);
  const [levelDistribution, setLevelDistribution] = useState<LevelDistribution[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeToday, setActiveToday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    try {
      // Get total users count
      const { count: total } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setTotalUsers(total || 0);

      // Get users active today
      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('last_activity_date', today);

      setActiveToday(todayCount || 0);

      // Get weekly activity (last 7 days)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('last_activity_date')
        .gte('last_activity_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .not('last_activity_date', 'is', null);

      // Process weekly activity
      const activityMap = new Map<string, number>();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        return date.toISOString().split('T')[0];
      }).reverse();

      last7Days.forEach(date => activityMap.set(date, 0));

      profiles?.forEach(profile => {
        if (profile.last_activity_date) {
          const dateStr = profile.last_activity_date;
          activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
        }
      });

      const weeklyData = Array.from(activityMap.entries()).map(([date, users]) => ({
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        users
      }));

      setWeeklyActivity(weeklyData);

      // Get level distribution
      const { data: levelData } = await supabase
        .from('profiles')
        .select('level');

      const levelMap = new Map<number, number>();
      levelData?.forEach(profile => {
        const level = profile.level || 1;
        levelMap.set(level, (levelMap.get(level) || 0) + 1);
      });

      const distribution = Array.from(levelMap.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([level, count]) => ({
          level: `Level ${level}`,
          count
        }));

      setLevelDistribution(distribution);
    } catch (error) {
      console.error('Error fetching activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--warning))', 'hsl(var(--muted))'];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Loading activity data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">{totalUsers}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Activity className="h-4 w-4 text-accent" />
            </div>
            <p className="text-2xl font-bold">{activeToday}</p>
            <p className="text-xs text-muted-foreground">Active Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="users" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Level Distribution */}
      {levelDistribution.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Users by Level</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={levelDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ level, count, percent }) => 
                    `${level}: ${count} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="count"
                >
                  {levelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActiveUsersChart;
