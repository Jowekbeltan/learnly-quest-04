import React, { useState, useEffect } from 'react';
import { Upload, Edit, Trash2, Eye, Plus, Star, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TeacherContent {
  id: string;
  title: string;
  description: string;
  subject_id: string;
  difficulty: string;
  estimated_duration: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  content: any;
}

interface ContentReview {
  id: string;
  rating: number;
  feedback: string;
  reviewer_id: string;
  created_at: string;
  profiles: {
    display_name: string;
  };
}

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [content, setContent] = useState<TeacherContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<TeacherContent | null>(null);
  const [reviews, setReviews] = useState<ContentReview[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject_id: '',
    difficulty: 'beginner',
    estimated_duration: 15,
    content: {
      intro: { title: '', content: '' },
      main: { title: '', content: '' },
      quiz: {
        title: 'Quick Check',
        question: '',
        options: ['', '', '', ''],
        correct: 0
      }
    }
  });

  useEffect(() => {
    if (user) {
      fetchContent();
    }
  }, [user]);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_content')
        .select('*')
        .eq('teacher_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent((data as TeacherContent[]) || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (contentId: string) => {
    try {
      // Simplified reviews without profile join for now
      const { data, error } = await supabase
        .from('content_reviews')
        .select('id, rating, feedback, reviewer_id, created_at')
        .eq('content_id', contentId);

      if (error) throw error;
      
      // Map data to match interface
      const reviewsData = data?.map(review => ({
        ...review,
        profiles: { display_name: 'Anonymous User' } // Placeholder for now
      })) || [];
      
      setReviews(reviewsData as ContentReview[]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const contentData = {
        teacher_id: user.id,
        title: formData.title,
        description: formData.description,
        subject_id: formData.subject_id,
        difficulty: formData.difficulty,
        estimated_duration: formData.estimated_duration,
        content: [
          {
            type: 'intro',
            title: formData.content.intro.title,
            content: formData.content.intro.content
          },
          {
            type: 'content',
            title: formData.content.main.title,
            content: formData.content.main.content
          },
          {
            type: 'quiz',
            title: formData.content.quiz.title,
            question: formData.content.quiz.question,
            options: formData.content.quiz.options,
            correct: formData.content.quiz.correct
          }
        ]
      };

      let result;
      if (selectedContent) {
        result = await supabase
          .from('teacher_content')
          .update(contentData)
          .eq('id', selectedContent.id);
      } else {
        result = await supabase
          .from('teacher_content')
          .insert([contentData]);
      }

      if (result.error) throw result.error;

      toast.success(selectedContent ? 'Content updated successfully!' : 'Content created successfully!');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchContent();

    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('teacher_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Content deleted successfully!');
      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  const submitForReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('teacher_content')
        .update({ status: 'pending' })
        .eq('id', id);

      if (error) throw error;

      toast.success('Content submitted for review!');
      fetchContent();
    } catch (error) {
      console.error('Error submitting for review:', error);
      toast.error('Failed to submit for review');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject_id: '',
      difficulty: 'beginner',
      estimated_duration: 15,
      content: {
        intro: { title: '', content: '' },
        main: { title: '', content: '' },
        quiz: {
          title: 'Quick Check',
          question: '',
          options: ['', '', '', ''],
          correct: 0
        }
      }
    });
    setSelectedContent(null);
  };

  const openEditDialog = (item: TeacherContent) => {
    setSelectedContent(item);
    const contentArray = item.content as any[];
    
    setFormData({
      title: item.title,
      description: item.description || '',
      subject_id: item.subject_id,
      difficulty: item.difficulty,
      estimated_duration: item.estimated_duration,
      content: {
        intro: {
          title: contentArray[0]?.title || '',
          content: contentArray[0]?.content || ''
        },
        main: {
          title: contentArray[1]?.title || '',
          content: contentArray[1]?.content || ''
        },
        quiz: {
          title: contentArray[2]?.title || 'Quick Check',
          question: contentArray[2]?.question || '',
          options: contentArray[2]?.options || ['', '', '', ''],
          correct: contentArray[2]?.correct || 0
        }
      }
    });
    setIsCreateDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading teacher dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedContent ? 'Edit Content' : 'Create New Learning Content'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Select
                    value={formData.subject_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, subject_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="languages">Languages</SelectItem>
                      <SelectItem value="socialstudies">Social Studies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={formData.estimated_duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimated_duration: parseInt(e.target.value) }))}
                    min={5}
                    max={120}
                  />
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Lesson Content</h3>
                
                {/* Introduction */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Introduction Title</label>
                  <Input
                    value={formData.content.intro.title}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      content: {
                        ...prev.content,
                        intro: { ...prev.content.intro, title: e.target.value }
                      }
                    }))}
                  />
                  <label className="text-sm font-medium">Introduction Content</label>
                  <Textarea
                    value={formData.content.intro.content}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      content: {
                        ...prev.content,
                        intro: { ...prev.content.intro, content: e.target.value }
                      }
                    }))}
                    rows={3}
                  />
                </div>

                {/* Main Content */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Main Content Title</label>
                  <Input
                    value={formData.content.main.title}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      content: {
                        ...prev.content,
                        main: { ...prev.content.main, title: e.target.value }
                      }
                    }))}
                  />
                  <label className="text-sm font-medium">Main Content</label>
                  <Textarea
                    value={formData.content.main.content}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      content: {
                        ...prev.content,
                        main: { ...prev.content.main, content: e.target.value }
                      }
                    }))}
                    rows={4}
                  />
                </div>

                {/* Quiz */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quiz Question</label>
                  <Input
                    value={formData.content.quiz.question}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      content: {
                        ...prev.content,
                        quiz: { ...prev.content.quiz, question: e.target.value }
                      }
                    }))}
                  />
                  
                  <label className="text-sm font-medium">Answer Options</label>
                  {formData.content.quiz.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...formData.content.quiz.options];
                          newOptions[index] = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            content: {
                              ...prev.content,
                              quiz: { ...prev.content.quiz, options: newOptions }
                            }
                          }));
                        }}
                      />
                      <input
                        type="radio"
                        name="correct"
                        checked={formData.content.quiz.correct === index}
                        onChange={() => setFormData(prev => ({
                          ...prev,
                          content: {
                            ...prev.content,
                            quiz: { ...prev.content.quiz, correct: index }
                          }
                        }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {selectedContent ? 'Update Content' : 'Create Content'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content List */}
      <div className="grid gap-4">
        {content.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Content Created Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first learning content to get started.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </CardContent>
          </Card>
        ) : (
          content.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-2">{item.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Subject: {item.subject_id}</span>
                      <span>Difficulty: {item.difficulty}</span>
                      <span>Duration: {item.estimated_duration} min</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedContent(item);
                        fetchReviews(item.id);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {item.status === 'draft' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => submitForReview(item.id)}
                      >
                        Submit for Review
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Reviews Dialog */}
      {selectedContent && (
        <Dialog 
          open={!!selectedContent} 
          onOpenChange={() => setSelectedContent(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Content Reviews - {selectedContent.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No reviews yet for this content.
                </p>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {review.profiles?.display_name || 'Anonymous'}
                          </span>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{review.feedback}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TeacherDashboard;