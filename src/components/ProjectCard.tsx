
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Link2, MoreVertical } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

interface ProjectCardProps {
  project: Tables<'projects'>;
  onSelect: (project: Tables<'projects'>) => void;
}

const ProjectCard = ({ project, onSelect }: ProjectCardProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1" onClick={() => onSelect(project)}>
          <CardTitle className="text-lg font-semibold text-white truncate">
            {project.name}
          </CardTitle>
          {project.description && (
            <CardDescription className="text-gray-400 mt-1 line-clamp-2">
              {project.description}
            </CardDescription>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent onClick={() => onSelect(project)}>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="h-3 w-3" />
              <Link2 className="h-3 w-3" />
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs ${
            project.status === 'active' 
              ? 'bg-green-900 text-green-300' 
              : 'bg-gray-800 text-gray-400'
          }`}>
            {project.status}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
