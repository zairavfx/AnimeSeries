import { Link, useLocation } from 'wouter';
import { BarChart3, FileText, Server, Image, Menu, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  currentTab: string;
}

export function AdminSidebar({ currentTab }: AdminSidebarProps) {
  const [, setLocation] = useLocation();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      path: '/admin/dashboard',
      color: 'text-cyber-cyan'
    },
    {
      id: 'pages',
      label: 'Page Management',
      icon: FileText,
      path: '/admin/pages',
      color: 'text-neon-purple'
    },
    {
      id: 'services',
      label: 'Service Management',
      icon: Server,
      path: '/admin/services',
      color: 'text-volt-green'
    },
    {
      id: 'media',
      label: 'Media Library',
      icon: Image,
      path: '/admin/media',
      color: 'text-sunset-orange'
    },
    {
      id: 'navigation',
      label: 'Navigation',
      icon: Menu,
      path: '/admin/navigation',
      color: 'text-deep-blue'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      color: 'text-gray-400'
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 glass-effect border-r border-cyber-cyan/20 z-40 hidden lg:block">
      <div className="flex flex-col h-full pt-20">
        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const IconComponent = item.icon;

            return (
              <Link key={item.id} href={item.path}>
                <div className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer group',
                  isActive 
                    ? 'bg-cyber-cyan/20 border-l-3 border-cyber-cyan text-cyber-cyan' 
                    : 'text-white hover:bg-cyber-cyan/10 hover:text-cyber-cyan hover:border-l-3 hover:border-cyber-cyan/50'
                )}>
                  <IconComponent 
                    size={20} 
                    className={cn(
                      'transition-colors',
                      isActive ? 'text-cyber-cyan' : `${item.color} group-hover:text-cyber-cyan`
                    )} 
                  />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-cyber-cyan/20">
          <div className="mb-4 p-3 bg-steel-gray/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-volt-green rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-white">System Status</span>
            </div>
            <p className="text-xs text-gray-400">All systems operational</p>
          </div>

          <a href="/api/logout">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
