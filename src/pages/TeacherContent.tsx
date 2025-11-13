import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Search, Play, FileText, ExternalLink } from 'lucide-react';
import { ContentReviewDialog } from '@/components/ContentReviewDialog';
import { toast } from 'sonner';

interface TeacherContent {
  id: string;
  title: string;
  description: string;
  subject_id: string;
  difficulty: string;
  status: string;
  content: any;
  teacher_id: string;
  created_at: string;
}

interface ContentWithTeacher extends TeacherContent {
  profiles?: {
    display_name: string;
  };
  average_rating?: number;
  review_count?: number;
}

const TeacherContent: React.FC = () => {
  const { user } = useAuth();
  const [contents, setContents] = useState<ContentWithTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApprovedContent();
  }, []);

  const fetchApprovedContent = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_content')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch ratings and teacher info for each content
      const contentsWithRatings = await Promise.all(
        (data || []).map(async (content) => {
          // Fetch teacher profile
          const { data: teacherProfile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', content.teacher_id)
            .single();

          // Fetch reviews
          const { data: reviews } = await supabase
            .from('content_reviews')
            .select('rating')
            .eq('content_id', content.id);

          const ratings = reviews?.map((r) => r.rating) || [];
          const average_rating = ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;

          return {
            ...content,
            profiles: teacherProfile,
            average_rating,
            review_count: ratings.length,
          };
        })
      );

      setContents(contentsWithRatings);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const filteredContents = contents.filter(
    (content) =>
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openContent = (content: ContentWithTeacher) => {
    if (content.content?.file_url) {
      window.open(content.content.file_url, '_blank');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to view teacher content</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Teacher Content</h1>
          <p className="text-muted-foreground">
            Explore educational content created by teachers
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p>Loading content...</p>
          </div>
        ) : filteredContents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'No content matches your search'
                  : 'No approved content available yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContents.map((content) => (
              <Card key={content.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{content.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        by {content.profiles?.display_name || 'Anonymous'}
                      </p>
                    </div>
                    {content.content?.type === 'video' ? (
                      <Play className="h-5 w-5 text-primary" />
                    ) : (
                      <FileText className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{content.subject_id}</Badge>
                    <Badge variant="outline">{content.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {content.description}
                  </p>

                  {/* Rating Display */}
                  {content.review_count! > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Math.round(content.average_rating!)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({content.review_count} reviews)
                      </span>
                    </div>
                  )}

                  {/* Content Preview */}
                  {content.content?.text && (
                    <div className="mb-4 p-3 bg-muted rounded-md">
                      <p className="text-sm line-clamp-3">{content.content.text}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {content.content?.file_url && (
                      <Button
                        onClick={() => openContent(content)}
                        variant="default"
                        size="sm"
                        className="flex-1"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Content
                      </Button>
                    )}
                    <ContentReviewDialog
                      contentId={content.id}
                      contentTitle={content.title}
                      onReviewSubmitted={fetchApprovedContent}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherContent;
