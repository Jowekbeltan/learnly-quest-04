import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ContentUploadDialogProps {
  onUploadSuccess: () => void;
}

export const ContentUploadDialog: React.FC<ContentUploadDialogProps> = ({ onUploadSuccess }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject_id: '',
    difficulty: 'beginner',
    content_type: 'notes',
    text_content: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const maxSize = 100 * 1024 * 1024; // 100MB
      
      if (selectedFile.size > maxSize) {
        toast.error('File size must be less than 100MB');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUploading(true);

    try {
      let fileUrl = null;
      
      // Upload file if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('educational-content')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('educational-content')
          .getPublicUrl(fileName);
        
        fileUrl = publicUrl;
      }

      // Create content entry
      const contentData = {
        teacher_id: user.id,
        title: formData.title,
        description: formData.description,
        subject_id: formData.subject_id,
        difficulty: formData.difficulty,
        status: 'pending',
        content: {
          type: formData.content_type,
          text: formData.text_content,
          file_url: fileUrl,
        },
      };

      const { error } = await supabase
        .from('teacher_content')
        .insert([contentData]);

      if (error) throw error;

      toast.success('Content uploaded successfully! Pending review.');
      setIsOpen(false);
      setFormData({
        title: '',
        description: '',
        subject_id: '',
        difficulty: 'beginner',
        content_type: 'notes',
        text_content: '',
      });
      setFile(null);
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading content:', error);
      toast.error('Failed to upload content');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Content
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Educational Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={formData.subject_id}
                onValueChange={(value) => setFormData({ ...formData, subject_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
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
          </div>

          <div>
            <Label htmlFor="content_type">Content Type</Label>
            <Select
              value={formData.content_type}
              onValueChange={(value) => setFormData({ ...formData, content_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="notes">Notes</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="text_content">Text Content / Notes</Label>
            <Textarea
              id="text_content"
              value={formData.text_content}
              onChange={(e) => setFormData({ ...formData, text_content: e.target.value })}
              rows={6}
              placeholder="Enter your notes or lesson content here..."
            />
          </div>

          <div>
            <Label htmlFor="file">
              {formData.content_type === 'video' ? (
                <>
                  <Video className="inline mr-2 h-4 w-4" />
                  Upload Video (Optional)
                </>
              ) : (
                <>
                  <FileText className="inline mr-2 h-4 w-4" />
                  Upload Document (Optional)
                </>
              )}
            </Label>
            <Input
              id="file"
              type="file"
              accept={formData.content_type === 'video' ? 'video/*' : '.pdf,.doc,.docx,.txt'}
              onChange={handleFileChange}
              className="mt-2"
            />
            {file && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {file.name}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Content'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
