
import { useState, useEffect } from 'react';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Edit3, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProjectNotesProps {
  projectId: string;
}

const ProjectNotes = ({ projectId }: ProjectNotesProps) => {
  const [notes, setNotes] = useState<Tables<'project_notes'>[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('project_notes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading notes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [projectId]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;

    try {
      const { error } = await supabase
        .from('project_notes')
        .insert({
          project_id: projectId,
          title: newTitle.trim(),
          content: newContent.trim() || null,
        });

      if (error) throw error;

      setNewTitle('');
      setNewContent('');
      setIsCreating(false);
      loadNotes();
      toast({
        title: "Note created",
        description: "Your note has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating note",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('project_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      
      loadNotes();
      toast({
        title: "Note deleted",
        description: "The note has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting note",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Project Notes</h2>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>

      {isCreating && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <Input
              placeholder="Note title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Write your note content here..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white resize-none"
              rows={6}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                Save Note
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false);
                  setNewTitle('');
                  setNewContent('');
                }}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {notes.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-600 mb-4" />
              <p className="text-gray-400 text-center">
                No notes yet. Create your first note to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          notes.map((note) => (
            <Card key={note.id} className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-white">{note.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(note.id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              {note.content && (
                <CardContent>
                  <p className="text-gray-300 whitespace-pre-wrap">{note.content}</p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectNotes;
