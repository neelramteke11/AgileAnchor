
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MoreVertical, Edit, Trash2, Archive, Play, Pause } from 'lucide-react';

interface ProjectActionsMenuProps {
  project: Tables<'projects'>;
  onUpdate: () => void;
}

const ProjectActionsMenu = ({ project, onUpdate }: ProjectActionsMenuProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const [editDescription, setEditDescription] = useState(project.description || '');
  const [editStatus, setEditStatus] = useState(project.status);
  const { toast } = useToast();

  const handleEdit = async () => {
    const { error } = await supabase
      .from('projects')
      .update({
        name: editName,
        description: editDescription || null,
        status: editStatus,
      })
      .eq('id', project.id);

    if (error) {
      toast({
        title: "Error updating project",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Project updated",
        description: "Your changes have been saved.",
      });
      setShowEditDialog(false);
      onUpdate();
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id);

    if (error) {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Project deleted",
        description: "The project has been removed.",
      });
      setShowDeleteDialog(false);
      onUpdate();
    }
  };

  const toggleStatus = async () => {
    const newStatus = project.status === 'active' ? 'archived' : 'active';
    
    const { error } = await supabase
      .from('projects')
      .update({ status: newStatus })
      .eq('id', project.id);

    if (error) {
      toast({
        title: "Error updating project status",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Project status updated",
        description: `Project ${newStatus === 'active' ? 'activated' : 'archived'}.`,
      });
      onUpdate();
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-900 border-gray-800">
          <DropdownMenuItem 
            onClick={() => setShowEditDialog(true)}
            className="text-gray-300 hover:bg-gray-800"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={toggleStatus}
            className="text-gray-300 hover:bg-gray-800"
          >
            {project.status === 'active' ? (
              <>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-400 hover:bg-gray-800"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Description</label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Status</label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowEditDialog(false)}
                className="border-gray-700 text-gray-300"
              >
                Cancel
              </Button>
              <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Project</DialogTitle>
          </DialogHeader>
          <p className="text-gray-300">
            Are you sure you want to delete "{project.name}"? This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              className="border-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete} 
              variant="destructive"
            >
              Delete Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectActionsMenu;
