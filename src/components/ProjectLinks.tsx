
import { useState, useEffect } from 'react';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Link2, ExternalLink, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProjectLinksProps {
  projectId: string;
}

const ProjectLinks = ({ projectId }: ProjectLinksProps) => {
  const [links, setLinks] = useState<Tables<'project_links'>[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('project_links')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLinks(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading links",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, [projectId]);

  const handleCreate = async () => {
    if (!newTitle.trim() || !newUrl.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both title and URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('project_links')
        .insert({
          project_id: projectId,
          title: newTitle.trim(),
          url: newUrl.trim(),
          description: newDescription.trim() || null,
        });

      if (error) throw error;

      setNewTitle('');
      setNewUrl('');
      setNewDescription('');
      setIsCreating(false);
      loadLinks();
      toast({
        title: "Link added",
        description: "Your link has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating link",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (linkId: string) => {
    try {
      const { error } = await supabase
        .from('project_links')
        .delete()
        .eq('id', linkId);

      if (error) throw error;
      
      loadLinks();
      toast({
        title: "Link deleted",
        description: "The link has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting link",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Loading links...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Project Links</h2>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </div>

      {isCreating && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <Input
              placeholder="Link title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white mb-4"
            />
            <Input
              placeholder="https://example.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Description (optional)..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white resize-none"
              rows={3}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                Save Link
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false);
                  setNewTitle('');
                  setNewUrl('');
                  setNewDescription('');
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
        {links.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Link2 className="h-12 w-12 text-gray-600 mb-4" />
              <p className="text-gray-400 text-center">
                No links yet. Add your first link to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          links.map((link) => (
            <Card key={link.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-white flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-blue-400" />
                  {link.title}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(link.url, '_blank')}
                    className="text-gray-400 hover:text-blue-400"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(link.id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm break-all mb-2 block"
                >
                  {link.url}
                </a>
                {link.description && (
                  <p className="text-gray-300 text-sm">{link.description}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectLinks;
