import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserProgress {
  id: string;
  user_id: string;
  subject_id: string;
  lesson_id: string;
  completed: boolean;
  score: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    if (!user) {
      setProgress([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setProgress(data || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (
    subjectId: string,
    lessonId: string,
    completed: boolean,
    score: number = 0
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          subject_id: subjectId,
          lesson_id: lessonId,
          completed,
          score,
          completed_at: completed ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,subject_id,lesson_id'
        });

      if (error) throw error;
      
      // Refresh progress after update
      await fetchProgress();
      return data;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  };

  const getSubjectProgress = (subjectId: string) => {
    return progress.filter(p => p.subject_id === subjectId);
  };

  const isLessonCompleted = (subjectId: string, lessonId: string) => {
    return progress.some(p => 
      p.subject_id === subjectId && 
      p.lesson_id === lessonId && 
      p.completed
    );
  };

  const isLessonUnlocked = (subjectId: string, lessonId: string) => {
    // First lesson is always unlocked
    if (lessonId === '1') return true;
    
    // Check if previous lesson is completed
    const previousLessonId = (parseInt(lessonId) - 1).toString();
    return isLessonCompleted(subjectId, previousLessonId);
  };

  const getCompletedLessonsCount = (subjectId: string) => {
    return progress.filter(p => 
      p.subject_id === subjectId && p.completed
    ).length;
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  return {
    progress,
    loading,
    updateProgress,
    getSubjectProgress,
    isLessonCompleted,
    isLessonUnlocked,
    getCompletedLessonsCount,
    refetch: fetchProgress
  };
};