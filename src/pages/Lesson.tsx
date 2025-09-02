import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Trophy, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Header from "@/components/Header";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/contexts/AuthContext";

const Lesson = () => {
  const { subjectId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateProgress } = useUserProgress();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const lessonData = {
    science: {
      1: {
        title: "Introduction to Physics",
        content: [
          {
            type: "intro",
            title: "What is Physics?",
            content: "Physics is the science that studies matter, energy, and their interactions. It helps us understand how the universe works, from the smallest particles to the largest galaxies."
          },
          {
            type: "content",
            title: "Key Concepts",
            content: "Physics covers many areas including mechanics (motion and forces), thermodynamics (heat and energy), electromagnetism (electricity and magnetism), and quantum mechanics (behavior of atoms and particles)."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What does physics primarily study?",
            options: [
              "Only living organisms",
              "Matter, energy, and their interactions", 
              "Chemical reactions only",
              "Earth's geography"
            ],
            correct: 1
          }
        ]
      }
    },
    mathematics: {
      1: {
        title: "Algebra Fundamentals", 
        content: [
          {
            type: "intro",
            title: "What is Algebra?",
            content: "Algebra is a branch of mathematics that uses symbols (usually letters) to represent unknown numbers or values. These symbols allow us to solve problems and express mathematical relationships."
          },
          {
            type: "content", 
            title: "Variables and Expressions",
            content: "A variable is a symbol (like x or y) that represents an unknown value. An expression combines variables, numbers, and operations. For example: 3x + 5 is an algebraic expression."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "In the expression 2x + 7, what is 'x' called?",
            options: [
              "A constant",
              "A variable",
              "An operation", 
              "A coefficient"
            ],
            correct: 1
          }
        ]
      }
    },
    technology: {
      1: {
        title: "What is Programming?",
        content: [
          {
            type: "intro",
            title: "Introduction to Programming",
            content: "Programming is the process of creating instructions for computers to follow. Think of it as giving step-by-step directions to solve problems or complete tasks."
          },
          {
            type: "content",
            title: "Why Learn Programming?",
            content: "Programming helps develop logical thinking, problem-solving skills, and creativity. It's used to create websites, mobile apps, games, and even control robots and AI systems!"
          },
          {
            type: "quiz",
            title: "Quick Check", 
            question: "What is programming?",
            options: [
              "Playing video games",
              "Creating instructions for computers",
              "Using social media",
              "Watching movies"
            ],
            correct: 1
          }
        ]
      }
    }
  };

  const lesson = lessonData[subjectId as keyof typeof lessonData]?.[parseInt(lessonId || "1")];
  
  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  const currentContent = lesson.content[currentStep];
  const isLastStep = currentStep === lesson.content.length - 1;
  const progressPercentage = ((currentStep + 1) / lesson.content.length) * 100;

  const handleNext = async () => {
    if (currentContent.type === "quiz") {
      if (!selectedAnswer) return;
      
      const isCorrect = parseInt(selectedAnswer) === currentContent.correct;
      if (isCorrect) {
        setScore(score + 10);
      }
      setShowResults(true);
      
      setTimeout(async () => {
        if (isLastStep) {
          // Lesson completed - save progress
          if (user && subjectId && lessonId) {
            try {
              await updateProgress(subjectId, lessonId, true, score + (isCorrect ? 10 : 0));
              toast.success("Lesson completed! Next lesson unlocked.");
            } catch (error) {
              console.error('Error saving progress:', error);
              toast.error("Progress saved locally. Please sync when online.");
            }
          }
          navigate(`/subject/${subjectId}?completed=${lessonId}`);
        } else {
          setCurrentStep(currentStep + 1);
          setSelectedAnswer("");
          setShowResults(false);
        }
      }, 2000);
    } else {
      if (isLastStep) {
        // Lesson completed - save progress
        if (user && subjectId && lessonId) {
          try {
            await updateProgress(subjectId, lessonId, true, score);
            toast.success("Lesson completed! Next lesson unlocked.");
          } catch (error) {
            console.error('Error saving progress:', error);
            toast.error("Progress saved locally. Please sync when online.");
          }
        }
        navigate(`/subject/${subjectId}?completed=${lessonId}`);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedAnswer("");
      setShowResults(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(`/subject/${subjectId}`)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {subjectId}
            </Button>
            
            <Badge variant="outline" className="text-primary border-primary">
              Lesson {lessonId}
            </Badge>
          </div>

          {/* Lesson Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            
            {/* Progress */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{currentStep + 1}/{lesson.content.length}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <Card className="min-h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentContent.type === "intro" && <Play className="h-5 w-5 text-primary" />}
                {currentContent.type === "content" && <BookOpen className="h-5 w-5 text-secondary" />}
                {currentContent.type === "quiz" && <Trophy className="h-5 w-5 text-accent" />}
                {currentContent.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {currentContent.type === "quiz" ? (
                <div className="space-y-6">
                  <p className="text-lg">{currentContent.question}</p>
                  
                  {!showResults ? (
                    <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                      {currentContent.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="space-y-4">
                      {currentContent.options.map((option, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg border ${
                            index === currentContent.correct 
                              ? 'bg-success/10 border-success text-success' 
                              : parseInt(selectedAnswer) === index && index !== currentContent.correct
                                ? 'bg-destructive/10 border-destructive text-destructive'
                                : 'bg-muted'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {index === currentContent.correct && <CheckCircle className="h-4 w-4" />}
                            {option}
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-center p-4">
                        {parseInt(selectedAnswer) === currentContent.correct ? (
                          <div className="text-success">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                            <p className="font-semibold">Correct! +10 points</p>
                          </div>
                        ) : (
                          <div className="text-destructive">
                            <p className="font-semibold">Not quite right. Keep learning!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="prose max-w-none">
                  <p className="text-lg leading-relaxed">{currentContent.content}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Points earned: {score}
            </div>
            
            <Button 
              onClick={handleNext}
              disabled={currentContent.type === "quiz" && !selectedAnswer && !showResults}
            >
              {isLastStep ? "Complete Lesson" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Lesson;