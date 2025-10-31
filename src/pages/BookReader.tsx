import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Star, CheckCircle } from "lucide-react";
import { toast } from "sonner";

// Book content data structure
interface BookContent {
  id: string;
  title: string;
  author: string;
  subject: string;
  grade: string;
  rating: number;
  coverColor: string;
  chapters: {
    id: number;
    title: string;
    content: string;
  }[];
}

const bookContents: { [key: string]: BookContent } = {
  // Science Books
  sci1: {
    id: "sci1",
    title: "The Wonders of Space",
    author: "Dr. Sarah Chen",
    subject: "science",
    grade: "4-6",
    rating: 4.8,
    coverColor: "hsl(213 94% 68%)",
    chapters: [
      {
        id: 1,
        title: "Introduction to Our Solar System",
        content: `Welcome to the amazing journey through space! Our solar system is home to eight planets, countless moons, asteroids, and comets, all orbiting around our sun.\n\nThe Sun is the center of our solar system and provides light and heat to all the planets. It's so large that over one million Earths could fit inside it!\n\nThe planets are divided into two groups:\n• Inner Planets (Rocky): Mercury, Venus, Earth, and Mars\n• Outer Planets (Gas Giants): Jupiter, Saturn, Uranus, and Neptune\n\nEach planet is unique with its own characteristics, and in the following chapters, we'll explore what makes each one special.`
      },
      {
        id: 2,
        title: "The Inner Planets",
        content: `The inner planets are called rocky planets because they have solid surfaces.\n\nMercury is the closest planet to the Sun and the smallest planet. It has extreme temperatures - very hot during the day and freezing at night.\n\nVenus is often called Earth's twin because of similar size, but it's very different! It has thick clouds of acid and is the hottest planet.\n\nEarth is our home planet - the only one known to support life. It has water, oxygen, and the perfect conditions for living things.\n\nMars is called the Red Planet because of its rusty-red surface. Scientists are studying Mars to see if it once had water and possibly life.`
      },
      {
        id: 3,
        title: "The Gas Giants",
        content: `The outer planets are massive balls of gas with no solid surface to stand on!\n\nJupiter is the largest planet in our solar system. It has a famous red spot that's actually a giant storm larger than Earth! Jupiter has over 79 moons.\n\nSaturn is famous for its beautiful rings made of ice and rock. It's the second-largest planet and has at least 82 moons.\n\nUranus spins on its side, making it unique among planets. It appears blue-green due to methane in its atmosphere.\n\nNeptune is the windiest planet with storms reaching speeds of 1,200 mph! It's dark, cold, and far from the Sun.`
      }
    ]
  },
  math1: {
    id: "math1",
    title: "Numbers Come Alive",
    author: "Prof. Patricia Johnson",
    subject: "mathematics",
    grade: "1-3",
    rating: 4.9,
    coverColor: "hsl(25 95% 53%)",
    chapters: [
      {
        id: 1,
        title: "The Magic of Numbers",
        content: `Numbers are everywhere around us! They help us count, measure, and understand the world.\n\nLet's start with the basics:\n• Numbers 1-10 are the foundation of all math\n• Each number represents a quantity\n• We use numbers every day - counting toys, telling time, measuring ingredients!\n\nFun Fact: The number zero (0) is special - it means "nothing" but it's very important in math!\n\nPractice counting objects around your room. How many books do you have? How many windows? Counting is the first step to becoming a math wizard!`
      },
      {
        id: 2,
        title: "Addition Adventures",
        content: `Addition means putting things together! When we add, we combine groups to find out how many we have in total.\n\nThe plus sign (+) means "add" or "put together"\nThe equals sign (=) means "the same as"\n\nExample: 2 + 3 = 5\nThis means: 2 apples plus 3 apples equals 5 apples total!\n\nTips for Adding:\n• Start with the smaller number and count up\n• Use your fingers to help\n• Draw pictures to visualize\n\nTry this: If you have 4 crayons and your friend gives you 2 more, how many crayons do you have now? (Answer: 6!)`
      },
      {
        id: 3,
        title: "Subtraction Stories",
        content: `Subtraction means taking away! When we subtract, we remove items from a group.\n\nThe minus sign (-) means "take away"\n\nExample: 5 - 2 = 3\nThis means: 5 cookies minus 2 cookies eaten equals 3 cookies left!\n\nTips for Subtracting:\n• Start with the bigger number\n• Count backward\n• Use objects to help you see the problem\n\nPractice Problem: You have 7 balloons, but 3 fly away. How many balloons do you have left? (Answer: 4!)\n\nRemember: Subtraction is the opposite of addition!`
      }
    ]
  },
  tech1: {
    id: "tech1",
    title: "Coding for Beginners",
    author: "Alex Turner",
    subject: "technology",
    grade: "4-6",
    rating: 4.8,
    coverColor: "hsl(158 64% 52%)",
    chapters: [
      {
        id: 1,
        title: "What is Coding?",
        content: `Coding, also called programming, is like giving instructions to a computer. Just like you follow a recipe to bake cookies, computers follow code to perform tasks!\n\nWhy Learn to Code?\n• Create your own games and apps\n• Solve problems creatively\n• Understand how technology works\n• Prepare for future careers\n\nProgramming Languages:\nJust like humans speak different languages (English, Spanish, Chinese), computers understand different programming languages. Python is one of the easiest languages to start with!\n\nFun Fact: The first computer programmer was Ada Lovelace in the 1840s!`
      },
      {
        id: 2,
        title: "Your First Python Program",
        content: `Let's write your first line of code! In Python, we can make the computer display messages using the print() function.\n\nExample:\nprint("Hello, World!")\n\nThis tells the computer to show the text "Hello, World!" on the screen.\n\nTry It Yourself:\nprint("My name is [Your Name]")\nprint("I am learning to code!")\n\nVariables:\nVariables are like containers that store information.\n\nExample:\nname = "Alex"\nage = 12\nprint("My name is", name)\nprint("I am", age, "years old")\n\nVariables let you save and reuse information in your programs!`
      },
      {
        id: 3,
        title: "Making Decisions with Code",
        content: `Computers can make decisions using IF statements. This is like teaching the computer to think!\n\nIF Statement Structure:\nif condition:\n    do something\nelse:\n    do something different\n\nExample:\nage = 10\nif age >= 13:\n    print("You are a teenager!")\nelse:\n    print("You are a kid!")\n\nComparison Operators:\n• == (equals)\n• != (not equals)\n• > (greater than)\n• < (less than)\n• >= (greater than or equal)\n• <= (less than or equal)\n\nPractice: Write code that checks if a number is positive or negative!`
      }
    ]
  }
};

