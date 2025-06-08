
import { useState, useEffect } from 'react';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import Dashboard from '@/pages/Dashboard';
import ProjectView from '@/pages/ProjectView';

interface ProjectWithCover extends Tables<'projects'> {
  cover_image?: string;
}

const Index = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectWithCover | null>(null);
  const [projects, setProjects] = useState<ProjectWithCover[]>([]);

  const loadProjects = async () => {
    const { data } = await supabase.from('projects').select('*');
    if (data) setProjects(data as ProjectWithCover[]);
  };

  const handleProjectUpdate = () => {
    loadProjects();
    if (selectedProject) {
      // Refresh the selected project data
      const updatedProject = projects.find(p => p.id === selectedProject.id);
      if (updatedProject) {
        setSelectedProject(updatedProject);
      }
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (selectedProject) {
    return (
      <ProjectView 
        project={selectedProject} 
        onBack={() => setSelectedProject(null)}
        onUpdate={handleProjectUpdate}
      />
    );
  }

  return <Dashboard onSelectProject={setSelectedProject} />;
};

export default Index;
