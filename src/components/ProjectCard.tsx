
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tables } from '@/integrations/supabase/types';
import { Calendar } from 'lucide-react';
import ProjectActionsMenu from './ProjectActionsMenu';

interface ProjectCardProps {
  project: Tables<'projects'>;
  onClick: () => void;
  onUpdate: () => void;
}

const ProjectCard = ({ project, onClick, onUpdate }: ProjectCardProps) => {
  const statusColor = project.status === 'active' ? 'bg-green-600' : 'bg-gray-600';
  
  return (
    <Card 
      className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium text-white">
          {project.name}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className={`${statusColor} text-white`}>
            {project.status}
          </Badge>
          <div 
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <ProjectActionsMenu project={project} onUpdate={onUpdate} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {project.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