const BookReader = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [currentChapter, setCurrentChapter] = useState(0);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);

  const book = bookId ? bookContents[bookId] : null;

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16">
          <div className="container text-center">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Book Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This book is not available yet. More content coming soon!
            </p>
            <Button onClick={() => navigate("/library")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const chapter = book.chapters[currentChapter];
  const progress = ((completedChapters.length + (currentChapter === book.chapters.length - 1 && completedChapters.includes(currentChapter) ? 0 : 0)) / book.chapters.length) * 100;

  const handleNextChapter = () => {
    if (currentChapter < book.chapters.length - 1) {
      if (!completedChapters.includes(currentChapter)) {
        setCompletedChapters([...completedChapters, currentChapter]);
        toast.success("Chapter completed!");
      }
      setCurrentChapter(currentChapter + 1);
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const handleCompleteBook = () => {
    if (!completedChapters.includes(currentChapter)) {
      setCompletedChapters([...completedChapters, currentChapter]);
    }
    toast.success(`Congratulations! You've finished "${book.title}"!`, {
      description: "Keep learning and explore more books in the library."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container max-w-4xl">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate("/library")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>

          {/* Book Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div 
                    className="h-20 w-16 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: book.coverColor }}
                  >
                    <BookOpen className="h-8 w-8 text-white/80" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-1">{book.title}</CardTitle>
                    <p className="text-muted-foreground">by {book.author}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="secondary">Grade {book.grade}</Badge>
                      <Badge variant="outline" className="capitalize">{book.subject}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span className="text-sm font-medium">{book.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reading Progress</span>
                  <span className="font-medium">
                    {completedChapters.length} / {book.chapters.length} chapters
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Chapter Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={handlePreviousChapter}
              disabled={currentChapter === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Chapter {currentChapter + 1} of {book.chapters.length}
              </p>
            </div>
            <Button
              onClick={currentChapter === book.chapters.length - 1 ? handleCompleteBook : handleNextChapter}
              disabled={currentChapter === book.chapters.length - 1 && completedChapters.includes(currentChapter)}
            >
              {currentChapter === book.chapters.length - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Book
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Chapter Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {completedChapters.includes(currentChapter) && (
                  <CheckCircle className="h-5 w-5 text-success" />
                )}
                {chapter.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {chapter.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BookReader;
