
import { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Tables } from '@/integrations/supabase/types';
import KanbanColumn from '@/components/KanbanColumn';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface KanbanBoardProps {
  projectId: string;
}

const KanbanBoard = ({ projectId }: KanbanBoardProps) => {
  const [columns, setColumns] = useState<Tables<'board_columns'>[]>([]);
  const [cards, setCards] = useState<Tables<'cards'>[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadBoard = async () => {
    try {
      // Load columns
      const { data: columnsData, error: columnsError } = await supabase
        .from('board_columns')
        .select('*')
        .eq('project_id', projectId)
        .order('position');

      if (columnsError) throw columnsError;

      // Load cards
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .in('column_id', columnsData?.map(col => col.id) || [])
        .order('position');

      if (cardsError) throw cardsError;

      setColumns(columnsData || []);
      setCards(cardsData || []);
    } catch (error: any) {
      toast({
        title: "Error loading board",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoard();
  }, [projectId]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceColumnId = source.droppableId;
    const destColumnId = destination.droppableId;

    // Get cards for the destination column
    const destCards = cards.filter(card => card.column_id === destColumnId);
    const sourceCards = cards.filter(card => card.column_id === sourceColumnId);

    if (sourceColumnId === destColumnId) {
      // Moving within the same column
      const newCards = Array.from(sourceCards);
      const [removed] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, removed);

      // Update positions
      const updates = newCards.map((card, index) => ({
        id: card.id,
        position: index,
      }));

      for (const update of updates) {
        await supabase
          .from('cards')
          .update({ position: update.position })
          .eq('id', update.id);
      }
    } else {
      // Moving to a different column
      await supabase
        .from('cards')
        .update({
          column_id: destColumnId,
          position: destination.index,
        })
        .eq('id', draggableId);

      // Update positions in destination column
      for (let i = destination.index + 1; i < destCards.length + 1; i++) {
        const card = destCards[i - 1];
        if (card && card.id !== draggableId) {
          await supabase
            .from('cards')
            .update({ position: i })
            .eq('id', card.id);
        }
      }
    }

    loadBoard(); // Reload to get fresh data
  };

  const createColumn = async () => {
    const maxPosition = Math.max(...columns.map(c => c.position), -1);
    
    const { error } = await supabase
      .from('board_columns')
      .insert({
        project_id: projectId,
        name: 'New Column',
        position: maxPosition + 1,
      });

    if (error) {
      toast({
        title: "Error creating column",
        description: error.message,
        variant: "destructive",
      });
    } else {
      loadBoard();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Loading board...</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={cards.filter(card => card.column_id === column.id)}
              onCardUpdate={loadBoard}
            />
          ))}
          
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              onClick={createColumn}
              className="w-80 h-12 border-2 border-dashed border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
