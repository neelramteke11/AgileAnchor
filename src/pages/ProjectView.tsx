
import { useState } from 'react';
import { Tables } from '@/integrations/supabase/types';
import KanbanBoard from '@/components/KanbanBoard';
import ProjectNotes from '@/components/ProjectNotes';
import ProjectLinks from '@/components/ProjectLinks';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Kanban, FileText, Link2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProjectViewProps {
  project: Tables<'projects'>;
  onBack: () => void;
}

const ProjectView = ({ project, onBack }: ProjectViewProps) => {
  return (
    <div className="min-h-screen bg-black">
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              {project.description && (
                <p className="text-gray-400 text-sm">{project.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="board" className="w-full">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="board" className="text-gray-300 data-[state=active]:text-white">
              <Kanban className="h-4 w-4 mr-2" />
              Board
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-gray-300 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="links" className="text-gray-300 data-[state=active]:text-white">
              <Link2 className="h-4 w-4 mr-2" />
              Links
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="board" className="mt-6">
            <KanbanBoard projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="notes" className="mt-6">
            <ProjectNotes projectId={project.id} />
          </TabsContent>
          
          <TabsContent value="links" className="mt-6">
            <ProjectLinks projectId={project.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectView;
