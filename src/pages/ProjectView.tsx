
import KanbanBoard from '@/components/KanbanBoard';
import ProjectNotes from '@/components/ProjectNotes';
import ProjectLinks from '@/components/ProjectLinks';
import ProjectDashboard from '@/components/ProjectDashboard';
import TaskCalendar from '@/components/TaskCalendar';
import ProjectCover from '@/components/ProjectCover';
import CoverImageUpload from '@/components/CoverImageUpload';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Kanban, FileText, Link2, Calendar, LayoutDashboard, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tables } from '@/integrations/supabase/types';
import { useState } from 'react';

interface ProjectWithCover extends Tables<'projects'> {
  cover_image?: string;
}

interface ProjectViewProps {
  project: ProjectWithCover;
  onBack: () => void;
  onUpdate?: () => void;
}

const ProjectView = ({ project, onBack, onUpdate }: ProjectViewProps) => {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <ProjectCover project={project}>
        <div className="bg-black border-b border-gray-800">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowUpload(!showUpload)}
                className="text-gray-300 border-gray-600 hover:bg-gray-800"
              >
                <Upload className="h-4 w-4 mr-2" />
                {project.cover_image ? 'Change Cover' : 'Add Cover'}
              </Button>
            </div>
            
            {showUpload && (
              <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                <CoverImageUpload 
                  project={project} 
                  onUpdate={() => {
                    onUpdate?.();
                    setShowUpload(false);
                  }} 
                />
              </div>
            )}
          </div>
        </div>
      </ProjectCover>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="dashboard" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="board" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700">
              <Kanban className="h-4 w-4 mr-2" />
              Board
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700">
              <FileText className="h-4 w-4 mr-2" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="links" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700">
              <Link2 className="h-4 w-4 mr-2" />
              Links
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <ProjectDashboard projectId={project.id} project={project} />
          </TabsContent>

          <TabsContent value="board" className="mt-6">
            <KanbanBoard projectId={project.id} />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <TaskCalendar projectId={project.id} />
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
