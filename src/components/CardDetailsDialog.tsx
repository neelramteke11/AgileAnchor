
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Tag, MessageCircle, X, Plus, Calendar } from 'lucide-react';

interface CardDetailsDialogProps {
  card: Tables<'cards'> | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: Profile;
}

const CardDetailsDialog = ({ card, isOpen, onClose, onUpdate }: CardDetailsDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [dueDate, setDueDate] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setAssignedTo(card.assigned_to || '');
      setTags(card.tags || []);
      setPriority(card.priority || 'medium');
      setDueDate(card.due_date ? new Date(card.due_date).toISOString().split('T')[0] : '');
      loadComments();
    }
  }, [card]);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*');
    setProfiles(data || []);
  };

  const loadComments = async () => {
    if (!card) return;
    
    const { data } = await supabase
      .from('card_comments')
      .select(`
        *,
        profiles:user_id (
          id,
          first_name,
          last_name
        )
      `)
      .eq('card_id', card.id)
      .order('created_at', { ascending: true });
    
    setComments(data || []);
  };

  const handleSave = async () => {
    if (!card) return;

    const { error } = await supabase
      .from('cards')
      .update({
        title,
        description: description || null,
        assigned_to: assignedTo || null,
        tags,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      })
      .eq('id', card.id);

    if (error) {
      toast({
        title: "Error updating card",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Card updated",
        description: "Your changes have been saved.",
      });
      onUpdate();
      onClose();
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addComment = async () => {
    if (!card || !newComment.trim()) return;

    const { error } = await supabase
      .from('card_comments')
      .insert({
        card_id: card.id,
        content: newComment.trim(),
        user_id: (await supabase.auth.getUser()).data.user?.id!,
      });

    if (error) {
      toast({
        title: "Error adding comment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNewComment('');
      loadComments();
    }
  };

  if (!card) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Card Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-300">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Due Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Assigned To</label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="">Unassigned</SelectItem>
                {profiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.first_name || profile.last_name 
                      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                      : profile.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Tags</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-blue-600 text-white">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                className="bg-gray-800 border-gray-700 text-white"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Comments</label>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-700 pb-2 last:border-b-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">
                        {comment.profiles?.first_name || comment.profiles?.last_name 
                          ? `${comment.profiles.first_name || ''} ${comment.profiles.last_name || ''}`.trim()
                          : 'User'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{comment.content}</p>
                  </div>
                ))}
                
                <div className="flex gap-2 pt-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                  <Button onClick={addComment} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose} className="border-gray-700 text-gray-300">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailsDialog;
