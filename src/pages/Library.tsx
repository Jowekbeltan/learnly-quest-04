import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Search, BookOpen, Star } from "lucide-react";

interface BookItem {
  id: string;
  title: string;
  author: string;
  subject: string;
  grade: string;
  rating: number;
  pages: number;
  description: string;
  coverColor: string;
}

const Library = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const books: BookItem[] = [
    // Science Books
    { id: "sci1", title: "The Wonders of Space", author: "Dr. Sarah Chen", subject: "science", grade: "4-6", rating: 4.8, pages: 156, description: "Explore the mysteries of our universe, from planets to black holes.", coverColor: "hsl(213 94% 68%)" },
    { id: "sci2", title: "Chemistry for Young Minds", author: "Prof. Michael Brown", subject: "science", grade: "5-6", rating: 4.6, pages: 198, description: "Learn about elements, compounds, and chemical reactions through fun experiments.", coverColor: "hsl(213 94% 68%)" },
    { id: "sci3", title: "The Amazing Human Body", author: "Dr. Emily Watson", subject: "science", grade: "3-5", rating: 4.9, pages: 142, description: "Discover how your body works, from cells to organs.", coverColor: "hsl(213 94% 68%)" },
    { id: "sci4", title: "Earth's Ecosystems", author: "Prof. James Lee", subject: "science", grade: "4-6", rating: 4.7, pages: 178, description: "Understanding biodiversity and environmental balance.", coverColor: "hsl(213 94% 68%)" },
    { id: "sci5", title: "Physics Made Simple", author: "Dr. Maria Garcia", subject: "science", grade: "5-6", rating: 4.5, pages: 165, description: "Learn about motion, energy, and forces in everyday life.", coverColor: "hsl(213 94% 68%)" },
    { id: "sci6", title: "Ocean Mysteries", author: "Dr. Robert Kim", subject: "science", grade: "3-5", rating: 4.8, pages: 134, description: "Dive deep into marine biology and ocean ecosystems.", coverColor: "hsl(213 94% 68%)" },
    { id: "sci7", title: "Weather and Climate", author: "Prof. Linda Park", subject: "science", grade: "4-6", rating: 4.6, pages: 145, description: "Understanding weather patterns and climate change.", coverColor: "hsl(213 94% 68%)" },
    { id: "sci8", title: "The World of Insects", author: "Dr. Thomas White", subject: "science", grade: "2-4", rating: 4.7, pages: 128, description: "Explore the fascinating world of bugs and beetles.", coverColor: "hsl(213 94% 68%)" },
    { id: "sci9", title: "Plants and Photosynthesis", author: "Dr. Anna Green", subject: "science", grade: "3-5", rating: 4.5, pages: 152, description: "How plants grow and produce oxygen.", coverColor: "hsl(213 94% 68%)" },
    { id: "sci10", title: "Electricity and Magnetism", author: "Prof. David Martinez", subject: "science", grade: "5-6", rating: 4.8, pages: 187, description: "Understanding the forces that power our world.", coverColor: "hsl(213 94% 68%)" },

    // Mathematics Books
    { id: "math1", title: "Numbers Come Alive", author: "Prof. Patricia Johnson", subject: "mathematics", grade: "1-3", rating: 4.9, pages: 124, description: "Make math fun with colorful illustrations and games.", coverColor: "hsl(25 95% 53%)" },
    { id: "math2", title: "Geometry in Nature", author: "Dr. Richard Taylor", subject: "mathematics", grade: "4-6", rating: 4.7, pages: 168, description: "Discover shapes and patterns all around us.", coverColor: "hsl(25 95% 53%)" },
    { id: "math3", title: "Algebra Adventures", author: "Prof. Susan Williams", subject: "mathematics", grade: "5-6", rating: 4.6, pages: 195, description: "Your journey into the world of variables and equations.", coverColor: "hsl(25 95% 53%)" },
    { id: "math4", title: "Fun with Fractions", author: "Dr. Mark Anderson", subject: "mathematics", grade: "3-5", rating: 4.8, pages: 142, description: "Master fractions through practical examples.", coverColor: "hsl(25 95% 53%)" },
    { id: "math5", title: "Statistics for Kids", author: "Prof. Jennifer Davis", subject: "mathematics", grade: "5-6", rating: 4.5, pages: 156, description: "Learn to collect, analyze, and present data.", coverColor: "hsl(25 95% 53%)" },
    { id: "math6", title: "The Magic of Multiplication", author: "Dr. Kevin Brown", subject: "mathematics", grade: "2-4", rating: 4.9, pages: 118, description: "Tricks and tips to master multiplication tables.", coverColor: "hsl(25 95% 53%)" },
    { id: "math7", title: "Problem Solving Strategies", author: "Prof. Laura Martinez", subject: "mathematics", grade: "4-6", rating: 4.7, pages: 174, description: "Develop critical thinking through math challenges.", coverColor: "hsl(25 95% 53%)" },
    { id: "math8", title: "Measurement Made Easy", author: "Dr. Chris Wilson", subject: "mathematics", grade: "2-4", rating: 4.6, pages: 132, description: "Understanding units, conversions, and estimation.", coverColor: "hsl(25 95% 53%)" },
    { id: "math9", title: "Probability and Chance", author: "Prof. Nancy Lee", subject: "mathematics", grade: "5-6", rating: 4.7, pages: 163, description: "Learn about odds, probability, and predictions.", coverColor: "hsl(25 95% 53%)" },
    { id: "math10", title: "Mathematical Patterns", author: "Dr. Paul Garcia", subject: "mathematics", grade: "3-5", rating: 4.8, pages: 148, description: "Discover sequences, series, and number patterns.", coverColor: "hsl(25 95% 53%)" },

    // Technology Books
    { id: "tech1", title: "Coding for Beginners", author: "Alex Turner", subject: "technology", grade: "4-6", rating: 4.8, pages: 186, description: "Start your programming journey with Python basics.", coverColor: "hsl(158 64% 52%)" },
    { id: "tech2", title: "How Computers Work", author: "Sarah Mitchell", subject: "technology", grade: "3-5", rating: 4.7, pages: 154, description: "Understanding hardware, software, and digital systems.", coverColor: "hsl(158 64% 52%)" },
    { id: "tech3", title: "Internet Safety Guide", author: "Dr. John Smith", subject: "technology", grade: "2-6", rating: 4.9, pages: 98, description: "Stay safe online with essential digital citizenship skills.", coverColor: "hsl(158 64% 52%)" },
    { id: "tech4", title: "Robotics and AI", author: "Prof. Lisa Wong", subject: "technology", grade: "5-6", rating: 4.6, pages: 192, description: "Introduction to artificial intelligence and robotics.", coverColor: "hsl(158 64% 52%)" },
    { id: "tech5", title: "Web Design Basics", author: "Mike Johnson", subject: "technology", grade: "5-6", rating: 4.7, pages: 178, description: "Create your first website with HTML and CSS.", coverColor: "hsl(158 64% 52%)" },
    { id: "tech6", title: "Digital Art Creation", author: "Emma Davis", subject: "technology", grade: "4-6", rating: 4.8, pages: 164, description: "Learn digital drawing and graphic design.", coverColor: "hsl(158 64% 52%)" },
    { id: "tech7", title: "Game Development 101", author: "Chris Taylor", subject: "technology", grade: "5-6", rating: 4.9, pages: 204, description: "Build your own video games step by step.", coverColor: "hsl(158 64% 52%)" },
    { id: "tech8", title: "3D Printing Guide", author: "Dr. Amy Chen", subject: "technology", grade: "5-6", rating: 4.5, pages: 142, description: "Design and print your own 3D objects.", coverColor: "hsl(158 64% 52%)" },
    { id: "tech9", title: "Apps and Mobile Tech", author: "Ryan Lee", subject: "technology", grade: "5-6", rating: 4.6, pages: 158, description: "Understanding mobile applications and development.", coverColor: "hsl(158 64% 52%)" },
    { id: "tech10", title: "Cyber Security Basics", author: "Prof. Helen Park", subject: "technology", grade: "5-6", rating: 4.8, pages: 176, description: "Protect yourself in the digital world.", coverColor: "hsl(158 64% 52%)" },

    // Languages Books
    { id: "lang1", title: "English Grammar Made Easy", author: "Prof. Margaret Wilson", subject: "languages", grade: "3-6", rating: 4.7, pages: 168, description: "Master grammar rules with clear examples.", coverColor: "hsl(262 83% 68%)" },
    { id: "lang2", title: "Creative Writing Workshop", author: "James Patterson Jr.", subject: "languages", grade: "4-6", rating: 4.9, pages: 192, description: "Develop your storytelling and writing skills.", coverColor: "hsl(262 83% 68%)" },
    { id: "lang3", title: "Spanish for Kids", author: "María Rodriguez", subject: "languages", grade: "2-5", rating: 4.8, pages: 145, description: "Learn Spanish through fun activities and songs.", coverColor: "hsl(262 83% 68%)" },
    { id: "lang4", title: "Poetry and Rhyme", author: "Dr. Elizabeth Moore", subject: "languages", grade: "3-5", rating: 4.6, pages: 128, description: "Explore the beauty of poetry and verse.", coverColor: "hsl(262 83% 68%)" },
    { id: "lang5", title: "Vocabulary Builder", author: "Prof. William Clark", subject: "languages", grade: "4-6", rating: 4.7, pages: 156, description: "Expand your word power with engaging exercises.", coverColor: "hsl(262 83% 68%)" },
    { id: "lang6", title: "Public Speaking Skills", author: "Dr. Rachel Green", subject: "languages", grade: "5-6", rating: 4.8, pages: 142, description: "Become a confident and effective speaker.", coverColor: "hsl(262 83% 68%)" },
    { id: "lang7", title: "French Adventures", author: "Pierre Dubois", subject: "languages", grade: "3-6", rating: 4.7, pages: 164, description: "Learn French through interactive stories.", coverColor: "hsl(262 83% 68%)" },
    { id: "lang8", title: "Reading Comprehension", author: "Prof. Sarah Adams", subject: "languages", grade: "3-5", rating: 4.6, pages: 138, description: "Improve your reading skills and understanding.", coverColor: "hsl(262 83% 68%)" },
    { id: "lang9", title: "Mandarin Chinese Basics", author: "Dr. Wei Zhang", subject: "languages", grade: "4-6", rating: 4.9, pages: 178, description: "Introduction to Chinese language and culture.", coverColor: "hsl(262 83% 68%)" },
    { id: "lang10", title: "Writing Essays", author: "Prof. Daniel Brown", subject: "languages", grade: "5-6", rating: 4.7, pages: 186, description: "Structure and write compelling essays.", coverColor: "hsl(262 83% 68%)" },

    // Social Studies Books
    { id: "social1", title: "World Geography Atlas", author: "Dr. Robert Turner", subject: "socialstudies", grade: "4-6", rating: 4.8, pages: 216, description: "Explore countries, cultures, and continents.", coverColor: "hsl(45 86% 58%)" },
    { id: "social2", title: "American History", author: "Prof. Linda Harris", subject: "socialstudies", grade: "5-6", rating: 4.7, pages: 245, description: "From colonial times to modern America.", coverColor: "hsl(45 86% 58%)" },
    { id: "social3", title: "Ancient Civilizations", author: "Dr. Marcus Stone", subject: "socialstudies", grade: "4-6", rating: 4.9, pages: 198, description: "Egypt, Greece, Rome, and ancient empires.", coverColor: "hsl(45 86% 58%)" },
    { id: "social4", title: "Government and Civics", author: "Prof. Janet Miller", subject: "socialstudies", grade: "5-6", rating: 4.6, pages: 172, description: "How governments work and your role as a citizen.", coverColor: "hsl(45 86% 58%)" },
    { id: "social5", title: "World Cultures", author: "Dr. Amira Hassan", subject: "socialstudies", grade: "3-5", rating: 4.8, pages: 164, description: "Celebrating diversity around the globe.", coverColor: "hsl(45 86% 58%)" },
    { id: "social6", title: "Economics for Kids", author: "Prof. Steven Wright", subject: "socialstudies", grade: "5-6", rating: 4.7, pages: 156, description: "Understanding money, trade, and markets.", coverColor: "hsl(45 86% 58%)" },
    { id: "social7", title: "Map Reading Skills", author: "Dr. Carol Anderson", subject: "socialstudies", grade: "3-5", rating: 4.6, pages: 128, description: "Navigate using maps, compass, and coordinates.", coverColor: "hsl(45 86% 58%)" },
    { id: "social8", title: "Famous Leaders", author: "Prof. George King", subject: "socialstudies", grade: "4-6", rating: 4.8, pages: 188, description: "Inspiring stories of historical figures.", coverColor: "hsl(45 86% 58%)" },
    { id: "social9", title: "Community Helpers", author: "Dr. Mary Johnson", subject: "socialstudies", grade: "1-3", rating: 4.9, pages: 96, description: "People who make our communities work.", coverColor: "hsl(45 86% 58%)" },
    { id: "social10", title: "World Religions", author: "Prof. David Cohen", subject: "socialstudies", grade: "5-6", rating: 4.7, pages: 192, description: "Understanding different faiths and beliefs.", coverColor: "hsl(45 86% 58%)" },

    // Literature Books
    { id: "lit1", title: "The Adventures of Tom Sawyer", author: "Mark Twain", subject: "literature", grade: "5-6", rating: 4.9, pages: 274, description: "Classic tale of childhood adventures on the Mississippi.", coverColor: "hsl(340 75% 60%)" },
    { id: "lit2", title: "Charlotte's Web", author: "E.B. White", subject: "literature", grade: "3-5", rating: 5.0, pages: 192, description: "A heartwarming story of friendship between a pig and spider.", coverColor: "hsl(340 75% 60%)" },
    { id: "lit3", title: "The Chronicles of Narnia", author: "C.S. Lewis", subject: "literature", grade: "4-6", rating: 4.9, pages: 206, description: "Magical adventures in a fantasy world.", coverColor: "hsl(340 75% 60%)" },
    { id: "lit4", title: "Anne of Green Gables", author: "L.M. Montgomery", subject: "literature", grade: "5-6", rating: 4.8, pages: 336, description: "The beloved story of an imaginative orphan girl.", coverColor: "hsl(340 75% 60%)" },
    { id: "lit5", title: "The Secret Garden", author: "Frances Hodgson Burnett", subject: "literature", grade: "4-5", rating: 4.8, pages: 256, description: "A mysterious garden brings healing and hope.", coverColor: "hsl(340 75% 60%)" },
    { id: "lit6", title: "Wonder", author: "R.J. Palacio", subject: "literature", grade: "5-6", rating: 4.9, pages: 310, description: "A powerful story about kindness and acceptance.", coverColor: "hsl(340 75% 60%)" },
    { id: "lit7", title: "Harry Potter Series", author: "J.K. Rowling", subject: "literature", grade: "5-6", rating: 5.0, pages: 309, description: "The magical world of wizards and adventure.", coverColor: "hsl(340 75% 60%)" },
    { id: "lit8", title: "The Giver", author: "Lois Lowry", subject: "literature", grade: "6", rating: 4.7, pages: 225, description: "A thought-provoking dystopian novel.", coverColor: "hsl(340 75% 60%)" },
    { id: "lit9", title: "Matilda", author: "Roald Dahl", subject: "literature", grade: "4-5", rating: 4.9, pages: 240, description: "A brilliant girl with extraordinary powers.", coverColor: "hsl(340 75% 60%)" },
    { id: "lit10", title: "Bridge to Terabithia", author: "Katherine Paterson", subject: "literature", grade: "5-6", rating: 4.8, pages: 163, description: "A touching story of friendship and imagination.", coverColor: "hsl(340 75% 60%)" },
  ];

  const subjects = [
    { id: "all", name: "All Books", count: books.length },
    { id: "science", name: "Science", count: books.filter(b => b.subject === "science").length },
    { id: "mathematics", name: "Mathematics", count: books.filter(b => b.subject === "mathematics").length },
    { id: "technology", name: "Technology", count: books.filter(b => b.subject === "technology").length },
    { id: "languages", name: "Languages", count: books.filter(b => b.subject === "languages").length },
    { id: "socialstudies", name: "Social Studies", count: books.filter(b => b.subject === "socialstudies").length },
    { id: "literature", name: "Literature", count: books.filter(b => b.subject === "literature").length },
  ];

  const filteredBooks = books.filter(book => {
    const matchesSubject = selectedSubject === "all" || book.subject === selectedSubject;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container">
          {/* Header Section */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-hero-gradient rounded-lg flex items-center justify-center">
                <Book className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Learning Library</h1>
                <p className="text-muted-foreground">Explore our collection of educational books</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Subject Tabs */}
          <Tabs defaultValue="all" value={selectedSubject} onValueChange={setSelectedSubject} className="space-y-6">
            <TabsList className="flex flex-wrap h-auto gap-2 bg-muted/50 p-2">
              {subjects.map((subject) => (
                <TabsTrigger 
                  key={subject.id} 
                  value={subject.id}
                  className="flex items-center gap-2"
                >
                  {subject.name}
                  <Badge variant="secondary" className="ml-1">{subject.count}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Books Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <Card key={book.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div 
                    className="h-40 flex items-center justify-center relative"
                    style={{ backgroundColor: book.coverColor }}
                  >
                    <BookOpen className="h-16 w-16 text-white/80" />
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 right-3 bg-white/90"
                    >
                      Grade {book.grade}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                    <CardDescription className="flex items-center justify-between">
                      <span className="line-clamp-1">{book.author}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span className="text-xs font-medium">{book.rating}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{book.pages} pages</span>
                      <Badge variant="outline" className="capitalize">{book.subject}</Badge>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => navigate(`/book/${book.id}`)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Book
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div className="text-center py-12">
                <Book className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No books found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Library;
