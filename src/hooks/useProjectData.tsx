
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

interface ProjectData {
  tasks: Tables<'project_tasks'>[];
  cards: Tables<'cards'>[];
  notes: Tables<'project_notes'>[];
  links: Tables<'project_links'>[];
  columns: Tables<'board_columns'>[];
}

export const useProjectData = (projectId: string) => {
  const [data, setData] = useState<ProjectData>({
    tasks: [],
    cards: [],
    notes: [],
    links: [],
    columns: []
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [tasksRes, cardsRes, notesRes, linksRes, columnsRes] = await Promise.all([
        supabase.from('project_tasks').select('*').eq('project_id', projectId),
        supabase.from('cards').select('*, board_columns!inner(project_id)').eq('board_columns.project_id', projectId),
        supabase.from('project_notes').select('*').eq('project_id', projectId),
        supabase.from('project_links').select('*').eq('project_id', projectId),
        supabase.from('board_columns').select('*').eq('project_id', projectId)
      ]);

      setData({
        tasks: tasksRes.data || [],
        cards: cardsRes.data || [],
        notes: notesRes.data || [],
        links: linksRes.data || [],
        columns: columnsRes.data || []
      });
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscriptions
    const tasksChannel = supabase
      .channel('project-tasks-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'project_tasks',
        filter: `project_id=eq.${projectId}`
      }, () => fetchData())
      .subscribe();

    const cardsChannel = supabase
      .channel('cards-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'cards'
      }, () => fetchData())
      .subscribe();

    const notesChannel = supabase
      .channel('notes-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'project_notes',
        filter: `project_id=eq.${projectId}`
      }, () => fetchData())
      .subscribe();

    const linksChannel = supabase
      .channel('links-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'project_links',
        filter: `project_id=eq.${projectId}`
      }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(cardsChannel);
      supabase.removeChannel(notesChannel);
      supabase.removeChannel(linksChannel);
    };
  }, [projectId]);

  return { data, loading, refetch: fetchData };
};
