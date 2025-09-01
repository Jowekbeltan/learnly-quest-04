import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, BookOpen, Trophy, Flame, Settings } from "lucide-react";

interface HeaderProps {
  user?: {
    name: string;
    role: 'student' | 'teacher';
    points: number;
    streak: number;
    level: number;
  };
}

const Header = ({ user }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const defaultUser = {
    name: "Alex Thompson",
    role: 'student' as const,
    points: 1250,
    streak: 7,
    level: 5
  };

  const currentUser = user || defaultUser;

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
            <Button variant="ghost" size="sm">Dashboard</Button>
            <Button variant="ghost" size="sm">Subjects</Button>
            <Button variant="ghost" size="sm">Leaderboard</Button>
            {currentUser.role === 'teacher' && (
              <Button variant="ghost" size="sm">Create Content</Button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* User Stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-warning/10 rounded-full">
              <Flame className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">{currentUser.streak} day streak</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full">
              <Trophy className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">{currentUser.points} pts</span>
            </div>
            
            <Badge variant="secondary" className="bg-success-gradient text-white">
              Level {currentUser.level}
            </Badge>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;