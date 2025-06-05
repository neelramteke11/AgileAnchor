
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tables } from '@/integrations/supabase/types';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import ProjectView from '@/pages/ProjectView';
import Settings from '@/pages/Settings';
import Index from '@/pages/Index';
import { LayoutDashboard, Settings as SettingsIcon, Home } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [selectedProject, setSelectedProject] = useState<Tables<'projects'> | null>(null);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const showNavbar = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-black">
      {showNavbar && (
        <nav className="border-b border-gray-800 bg-gray-900">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <h1 className="text-xl font-bold text-white">Project Manager</h1>
                <div className="flex space-x-4">
                  <Link to="/">
                    <Button variant="ghost" className="text-gray-300 hover:text-white">
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="ghost" className="text-gray-300 hover:text-white">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
              <Link to="/settings">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      )}

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
              <Dashboard onProjectSelect={setSelectedProject} />
            )
          } 
        />
        <Route path="/settings" element={<Settings />} />
      </Routes>

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
