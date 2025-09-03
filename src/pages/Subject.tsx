import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Lock, CheckCircle, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/contexts/AuthContext";

const Subject = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isLessonCompleted, isLessonUnlocked, getCompletedLessonsCount, loading } = useUserProgress();

  const subjectData = {
    science: {
      name: "Science",
      description: "Physics, Chemistry, Biology & more",
      color: "hsl(213 94% 68%)",
      totalLessons: 6,
      completedLessons: 0,
      lessons: [
        { id: 1, title: "Introduction to Physics", duration: "15 min", completed: false, locked: false },
        { id: 2, title: "Newton's Laws of Motion", duration: "20 min", completed: false, locked: true },
        { id: 3, title: "Energy and Work", duration: "18 min", completed: false, locked: true },
        { id: 4, title: "Chemistry Basics", duration: "22 min", completed: false, locked: true },
        { id: 5, title: "Biology Fundamentals", duration: "25 min", completed: false, locked: true },
        { id: 6, title: "Environmental Science", duration: "20 min", completed: false, locked: true },
      ]
    },
    mathematics: {
      name: "Mathematics", 
      description: "Algebra, Geometry, Calculus & Statistics",
      color: "hsl(25 95% 53%)",
      totalLessons: 6,
      completedLessons: 0,
      lessons: [
        { id: 1, title: "Algebra Fundamentals", duration: "18 min", completed: false, locked: false },
        { id: 2, title: "Linear Equations", duration: "22 min", completed: false, locked: true },
        { id: 3, title: "Quadratic Functions", duration: "25 min", completed: false, locked: true },
        { id: 4, title: "Geometry Basics", duration: "20 min", completed: false, locked: true },
        { id: 5, title: "Trigonometry", duration: "28 min", completed: false, locked: true },
        { id: 6, title: "Statistics & Probability", duration: "30 min", completed: false, locked: true },
      ]
    },
    technology: {
      name: "Technology",
      description: "Programming, AI, Robotics & Digital Skills", 
      color: "hsl(158 64% 52%)",
      totalLessons: 6,
      completedLessons: 0,
      lessons: [
        { id: 1, title: "What is Programming?", duration: "12 min", completed: false, locked: false },
        { id: 2, title: "HTML & CSS Basics", duration: "25 min", completed: false, locked: true },
        { id: 3, title: "JavaScript Fundamentals", duration: "30 min", completed: false, locked: true },
        { id: 4, title: "Building Your First Website", duration: "35 min", completed: false, locked: true },
        { id: 5, title: "Introduction to AI", duration: "20 min", completed: false, locked: true },
        { id: 6, title: "Robotics Basics", duration: "28 min", completed: false, locked: true },
      ]
    },
    languages: {
      name: "Languages",
      description: "English, Spanish, French & Communication Skills",
      color: "hsl(280 87% 65%)",
      totalLessons: 6,
      completedLessons: 0,
      lessons: [
        { id: 1, title: "English Grammar Basics", duration: "20 min", completed: false, locked: false },
        { id: 2, title: "Spanish Fundamentals", duration: "25 min", completed: false, locked: true },
        { id: 3, title: "French Introduction", duration: "22 min", completed: false, locked: true },
        { id: 4, title: "Creative Writing", duration: "30 min", completed: false, locked: true },
        { id: 5, title: "Public Speaking", duration: "28 min", completed: false, locked: true },
        { id: 6, title: "Literature Analysis", duration: "35 min", completed: false, locked: true },
      ]
    },
    socialstudies: {
      name: "Social Studies",
      description: "History, Geography, Civics & Culture",
      color: "hsl(45 86% 58%)",
      totalLessons: 6,
      completedLessons: 0,
      lessons: [
        { id: 1, title: "World History Overview", duration: "25 min", completed: false, locked: false },
        { id: 2, title: "Geography Fundamentals", duration: "20 min", completed: false, locked: true },
        { id: 3, title: "Government & Civics", duration: "30 min", completed: false, locked: true },
        { id: 4, title: "Cultural Studies", duration: "28 min", completed: false, locked: true },
        { id: 5, title: "Economics Basics", duration: "22 min", completed: false, locked: true },
        { id: 6, title: "Current Events Analysis", duration: "25 min", completed: false, locked: true },
      ]
    }
  };

  const subject = subjectData[subjectId as keyof typeof subjectData];
  
  if (!subject) {
    return <div>Subject not found</div>;
  }

  const completedLessonsCount = user ? getCompletedLessonsCount(subjectId || '') : subject.completedLessons;
  const progressPercentage = (completedLessonsCount / subject.totalLessons) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="space-y-6">
          {/* Back Button & Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Subject Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl"
                style={{ background: subject.color }}
              >
                📚
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{subject.name}</h1>
                <p className="text-muted-foreground">{subject.description}</p>
              </div>
            </div>

            {/* Progress */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Course Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {completedLessonsCount}/{subject.totalLessons} lessons completed
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>~{Math.round(subject.totalLessons * 20 / 60)} hours total</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      <span>{completedLessonsCount * 10} points earned</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lessons */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Lessons</h2>
            <div className="grid gap-4">
              {loading ? (
                <div className="text-center py-8">Loading lessons...</div>
              ) : (
                subject.lessons.map((lesson) => {
                  const lessonId = lesson.id.toString();
                  const completed = user ? isLessonCompleted(subjectId || '', lessonId) : lesson.completed;
                  const locked = user ? !isLessonUnlocked(subjectId || '', lessonId) : lesson.locked;
                  
                  return (
                    <Card 
                      key={lesson.id} 
                      className={`transition-all duration-200 ${
                        locked 
                          ? 'opacity-60 cursor-not-allowed' 
                          : 'hover:shadow-md cursor-pointer'
                      }`}
                      onClick={() => {
                        if (!locked) {
                          navigate(`/lesson/${subjectId}/${lesson.id}`);
                        }
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              completed 
                                ? 'bg-success/10 text-success' 
                                : locked 
                                  ? 'bg-muted text-muted-foreground'
                                  : 'bg-primary/10 text-primary'
                            }`}>
                              {completed ? (
                                <CheckCircle className="h-6 w-6" />
                              ) : locked ? (
                                <Lock className="h-6 w-6" />
                              ) : (
                                <Play className="h-6 w-6" />
                              )}
                            </div>
                            
                            <div>
                              <h3 className="font-semibold">{lesson.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{lesson.duration}</span>
                                {completed && (
                                  <Badge variant="secondary" className="text-xs">
                                    Completed
                                  </Badge>
                                )}
                                {locked && (
                                  <Badge variant="outline" className="text-xs">
                                    Locked
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {!locked && (
                            <Button 
                              variant={completed ? "secondary" : "default"}
                              size="sm"
                            >
                              {completed ? 'Review' : 'Start'}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Subject;