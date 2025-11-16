import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock } from "lucide-react";

const Videos = () => {
  const videos = [
    {
      id: 1,
      title: "Introduction to Mathematics",
      duration: "12:45",
      subject: "Mathematics",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop",
      description: "Learn the fundamentals of mathematics",
    },
    {
      id: 2,
      title: "Basic Physics Principles",
      duration: "18:30",
      subject: "Physics",
      thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=225&fit=crop",
      description: "Understanding the basics of physics",
    },
    {
      id: 3,
      title: "Chemistry 101",
      duration: "15:20",
      subject: "Chemistry",
      thumbnail: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=225&fit=crop",
      description: "Introduction to chemistry concepts",
    },
    {
      id: 4,
      title: "Biology Basics",
      duration: "20:15",
      subject: "Biology",
      thumbnail: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=225&fit=crop",
      description: "Explore the world of biology",
    },
    {
      id: 5,
      title: "Computer Science Fundamentals",
      duration: "25:00",
      subject: "Computer Science",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=225&fit=crop",
      description: "Introduction to programming and CS",
    },
    {
      id: 6,
      title: "History of Ancient Civilizations",
      duration: "22:40",
      subject: "History",
      thumbnail: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=225&fit=crop",
      description: "Discover ancient world civilizations",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Educational Videos</h1>
          <p className="text-muted-foreground">Explore our collection of educational video content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 rounded-full p-4">
                    <Play className="h-8 w-8 text-primary" fill="currentColor" />
                  </div>
                </div>
                <Badge className="absolute top-2 right-2" variant="secondary">
                  {video.subject}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{video.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {video.duration}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{video.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Videos;
