import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, BookOpen, Trophy, Flame, Settings, LogOut, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      // User will be redirected automatically via auth state change
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-hero-gradient rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-hero-gradient bg-clip-text text-transparent">
              LearnlyQuest
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link to="/library">
              <Button variant="ghost" size="sm">Library</Button>
            </Link>
            <Link to="/chat">
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </Link>
            <Button variant="ghost" size="sm">Subjects</Button>
            <Button variant="ghost" size="sm">Leaderboard</Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* User Stats */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-warning/10 rounded-full">
                  <Flame className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">{profile?.current_streak || 0} day streak</span>
                </div>
                
                <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full">
                  <Trophy className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">{profile?.total_points || 0} pts</span>
                </div>
                
                <Badge variant="secondary" className="bg-success-gradient text-white">
                  Level {profile?.level || 1}
                </Badge>
              </div>

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.display_name || 'User'} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{profile?.display_name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">Student</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;