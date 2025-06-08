
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Settings, ArrowLeft } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const isSettingsPage = location.pathname === '/settings';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => navigate('/')}
              className="text-xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              ⚓AgileAnchor
            </button>
            {!isSettingsPage && (
              <div className="flex space-x-4">
                {/* Navigation items for non-settings pages can be added here if needed */}
              </div>
            )}
          </div>
          
          {isSettingsPage ? (
            <Button 
              onClick={() => navigate('/')}
              variant="ghost" 
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Homepage
            </Button>
          ) : (
            <Link to="/settings">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
