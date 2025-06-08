
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Tables } from '@/integrations/supabase/types';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import ProjectView from '@/pages/ProjectView';
import Settings from '@/pages/Settings';
import Index from '@/pages/Index';
import Navbar from '@/components/Navbar';

function AppContent() {
  const { user, loading } = useAuth();
  const [selectedProject, setSelectedProject] = useState<Tables<'projects'> | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-2xl font-bold mb-2">⚓AgileAnchor</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-16 sm:pt-20">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route 
            path="/dashboard" 
            element={
              selectedProject ? (
                <ProjectView 
                  project={selectedProject} 
                  onBack={() => setSelectedProject(null)} 
                />
              ) : (
                <Dashboard onSelectProject={setSelectedProject} />
              )
            } 
          />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>

      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
