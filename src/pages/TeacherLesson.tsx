import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, BookOpen, CheckCircle, Clock, Award } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProgress } from "@/hooks/useUserProgress";

interface TeacherContent {
  id: string;
  title: string;
  description: string;
  subject_id: string;
  difficulty: string;
  estimated_duration: number;
  content: Array<{
    type: string;
    title: string;
    content?: string;
    question?: string;
    options?: string[];
    correct?: number;
  }>;
}

const TeacherLesson = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateProgress } = useUserProgress();
  
  const [lesson, setLesson] = useState<TeacherContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_content')
        .select('*')
        .eq('id', lessonId)
        .eq('status', 'approved')
        .single();

      if (error) throw error;
      
      // Transform the data to match our interface
      if (data) {
        setLesson({
          id: data.id,
          title: data.title,
          description: data.description || '',
          subject_id: data.subject_id,
          difficulty: data.difficulty,
          estimated_duration: data.estimated_duration,
          content: data.content as Array<{
            type: string;
            title: string;
            content?: string;
            question?: string;
            options?: string[];
            correct?: number;
          }>
        });
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
      toast.error('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (lesson && currentSection < lesson.content.length - 1) {
      setCurrentSection(currentSection + 1);
      setSelectedAnswer(null);
      setShowQuizResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setSelectedAnswer(null);
      setShowQuizResult(false);
    }
  };

  const handleSubmitQuiz = () => {
    if (selectedAnswer === null) {
      toast.error('Please select an answer');
      return;
    }

    const quizSection = lesson?.content[currentSection];
    if (quizSection && quizSection.type === 'quiz') {
      const isCorrect = selectedAnswer === quizSection.correct;
      setQuizCorrect(isCorrect);
      setShowQuizResult(true);

      if (isCorrect) {
        toast.success('Correct! Well done!');
      } else {
        toast.error('Not quite right. Try reviewing the lesson.');
      }
    }
  };

  const handleCompleteLesson = async () => {
    if (!user || !lesson) return;

    try {
      const score = quizCorrect ? 100 : 50;
      await updateProgress(lesson.subject_id, lesson.id, true, score);
      
      toast.success('Lesson completed!', {
        description: `You earned ${score} points!`
      });
      
      navigate(`/subject/${lesson.subject_id}`);
    } catch (error) {
      console.error('Error completing lesson:', error);
      toast.error('Failed to save progress');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16">
          <div className="text-center">Loading lesson...</div>
        </main>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16">
          <div className="text-center">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Lesson Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This lesson is not available or hasn't been approved yet.
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const currentContent = lesson.content[currentSection];
  const isLastSection = currentSection === lesson.content.length - 1;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/subject/${lesson.subject_id}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Button>

        {/* Lesson Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl mb-2">{lesson.title}</CardTitle>
                <p className="text-muted-foreground">{lesson.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <Badge variant="secondary" className="capitalize">{lesson.difficulty}</Badge>
                  <Badge variant="outline" className="capitalize">{lesson.subject_id}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{lesson.estimated_duration} min</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-6">
          {lesson.content.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index === currentSection
                  ? 'bg-primary'
                  : index < currentSection
                  ? 'bg-success'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Content Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentContent.type === 'quiz' && (
                <Award className="h-5 w-5 text-warning" />
              )}
              {currentContent.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentContent.type === 'quiz' ? (
              <div className="space-y-6">
                <p className="text-lg font-medium">{currentContent.question}</p>
                
                <RadioGroup 
                  value={selectedAnswer?.toString()} 
                  onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                  disabled={showQuizResult}
                >
                  {currentContent.options?.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-4 rounded-lg border transition-colors ${
                        showQuizResult
                          ? index === currentContent.correct
                            ? 'border-success bg-success/10'
                            : index === selectedAnswer
                            ? 'border-destructive bg-destructive/10'
                            : 'border-border'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                      {showQuizResult && index === currentContent.correct && (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                    </div>
                  ))}
                </RadioGroup>

                {showQuizResult && (
                  <div className={`p-4 rounded-lg ${
                    quizCorrect ? 'bg-success/10 border border-success' : 'bg-warning/10 border border-warning'
                  }`}>
                    <p className="font-medium">
                      {quizCorrect 
                        ? '🎉 Excellent work! You got it right!' 
                        : '💡 Not quite. Review the lesson content and try again.'}
                    </p>
                  </div>
                )}

                {!showQuizResult && (
                  <Button onClick={handleSubmitQuiz} className="w-full">
                    Submit Answer
                  </Button>
                )}
              </div>
            ) : (
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {currentContent.content?.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 0}
          >
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Section {currentSection + 1} of {lesson.content.length}
          </span>

          {isLastSection && showQuizResult ? (
            <Button onClick={handleCompleteLesson}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Lesson
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={currentSection === lesson.content.length - 1}
            >
              Next
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeacherLesson;
