import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Eye } from 'lucide-react';
import { useState } from 'react';

interface Video {
  id: string;
  title: string;
  subject: string;
  duration: string;
  views: string;
  thumbnail: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  videoUrl: string;
}

const EducationalVideos = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const videos: Video[] = [
    {
      id: '1',
      title: 'Introduction to Algebra',
      subject: 'Mathematics',
      duration: '12:45',
      views: '2.5K',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop',
      difficulty: 'Beginner',
      description: 'Learn the basics of algebraic expressions and equations',
      videoUrl: 'https://www.youtube.com/embed/NybHckSEQBI'
    },
    {
      id: '2',
      title: 'Photosynthesis Explained',
      subject: 'Science',
      duration: '8:30',
      views: '3.1K',
      thumbnail: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=225&fit=crop',
      difficulty: 'Intermediate',
      description: 'Understanding how plants convert light into energy',
      videoUrl: 'https://www.youtube.com/embed/uixA8ZXx0KU'
    },
    {
      id: '3',
      title: 'Intro to Python Programming',
      subject: 'Technology',
      duration: '15:20',
      views: '4.2K',
      thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=225&fit=crop',
      difficulty: 'Beginner',
      description: 'Start your coding journey with Python basics',
      videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8'
    },
    {
      id: '4',
      title: 'World History: Renaissance',
      subject: 'Social Studies',
      duration: '18:15',
      views: '1.8K',
      thumbnail: 'https://images.unsplash.com/photo-1598106594832-2f0ce7c00a30?w=400&h=225&fit=crop',
      difficulty: 'Intermediate',
      description: 'Explore the cultural rebirth of Europe',
      videoUrl: 'https://www.youtube.com/embed/Vufba_ZcoR0'
    },
    {
      id: '5',
      title: 'Grammar Fundamentals',
      subject: 'Languages',
      duration: '10:50',
      views: '2.9K',
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop',
      difficulty: 'Beginner',
      description: 'Master the building blocks of language',
      videoUrl: 'https://www.youtube.com/embed/F7OvPTmhpJA'
    },
    {
      id: '6',
      title: 'Physics: Newton\'s Laws',
      subject: 'Science',
      duration: '14:30',
      views: '3.7K',
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=225&fit=crop',
      difficulty: 'Advanced',
      description: 'Understanding motion and forces in physics',
      videoUrl: 'https://www.youtube.com/embed/kKKM8Y-u7ds'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      Advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[difficulty as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      {/* Video Player */}
      {selectedVideo && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedVideo.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <iframe
                width="100%"
                height="100%"
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline">{selectedVideo.subject}</Badge>
                <Badge className={getDifficultyColor(selectedVideo.difficulty)}>
                  {selectedVideo.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {selectedVideo.duration}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {selectedVideo.views} views
                </div>
              </div>
              <p className="text-muted-foreground">{selectedVideo.description}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Educational Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group cursor-pointer space-y-2"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Play className="h-6 w-6 text-primary ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {video.subject}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {video.views} views
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationalVideos;
