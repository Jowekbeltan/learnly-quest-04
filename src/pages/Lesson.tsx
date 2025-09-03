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
      },
      2: {
        title: "Newton's Laws of Motion",
        content: [
          {
            type: "intro",
            title: "Understanding Motion",
            content: "Newton's three laws of motion describe the relationship between forces acting on objects and their motion. These laws form the foundation of classical mechanics."
          },
          {
            type: "content",
            title: "The Three Laws",
            content: "First Law: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force. Second Law: Force equals mass times acceleration (F=ma). Third Law: For every action, there is an equal and opposite reaction."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What is Newton's First Law of Motion?",
            options: [
              "F = ma",
              "Objects in motion stay in motion unless acted upon by a force",
              "Every action has an equal and opposite reaction",
              "Energy cannot be created or destroyed"
            ],
            correct: 1
          }
        ]
      },
      3: {
        title: "Energy and Work",
        content: [
          {
            type: "intro",
            title: "What is Energy?",
            content: "Energy is the capacity to do work or cause change. It exists in many forms including kinetic energy (motion), potential energy (stored), thermal energy (heat), and more."
          },
          {
            type: "content",
            title: "Work and Energy Relationship",
            content: "Work is done when a force moves an object through a distance. The work-energy theorem states that the work done on an object equals the change in its kinetic energy. Work = Force × Distance × cos(angle)."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What is the formula for work?",
            options: [
              "W = F × d",
              "W = m × a",
              "W = 1/2mv²",
              "W = mgh"
            ],
            correct: 0
          }
        ]
      },
      4: {
        title: "Chemistry Basics",
        content: [
          {
            type: "intro",
            title: "Introduction to Chemistry",
            content: "Chemistry is the study of matter and its properties, composition, structure, and the changes it undergoes during chemical reactions."
          },
          {
            type: "content",
            title: "Atoms and Elements",
            content: "All matter is made up of atoms, which are the basic building blocks of elements. The periodic table organizes elements by their atomic number (number of protons)."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What determines an element's position on the periodic table?",
            options: [
              "Atomic mass",
              "Atomic number (number of protons)",
              "Number of electrons",
              "Number of neutrons"
            ],
            correct: 1
          }
        ]
      },
      5: {
        title: "Biology Fundamentals",
        content: [
          {
            type: "intro",
            title: "What is Biology?",
            content: "Biology is the study of living things and their vital processes. It encompasses everything from microscopic bacteria to complex ecosystems."
          },
          {
            type: "content",
            title: "Cells - The Building Blocks of Life",
            content: "All living things are made of cells. Cells are the smallest units of life and contain everything needed for an organism to survive and reproduce."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What are cells?",
            options: [
              "The smallest units of life",
              "Chemical compounds",
              "Energy sources",
              "Waste products"
            ],
            correct: 0
          }
        ]
      },
      6: {
        title: "Environmental Science",
        content: [
          {
            type: "intro",
            title: "Understanding Our Environment",
            content: "Environmental science studies the interactions between the physical, chemical, and biological components of the environment, and their effects on living organisms."
          },
          {
            type: "content",
            title: "Ecosystems and Balance",
            content: "Ecosystems are communities of living organisms interacting with their physical environment. Maintaining balance in ecosystems is crucial for sustainability and biodiversity."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What is an ecosystem?",
            options: [
              "A single species",
              "A community of organisms interacting with their environment",
              "Only plants and animals",
              "Just the physical environment"
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
      },
      2: {
        title: "Linear Equations",
        content: [
          {
            type: "intro",
            title: "Understanding Linear Equations",
            content: "A linear equation is an equation where the highest power of the variable is 1. These equations form straight lines when graphed and have the form y = mx + b."
          },
          {
            type: "content",
            title: "Solving Linear Equations",
            content: "To solve linear equations, we isolate the variable by performing the same operation on both sides of the equation. The goal is to get the variable by itself on one side."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What is the solution to 2x + 6 = 14?",
            options: [
              "x = 4",
              "x = 8",
              "x = 10",
              "x = 2"
            ],
            correct: 0
          }
        ]
      },
      3: {
        title: "Quadratic Functions",
        content: [
          {
            type: "intro",
            title: "Introduction to Quadratics",
            content: "Quadratic functions are polynomial functions with degree 2. They have the form f(x) = ax² + bx + c and create parabolic curves when graphed."
          },
          {
            type: "content",
            title: "Properties of Parabolas",
            content: "Parabolas have a vertex (highest or lowest point), an axis of symmetry, and may have x-intercepts (roots). The coefficient 'a' determines if the parabola opens upward or downward."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What shape does a quadratic function make when graphed?",
            options: [
              "A straight line",
              "A circle",
              "A parabola",
              "A triangle"
            ],
            correct: 2
          }
        ]
      },
      4: {
        title: "Geometry Basics",
        content: [
          {
            type: "intro",
            title: "Welcome to Geometry",
            content: "Geometry is the branch of mathematics that deals with shapes, sizes, positions, and properties of space. It includes points, lines, angles, surfaces, and solids."
          },
          {
            type: "content",
            title: "Basic Geometric Shapes",
            content: "Common shapes include triangles, squares, rectangles, circles, and polygons. Each shape has unique properties regarding area, perimeter, angles, and symmetry."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "How many sides does a triangle have?",
            options: [
              "2",
              "3",
              "4",
              "5"
            ],
            correct: 1
          }
        ]
      },
      5: {
        title: "Trigonometry",
        content: [
          {
            type: "intro",
            title: "Understanding Trigonometry",
            content: "Trigonometry studies the relationships between angles and sides in triangles. It's essential for understanding waves, oscillations, and periodic phenomena."
          },
          {
            type: "content",
            title: "Basic Trigonometric Ratios",
            content: "The three main ratios are sine (opposite/hypotenuse), cosine (adjacent/hypotenuse), and tangent (opposite/adjacent). Remember: SOH-CAH-TOA!"
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What does SOH stand for in trigonometry?",
            options: [
              "Sine = Opposite/Hypotenuse",
              "Sum of Heights",
              "Square of Hypotenuse",
              "Side over Height"
            ],
            correct: 0
          }
        ]
      },
      6: {
        title: "Statistics & Probability",
        content: [
          {
            type: "intro",
            title: "Introduction to Statistics",
            content: "Statistics is the science of collecting, analyzing, and interpreting data. Probability measures the likelihood of events occurring."
          },
          {
            type: "content",
            title: "Measures of Central Tendency",
            content: "Mean (average), median (middle value), and mode (most frequent value) are measures that describe the center of a data set. Each gives different insights into the data."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What is the median of: 2, 4, 6, 8, 10?",
            options: [
              "4",
              "6",
              "8",
              "5"
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
      },
      2: {
        title: "HTML & CSS Basics",
        content: [
          {
            type: "intro",
            title: "Building Websites",
            content: "HTML (HyperText Markup Language) provides the structure of web pages, while CSS (Cascading Style Sheets) controls the appearance and layout."
          },
          {
            type: "content",
            title: "HTML Elements and Tags",
            content: "HTML uses tags to define elements like headings (<h1>), paragraphs (<p>), links (<a>), and images (<img>). Tags are enclosed in angle brackets and usually come in pairs."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What does HTML stand for?",
            options: [
              "High Tech Modern Language",
              "HyperText Markup Language",
              "Home Tool Management Language",
              "Hyperlink and Text Markup Language"
            ],
            correct: 1
          }
        ]
      },
      3: {
        title: "JavaScript Fundamentals",
        content: [
          {
            type: "intro",
            title: "Making Websites Interactive",
            content: "JavaScript is a programming language that adds interactivity to websites. It can respond to user actions, manipulate content, and communicate with servers."
          },
          {
            type: "content",
            title: "Variables and Functions",
            content: "Variables store data (let name = 'John'), and functions are reusable blocks of code that perform specific tasks. JavaScript is case-sensitive and uses semicolons to end statements."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What keyword is used to declare a variable in modern JavaScript?",
            options: [
              "var",
              "let",
              "variable",
              "declare"
            ],
            correct: 1
          }
        ]
      },
      4: {
        title: "Building Your First Website",
        content: [
          {
            type: "intro",
            title: "Putting It All Together",
            content: "Now we'll combine HTML, CSS, and JavaScript to create a complete website. We'll learn about project structure, file organization, and best practices."
          },
          {
            type: "content",
            title: "Website Structure",
            content: "A typical website has an index.html file, style.css for styling, and script.js for functionality. Images and other resources go in separate folders for organization."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What is typically the main page of a website called?",
            options: [
              "main.html",
              "index.html",
              "home.html",
              "website.html"
            ],
            correct: 1
          }
        ]
      },
      5: {
        title: "Introduction to AI",
        content: [
          {
            type: "intro",
            title: "Understanding Artificial Intelligence",
            content: "AI is the simulation of human intelligence in machines. It includes machine learning, where computers learn from data without explicit programming for every task."
          },
          {
            type: "content",
            title: "Types of AI",
            content: "Narrow AI (like voice assistants) performs specific tasks, while General AI would match human cognitive abilities. Machine learning, deep learning, and neural networks are key AI technologies."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What is machine learning?",
            options: [
              "Teaching machines to walk",
              "Computers learning from data",
              "Building physical robots",
              "Programming with special languages"
            ],
            correct: 1
          }
        ]
      },
      6: {
        title: "Robotics Basics",
        content: [
          {
            type: "intro",
            title: "Introduction to Robotics",
            content: "Robotics combines engineering, programming, and AI to create machines that can perform tasks autonomously or with human guidance."
          },
          {
            type: "content",
            title: "Robot Components",
            content: "Robots have sensors (to perceive), actuators (to move), controllers (to process), and software (to make decisions). They can be wheeled, legged, or specialized for specific environments."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What do robot sensors do?",
            options: [
              "Make the robot move",
              "Power the robot",
              "Help the robot perceive its environment",
              "Store robot programs"
            ],
            correct: 2
          }
        ]
      }
    },
    languages: {
      1: {
        title: "English Grammar Basics",
        content: [
          {
            type: "intro",
            title: "Understanding Grammar",
            content: "Grammar is the set of rules that govern how we construct sentences. It includes parts of speech, sentence structure, and punctuation that help us communicate clearly."
          },
          {
            type: "content",
            title: "Parts of Speech",
            content: "The main parts of speech are nouns (people, places, things), verbs (actions), adjectives (descriptions), adverbs (modify verbs), pronouns (replace nouns), prepositions (show relationships), and conjunctions (connect words)."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What part of speech describes an action?",
            options: [
              "Noun",
              "Verb",
              "Adjective",
              "Adverb"
            ],
            correct: 1
          }
        ]
      },
      2: {
        title: "Spanish Fundamentals",
        content: [
          {
            type: "intro",
            title: "¡Hola! Welcome to Spanish",
            content: "Spanish is one of the world's most spoken languages. It has clear pronunciation rules and uses gendered nouns (masculine and feminine)."
          },
          {
            type: "content",
            title: "Basic Greetings and Phrases",
            content: "Essential phrases: Hola (Hello), Adiós (Goodbye), Por favor (Please), Gracias (Thank you), ¿Cómo estás? (How are you?), Me llamo... (My name is...)."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "How do you say 'Thank you' in Spanish?",
            options: [
              "Hola",
              "Adiós",
              "Gracias",
              "Por favor"
            ],
            correct: 2
          }
        ]
      },
      3: {
        title: "French Introduction",
        content: [
          {
            type: "intro",
            title: "Bonjour! Welcome to French",
            content: "French is known as the language of love and diplomacy. It has nasal sounds and liaison (connecting sounds between words) that make it musical."
          },
          {
            type: "content",
            title: "Basic French Phrases",
            content: "Key phrases: Bonjour (Hello), Au revoir (Goodbye), S'il vous plaît (Please), Merci (Thank you), Comment allez-vous? (How are you?), Je m'appelle... (My name is...)."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "How do you say 'Hello' in French?",
            options: [
              "Bonjour",
              "Au revoir",
              "Merci",
              "Comment"
            ],
            correct: 0
          }
        ]
      },
      4: {
        title: "Creative Writing",
        content: [
          {
            type: "intro",
            title: "Expressing Yourself Through Writing",
            content: "Creative writing allows you to express ideas, emotions, and stories through various forms like poems, short stories, and descriptive essays."
          },
          {
            type: "content",
            title: "Elements of Good Writing",
            content: "Good writing has a clear purpose, engaging opening, vivid descriptions, logical flow, and strong conclusion. Use active voice, varied sentence structure, and specific details."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What makes writing more engaging?",
            options: [
              "Long sentences only",
              "Vivid descriptions and specific details",
              "Complex vocabulary only",
              "Passive voice"
            ],
            correct: 1
          }
        ]
      },
      5: {
        title: "Public Speaking",
        content: [
          {
            type: "intro",
            title: "Confident Communication",
            content: "Public speaking is the skill of presenting information clearly and confidently to an audience. It's valuable for school, work, and personal situations."
          },
          {
            type: "content",
            title: "Speaking Techniques",
            content: "Key techniques: Make eye contact, use clear voice projection, organize your thoughts, use gestures naturally, practice beforehand, and connect with your audience."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What helps you connect with your audience while speaking?",
            options: [
              "Looking at the floor",
              "Speaking very quietly",
              "Making eye contact",
              "Reading directly from notes"
            ],
            correct: 2
          }
        ]
      },
      6: {
        title: "Literature Analysis",
        content: [
          {
            type: "intro",
            title: "Understanding Literature",
            content: "Literature analysis involves examining texts to understand themes, characters, plot, setting, and the author's techniques and purposes."
          },
          {
            type: "content",
            title: "Literary Elements",
            content: "Key elements include theme (main message), character development, plot structure, setting (time/place), symbolism, and literary devices like metaphors and foreshadowing."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What is the main message or lesson of a story called?",
            options: [
              "Plot",
              "Character",
              "Theme",
              "Setting"
            ],
            correct: 2
          }
        ]
      }
    },
    socialstudies: {
      1: {
        title: "World History Overview",
        content: [
          {
            type: "intro",
            title: "Journey Through Time",
            content: "World history traces human civilization from ancient times to the present, showing how societies developed, interacted, and shaped our modern world."
          },
          {
            type: "content",
            title: "Major Historical Periods",
            content: "Key periods include Ancient Civilizations (Egypt, Greece, Rome), Medieval times, Renaissance, Age of Exploration, Industrial Revolution, and Modern Era. Each brought significant changes in technology, culture, and society."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "Which period brought significant changes in art, science, and learning in Europe?",
            options: [
              "Medieval times",
              "Renaissance",
              "Ancient Egypt",
              "Industrial Revolution"
            ],
            correct: 1
          }
        ]
      },
      2: {
        title: "Geography Fundamentals",
        content: [
          {
            type: "intro",
            title: "Understanding Our World",
            content: "Geography studies the Earth's physical features, climate, and how humans interact with their environment. It includes both physical and human geography."
          },
          {
            type: "content",
            title: "Maps and Locations",
            content: "Maps use coordinates (latitude and longitude), symbols, and scales to show locations and features. The seven continents are Asia, Africa, North America, South America, Antarctica, Europe, and Australia."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "How many continents are there?",
            options: [
              "5",
              "6",
              "7",
              "8"
            ],
            correct: 2
          }
        ]
      },
      3: {
        title: "Government & Civics",
        content: [
          {
            type: "intro",
            title: "How Government Works",
            content: "Government is the system by which a community or country is governed. Civics teaches us about our rights, responsibilities, and how to participate in democracy."
          },
          {
            type: "content",
            title: "Types of Government",
            content: "Major types include democracy (people vote), monarchy (ruled by king/queen), dictatorship (one person rules), and republic (representatives elected by people). Each has different ways of making decisions."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "In which type of government do people vote for their leaders?",
            options: [
              "Monarchy",
              "Dictatorship",
              "Democracy",
              "Autocracy"
            ],
            correct: 2
          }
        ]
      },
      4: {
        title: "Cultural Studies",
        content: [
          {
            type: "intro",
            title: "Understanding Cultures",
            content: "Culture includes the beliefs, customs, arts, and way of life of particular groups of people. Every society has unique cultural practices and traditions."
          },
          {
            type: "content",
            title: "Cultural Elements",
            content: "Culture includes language, religion, food, music, art, clothing, celebrations, and social behaviors. Cultural diversity enriches our world and teaches us different ways of living."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What are examples of cultural elements?",
            options: [
              "Only language and religion",
              "Language, food, music, and traditions",
              "Only celebrations",
              "Only clothing and art"
            ],
            correct: 1
          }
        ]
      },
      5: {
        title: "Economics Basics",
        content: [
          {
            type: "intro",
            title: "Understanding Economics",
            content: "Economics studies how people, businesses, and countries manage resources and make choices about what to produce, buy, and sell."
          },
          {
            type: "content",
            title: "Supply and Demand",
            content: "Supply is how much of something is available, and demand is how much people want it. When supply is low and demand is high, prices usually go up. When supply is high and demand is low, prices often fall."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "What usually happens to price when demand is high but supply is low?",
            options: [
              "Price stays the same",
              "Price goes down",
              "Price goes up",
              "Price disappears"
            ],
            correct: 2
          }
        ]
      },
      6: {
        title: "Current Events Analysis",
        content: [
          {
            type: "intro",
            title: "Understanding Today's World",
            content: "Current events analysis helps us understand what's happening in the world today and how it connects to history, geography, and social issues."
          },
          {
            type: "content",
            title: "Analyzing News",
            content: "When reading news, consider: Who wrote it? What are the facts versus opinions? Are multiple perspectives shown? How does this connect to broader issues? Always check multiple reliable sources."
          },
          {
            type: "quiz",
            title: "Quick Check",
            question: "Why is it important to check multiple sources when reading news?",
            options: [
              "To waste time",
              "To get different perspectives and verify facts",
              "To find the longest article",
              "To confuse yourself"
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