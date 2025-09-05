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

  const getGradeSpecificSubjects = (grade: number) => {
    const baseSubjects = {
      science: {
        id: "science",
        name: "Science",
        icon: <Atom className="h-6 w-6" />,
        backgroundImage: scienceBg,
        color: "hsl(213 94% 68%)"
      },
      mathematics: {
        id: "mathematics", 
        name: "Mathematics",
        icon: <Calculator className="h-6 w-6" />,
        backgroundImage: mathBg,
        color: "hsl(25 95% 53%)"
      },
      technology: {
        id: "technology",
        name: "Technology", 
        icon: <Cpu className="h-6 w-6" />,
        backgroundImage: techBg,
        color: "hsl(158 64% 52%)"
      },
      languages: {
        id: "languages",
        name: "Languages",
        icon: <Languages className="h-6 w-6" />,
        backgroundImage: scienceBg,
        color: "hsl(262 83% 68%)"
      },
      socialstudies: {
        id: "socialstudies", 
        name: "Social Studies",
        icon: <Globe className="h-6 w-6" />,
        backgroundImage: mathBg,
        color: "hsl(45 86% 58%)"
      }
    };

    const gradeContent = {
      1: [
        { ...baseSubjects.mathematics, description: "Numbers, Counting & Basic Addition", totalLessons: 20, completedLessons: 8, estimatedTime: "6 weeks", difficulty: "Beginner" as const, points: 150 },
        { ...baseSubjects.science, description: "Animals, Plants & Weather", totalLessons: 18, completedLessons: 5, estimatedTime: "5 weeks", difficulty: "Beginner" as const, points: 140 },
        { ...baseSubjects.languages, description: "Reading, Writing & Phonics", totalLessons: 25, completedLessons: 12, estimatedTime: "8 weeks", difficulty: "Beginner" as const, points: 180 }
      ],
      2: [
        { ...baseSubjects.mathematics, description: "Subtraction, Shapes & Time", totalLessons: 25, completedLessons: 10, estimatedTime: "7 weeks", difficulty: "Beginner" as const, points: 200 },
        { ...baseSubjects.science, description: "Life Cycles, Seasons & Simple Machines", totalLessons: 22, completedLessons: 8, estimatedTime: "6 weeks", difficulty: "Beginner" as const, points: 180 },
        { ...baseSubjects.languages, description: "Grammar, Vocabulary & Stories", totalLessons: 28, completedLessons: 15, estimatedTime: "9 weeks", difficulty: "Beginner" as const, points: 220 },
        { ...baseSubjects.socialstudies, description: "Community, Family & Maps", totalLessons: 20, completedLessons: 6, estimatedTime: "5 weeks", difficulty: "Beginner" as const, points: 160 }
      ],
      3: [
        { ...baseSubjects.mathematics, description: "Multiplication, Division & Fractions", totalLessons: 30, completedLessons: 18, estimatedTime: "8 weeks", difficulty: "Intermediate" as const, points: 250 },
        { ...baseSubjects.science, description: "Forces, Matter & Earth Science", totalLessons: 28, completedLessons: 12, estimatedTime: "7 weeks", difficulty: "Intermediate" as const, points: 230 },
        { ...baseSubjects.languages, description: "Paragraphs, Research & Presentations", totalLessons: 32, completedLessons: 20, estimatedTime: "10 weeks", difficulty: "Intermediate" as const, points: 270 },
        { ...baseSubjects.socialstudies, description: "Cultures, Government & Geography", totalLessons: 25, completedLessons: 10, estimatedTime: "6 weeks", difficulty: "Intermediate" as const, points: 210 },
        { ...baseSubjects.technology, description: "Computer Basics & Digital Citizenship", totalLessons: 20, completedLessons: 5, estimatedTime: "5 weeks", difficulty: "Beginner" as const, points: 180 }
      ],
      4: [
        { ...baseSubjects.mathematics, description: "Decimals, Geometry & Data Analysis", totalLessons: 35, completedLessons: 22, estimatedTime: "9 weeks", difficulty: "Intermediate" as const, points: 300 },
        { ...baseSubjects.science, description: "Energy, Ecosystems & Human Body", totalLessons: 32, completedLessons: 16, estimatedTime: "8 weeks", difficulty: "Intermediate" as const, points: 280 },
        { ...baseSubjects.languages, description: "Essays, Literature & Public Speaking", totalLessons: 38, completedLessons: 25, estimatedTime: "12 weeks", difficulty: "Intermediate" as const, points: 320 },
        { ...baseSubjects.socialstudies, description: "History, Economics & World Regions", totalLessons: 30, completedLessons: 14, estimatedTime: "8 weeks", difficulty: "Intermediate" as const, points: 260 },
        { ...baseSubjects.technology, description: "Coding Basics, Apps & Internet Safety", totalLessons: 25, completedLessons: 8, estimatedTime: "6 weeks", difficulty: "Intermediate" as const, points: 230 }
      ],
      5: [
        { ...baseSubjects.mathematics, description: "Algebra Basics, Ratios & Probability", totalLessons: 40, completedLessons: 28, estimatedTime: "10 weeks", difficulty: "Intermediate" as const, points: 350 },
        { ...baseSubjects.science, description: "Chemistry Intro, Space & Scientific Method", totalLessons: 38, completedLessons: 20, estimatedTime: "9 weeks", difficulty: "Intermediate" as const, points: 330 },
        { ...baseSubjects.languages, description: "Creative Writing, Analysis & Debate", totalLessons: 42, completedLessons: 30, estimatedTime: "14 weeks", difficulty: "Advanced" as const, points: 370 },
        { ...baseSubjects.socialstudies, description: "World History, Politics & Current Events", totalLessons: 35, completedLessons: 18, estimatedTime: "10 weeks", difficulty: "Intermediate" as const, points: 310 },
        { ...baseSubjects.technology, description: "Web Design, Robotics & AI Basics", totalLessons: 30, completedLessons: 12, estimatedTime: "8 weeks", difficulty: "Intermediate" as const, points: 280 }
      ],
      6: [
        { ...baseSubjects.mathematics, description: "Advanced Algebra, Geometry & Statistics", totalLessons: 45, completedLessons: 32, estimatedTime: "12 weeks", difficulty: "Advanced" as const, points: 400 },
        { ...baseSubjects.science, description: "Physics, Chemistry, Biology & Lab Work", totalLessons: 42, completedLessons: 25, estimatedTime: "11 weeks", difficulty: "Advanced" as const, points: 380 },
        { ...baseSubjects.languages, description: "Advanced Literature, Research & Media", totalLessons: 48, completedLessons: 35, estimatedTime: "16 weeks", difficulty: "Advanced" as const, points: 420 },
        { ...baseSubjects.socialstudies, description: "Global Studies, Philosophy & Leadership", totalLessons: 40, completedLessons: 22, estimatedTime: "12 weeks", difficulty: "Advanced" as const, points: 360 },
        { ...baseSubjects.technology, description: "Programming, AI, Robotics & Digital Innovation", totalLessons: 38, completedLessons: 15, estimatedTime: "10 weeks", difficulty: "Advanced" as const, points: 340 }
      ]
    };

    return gradeContent[grade as keyof typeof gradeContent] || gradeContent[6];
  };

  const subjects = getGradeSpecificSubjects(selectedGrade);

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
                       Grade {selectedGrade} • {subjects.length} Subjects • 
                       {selectedGrade <= 2 ? 'Beginner' : selectedGrade <= 4 ? 'Intermediate' : 'Advanced'}
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