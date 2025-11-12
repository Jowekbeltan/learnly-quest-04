import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Medal, Award, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LeaderboardUser {
  user_id: string;
  display_name: string;
  username: string;
  total_points: number;
  current_streak: number;
  avatar_url: string | null;
  rank: number;
}

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name, username, total_points, current_streak, avatar_url')
        .order('total_points', { ascending: false })
        .limit(50);

      if (error) throw error;

      const rankedData = data?.map((user, index) => ({
        ...user,
        rank: index + 1,
        display_name: user.display_name || 'Anonymous User'
      })) || [];

      setLeaderboardData(rankedData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <Award className="h-4 w-4 text-muted-foreground" />;
  };

  const getAvatarDisplay = (avatarUrl: string | null, displayName: string) => {
    if (avatarUrl) {
      return (
        <img 
          src={avatarUrl} 
          alt={displayName}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
        {displayName.charAt(0).toUpperCase()}
      </div>
    );
  };

  const displayedUsers = showAll ? leaderboardData : leaderboardData.slice(0, 10);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Global Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayedUsers.map((leaderUser) => {
          const isCurrentUser = user?.id === leaderUser.user_id;
          
          return (
            <div 
              key={leaderUser.user_id}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                isCurrentUser 
                  ? 'bg-primary/10 border border-primary/20 ring-2 ring-primary/20' 
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2 w-12">
                  {getRankIcon(leaderUser.rank)}
                  <span className="text-sm font-bold">#{leaderUser.rank}</span>
                </div>
                {getAvatarDisplay(leaderUser.avatar_url, leaderUser.display_name)}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${isCurrentUser ? 'text-primary' : ''}`}>
                    {leaderUser.display_name}
                    {isCurrentUser && <span className="ml-2 text-xs">(You)</span>}
                  </p>
                  {leaderUser.username && (
                    <p className="text-xs text-muted-foreground truncate">
                      @{leaderUser.username}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    🔥 {leaderUser.current_streak} day streak
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{leaderUser.total_points}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </div>
          );
        })}
        
        {leaderboardData.length > 10 && (
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `View All ${leaderboardData.length} Users`}
          </Button>
        )}

        {leaderboardData.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No users yet. Be the first to earn points!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
