
import { useState } from 'react';
import { Tables } from '@/integrations/supabase/types';
import Dashboard from '@/pages/Dashboard';
import ProjectView from '@/pages/ProjectView';

const Index = () => {
  const [selectedProject, setSelectedProject] = useState<Tables<'projects'> | null>(null);

  if (selectedProject) {
    return (
      <ProjectView 
        project={selectedProject} 
        onBack={() => setSelectedProject(null)} 
      />
    );
  }

  return <Dashboard onSelectProject={setSelectedProject} />;
};

export default Index;
