
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, Paperclip, Edit3 } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface KanbanCardProps {
  card: Tables<'cards'>;
  onUpdate: () => void;
}

const KanbanCard = ({ card, onUpdate }: KanbanCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [priority, setPriority] = useState(card.priority || 'medium');
  const { toast } = useToast();

  const priorityColors = {
    low: 'bg-green-900 text-green-300',
    medium: 'bg-yellow-900 text-yellow-300',
    high: 'bg-orange-900 text-orange-300',
    urgent: 'bg-red-900 text-red-300',
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('cards')
      .update({
        title: title.trim(),
        description: description.trim() || null,
        priority: priority as any,
      })
      .eq('id', card.id);

    if (error) {
      toast({
        title: "Error updating card",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setIsEditing(false);
      onUpdate();
    }
  };

  return (
    <>
      <Card 
        className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer group"
        onClick={() => setIsEditing(true)}
      >
        <CardContent className="p-3">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
              {card.title}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-white"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          </div>
          
          {card.description && (
            <p className="text-xs text-gray-400 mb-3 line-clamp-2">
              {card.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {card.priority && (
                <Badge className={`text-xs ${priorityColors[card.priority]}`}>
                  {card.priority}
                </Badge>
              )}
              {card.due_date && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(card.due_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MessageSquare className="h-3 w-3" />
                <span>0</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Paperclip className="h-3 w-3" />
                <span>0</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white resize-none"
                rows={4}
                placeholder="Add a description..."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Priority</label>
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
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KanbanCard;
