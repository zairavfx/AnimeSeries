import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { AdminSidebar } from '@/components/admin/sidebar';
import AdminDashboard from './dashboard';
import AdminPages from './pages';
import AdminServices from './services';
import AdminMedia from './media';
import AdminNavigation from './navigation';
import AdminSettings from './settings';

export default function AdminPanel() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Extract the tab from the URL
  const currentTab = location.split('/admin/')[1] || 'dashboard';

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Check if user has admin permissions
  useEffect(() => {
    if (user && user.role !== 'super_admin' && user.role !== 'editor') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
      });
      setLocation('/');
      return;
    }
  }, [user, setLocation, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyber-cyan"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case 'pages':
        return <AdminPages />;
      case 'services':
        return <AdminServices />;
      case 'media':
        return <AdminMedia />;
      case 'navigation':
        return <AdminNavigation />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-rich-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-rich-black via-charcoal to-steel-gray pointer-events-none" />
      
      {/* Admin Header */}
      <div className="glass-effect border-b border-cyber-cyan/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-neon-purple to-deep-blue rounded-lg flex items-center justify-center">
                <i className="fas fa-user-shield text-white"></i>
              </div>
              <div>
                <h1 className="font-tech text-2xl font-bold text-cyber-cyan">
                  OnAnimeSeries Admin Panel
                </h1>
                <p className="text-gray-400 text-sm">
                  Welcome back, {user.firstName || user.email}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setLocation('/')}
              className="bg-gradient-to-r from-volt-green to-sunset-orange px-4 py-2 rounded-lg font-medium text-rich-black hover:from-sunset-orange hover:to-volt-green transition-all duration-300"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Site
            </button>
          </div>
        </div>
      </div>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <AdminSidebar currentTab={currentTab} />
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
