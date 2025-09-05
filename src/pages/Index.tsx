import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SubjectCard from "@/components/SubjectCard";
import QuickStats from "@/components/QuickStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Atom, 
  Calculator, 
  Cpu, 
  Languages, 
  Globe, 
  Users,
  Crown,
  Medal,
  Award
} from "lucide-react";

// Import generated images
import scienceBg from "@/assets/science-bg.jpg";
import mathBg from "@/assets/math-bg.jpg";
import techBg from "@/assets/tech-bg.jpg";

const Index = () => {
  const { user } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState<number>(6);

  const subjects = [
    {
      id: "science",
      name: "Science",
      description: "Physics, Chemistry, Biology & more",
      icon: <Atom className="h-6 w-6" />,
      backgroundImage: scienceBg,
      totalLessons: 45,
      completedLessons: 23,
      estimatedTime: "12 weeks",
      difficulty: "Intermediate" as const,
      points: 350,
      color: "hsl(213 94% 68%)"
    },
    {
      id: "mathematics",
      name: "Mathematics",
      description: "Algebra, Geometry, Calculus & Statistics",
      icon: <Calculator className="h-6 w-6" />,
      backgroundImage: mathBg,
      totalLessons: 52,
      completedLessons: 31,
      estimatedTime: "14 weeks",
      difficulty: "Advanced" as const,
      points: 420,
      color: "hsl(25 95% 53%)"
    },
    {
      id: "technology",
      name: "Technology",
      description: "Programming, AI, Robotics & Digital Skills",
      icon: <Cpu className="h-6 w-6" />,
      backgroundImage: techBg,
      totalLessons: 38,
      completedLessons: 12,
      estimatedTime: "10 weeks",
      difficulty: "Intermediate" as const,
      points: 290,
      color: "hsl(158 64% 52%)"
    },
    {
      id: "languages",
      name: "Languages",
      description: "English, Spanish, French & Communication",
      icon: <Languages className="h-6 w-6" />,
      backgroundImage: scienceBg, // Reusing for now
      totalLessons: 42,
      completedLessons: 18,
      estimatedTime: "16 weeks",
      difficulty: "Beginner" as const,
      points: 320,
      color: "hsl(262 83% 68%)"
    },
    {
      id: "socialstudies",
      name: "Social Studies",
      description: "History, Geography, Culture & Society",
      icon: <Globe className="h-6 w-6" />,
      backgroundImage: mathBg, // Reusing for now
      totalLessons: 35,
      completedLessons: 8,
      estimatedTime: "8 weeks",
      difficulty: "Beginner" as const,
      points: 280,
      color: "hsl(45 86% 58%)"
    }
  ];

  const leaderboard = [
    { rank: 1, name: "Emma Chen", points: 2450, avatar: "🏆", streak: 15 },
    { rank: 2, name: "Marcus Johnson", points: 2380, avatar: "🥈", streak: 12 },
    { rank: 3, name: "Sofia Rodriguez", points: 2290, avatar: "🥉", streak: 8 },
    { rank: 4, name: "Alex Thompson", points: 1250, avatar: "👤", streak: 7, isCurrentUser: true },
    { rank: 5, name: "David Kim", points: 1180, avatar: "👤", streak: 5 }
  ];

  const gradeOptions = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />
        
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-1 space-y-8">
                {/* Grade Selection */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Choose Your Grade Level</h2>
                  <div className="flex flex-wrap gap-2">
                    {gradeOptions.map((grade) => (
                      <Button
                        key={grade}
                        variant={selectedGrade === grade ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedGrade(grade)}
                        className={selectedGrade === grade ? "bg-primary text-primary-foreground" : ""}
                      >
                        Grade {grade}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Subjects Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Your Subjects</h2>
                    <Badge variant="outline" className="text-primary border-primary">
                      Grade {selectedGrade} • 5 Subjects • 
                      {selectedGrade >= 5 ? 'Beginner' : selectedGrade >= 3 ? 'Intermediate' : 'Advanced'}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="animate-slide-in">
                        <SubjectCard subject={subject} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:w-80 space-y-6">
                {/* Quick Stats - Only show for authenticated users */}
                {user && <QuickStats />}
                
                {/* Leaderboard */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-warning" />
                      Weekly Leaderboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {leaderboard.map((user) => (
                      <div 
                        key={user.rank}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          user.isCurrentUser 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{user.avatar}</span>
                            <span className="text-sm font-medium">#{user.rank}</span>
                          </div>
                          <div>
                            <p className={`font-medium text-sm ${user.isCurrentUser ? 'text-primary' : ''}`}>
                              {user.name} {user.isCurrentUser && '(You)'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.streak} day streak
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{user.points}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full mt-4">
                      View Full Leaderboard
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;