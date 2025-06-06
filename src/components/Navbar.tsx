
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, Settings as SettingsIcon, Home } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || location.pathname === '/') {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-white">
              ⚓AgileAnchor
            </Link>
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
  );
};

export default Navbar;
