
import React from 'react';
import { Tables } from '@/integrations/supabase/types';

interface ProjectCoverProps {
  project: Tables<'projects'>;
  children?: React.ReactNode;
}

const ProjectCover = ({ project, children }: ProjectCoverProps) => {
  if (!project.cover_image) {
    return (
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">{project.name}</h1>
            {project.description && (
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">{project.description}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        className="h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${project.cover_image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">{project.name}</h1>
            {project.description && (
              <p className="text-xl text-gray-200 max-w-2xl">{project.description}</p>
            )}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ProjectCover;
