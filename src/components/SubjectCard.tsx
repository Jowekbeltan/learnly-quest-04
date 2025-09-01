import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Clock, Award, BookOpen } from "lucide-react";

interface SubjectCardProps {
  subject: {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    backgroundImage: string;
    totalLessons: number;
    completedLessons: number;
    estimatedTime: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    points: number;
    color: string;
  };
}

const SubjectCard = ({ subject }: SubjectCardProps) => {
  const progressPercentage = (subject.completedLessons / subject.totalLessons) * 100;
  
  const difficultyColors = {
    'Beginner': 'bg-secondary/10 text-secondary',
    'Intermediate': 'bg-warning/10 text-warning',
    'Advanced': 'bg-destructive/10 text-destructive'
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-card-hover transition-all duration-300 cursor-pointer">
      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
        <img 
          src={subject.backgroundImage} 
          alt={`${subject.name} background`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${subject.color}40, ${subject.color}10)` }}></div>
      </div>
      
      <CardContent className="relative p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ background: subject.color }}
            >
              {subject.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {subject.name}
              </h3>
              <p className="text-sm text-muted-foreground">{subject.description}</p>
            </div>
          </div>
          
          <Badge className={difficultyColors[subject.difficulty]}>
            {subject.difficulty}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{subject.completedLessons}/{subject.totalLessons} lessons</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{subject.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{subject.totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span>{subject.points} pts</span>
            </div>
          </div>
        </div>

        <Button 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant="ghost"
        >
          {subject.completedLessons > 0 ? 'Continue Learning' : 'Start Learning'}
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubjectCard;