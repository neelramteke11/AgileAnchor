
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Check, X } from 'lucide-react';

interface EditableColumnHeaderProps {
  columnId: string;
  initialName: string;
  onUpdate: () => void;
}

const EditableColumnHeader = ({ columnId, initialName, onUpdate }: EditableColumnHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!name.trim()) return;

    const { error } = await supabase
      .from('board_columns')
      .update({ name: name.trim() })
      .eq('id', columnId);

    if (error) {
      toast({
        title: "Error updating column",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setIsEditing(false);
      onUpdate();
    }
  };

  const handleCancel = () => {
    setName(initialName);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white text-sm"
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
        />
        <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Check className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancel} className="border-gray-700">
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <h3 className="font-semibold text-white">{initialName}</h3>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit3 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default EditableColumnHeader;
