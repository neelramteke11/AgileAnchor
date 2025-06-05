
import { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import KanbanCard from './KanbanCard';
import EditableColumnHeader from './EditableColumnHeader';

interface KanbanColumnProps {
  column: Tables<'board_columns'>;
  cards: Tables<'cards'>[];
  onCardUpdate: () => void;
}

const KanbanColumn = ({ column, cards, onCardUpdate }: KanbanColumnProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const { toast } = useToast();

  const handleCreateCard = async () => {
    if (!newCardTitle.trim()) return;

    const maxPosition = Math.max(...cards.map(c => c.position), -1);
    
    const { error } = await supabase
      .from('cards')
      .insert({
        title: newCardTitle.trim(),
        column_id: column.id,
        position: maxPosition + 1,
      });

    if (error) {
      toast({
        title: "Error creating card",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNewCardTitle('');
      setIsCreating(false);
      onCardUpdate();
    }
  };

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-gray-900 rounded-lg p-4 h-full border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <EditableColumnHeader
            columnId={column.id}
            initialName={column.name}
            onUpdate={onCardUpdate}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">{cards.length}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsCreating(true)}
              className="text-gray-400 hover:text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`space-y-2 min-h-[100px] transition-colors ${
                snapshot.isDraggingOver ? 'bg-gray-800/50 rounded' : ''
              }`}
            >
              {cards.map((card, index) => (
                <KanbanCard
                  key={card.id}
                  card={card}
                  index={index}
                  onUpdate={onCardUpdate}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {isCreating && (
          <div className="mt-3 space-y-2">
            <Input
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Enter card title..."
              className="bg-gray-800 border-gray-700 text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateCard()}
              autoFocus
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateCard} size="sm" className="bg-blue-600 hover:bg-blue-700">
                Add Card
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setNewCardTitle('');
                }}
                size="sm"
                className="border-gray-700 text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
