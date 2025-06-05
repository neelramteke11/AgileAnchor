
import { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Tables } from '@/integrations/supabase/types';
import KanbanCard from '@/components/KanbanCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, MoreVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface KanbanColumnProps {
  column: Tables<'board_columns'>;
  cards: Tables<'cards'>[];
  onCardUpdate: () => void;
}

const KanbanColumn = ({ column, cards, onCardUpdate }: KanbanColumnProps) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const { toast } = useToast();

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return;

    const maxPosition = Math.max(...cards.map(c => c.position), -1);
    
    const { error } = await supabase
      .from('cards')
      .insert({
        column_id: column.id,
        title: newCardTitle.trim(),
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
      setIsAddingCard(false);
      onCardUpdate();
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 w-80 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white truncate" style={{ color: column.color }}>
          {column.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{cards.length}</span>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[200px] space-y-2 ${
              snapshot.isDraggingOver ? 'bg-gray-800 rounded-lg' : ''
            }`}
          >
            {cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? 'rotate-3 scale-105' : ''}
                  >
                    <KanbanCard card={card} onUpdate={onCardUpdate} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {isAddingCard ? (
        <div className="mt-2 space-y-2">
          <Input
            placeholder="Enter card title..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            onKeyPress={(e) => e.key === 'Enter' && handleAddCard()}
            autoFocus
          />
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleAddCard}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => {
                setIsAddingCard(false);
                setNewCardTitle('');
              }}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAddingCard(true)}
          className="w-full mt-2 text-gray-400 hover:text-white justify-start"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a card
        </Button>
      )}
    </div>
  );
};

export default KanbanColumn;
