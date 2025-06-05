
import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tables } from '@/integrations/supabase/types';
import { User, Calendar, MessageCircle, Tag } from 'lucide-react';
import CardDetailsDialog from './CardDetailsDialog';

interface KanbanCardProps {
  card: Tables<'cards'>;
  index: number;
  onUpdate: () => void;
}

const priorityColors = {
  low: 'bg-gray-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
};

const KanbanCard = ({ card, index, onUpdate }: KanbanCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`mb-3 cursor-pointer transition-all duration-200 ${
              snapshot.isDragging 
                ? 'bg-gray-700 shadow-lg scale-105' 
                : 'bg-gray-800 hover:bg-gray-700'
            } border-gray-700`}
            onClick={() => setShowDetails(true)}
          >
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium text-white line-clamp-2">
                    {card.title}
                  </h4>
                  {card.priority && (
                    <div className={`w-2 h-2 rounded-full ${priorityColors[card.priority]} flex-shrink-0 ml-2`} />
                  )}
                </div>
                
                {card.description && (
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {card.description}
                  </p>
                )}

                {card.tags && card.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {card.tags.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-blue-600 text-white">
                        {tag}
                      </Badge>
                    ))}
                    {card.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-gray-600 text-white">
                        +{card.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {card.assigned_to && (
                      <div className="flex items-center gap-1 text-gray-400">
                        <User className="h-3 w-3" />
                        <span>Assigned</span>
                      </div>
                    )}
                    
                    {card.due_date && (
                      <div className="flex items-center gap-1 text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(card.due_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-400">
                    <MessageCircle className="h-3 w-3" />
                    <span>0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </Draggable>

      <CardDetailsDialog
        card={card}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default KanbanCard;
