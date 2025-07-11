import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { CyberButton } from '@/components/ui/cyber-button';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { SERVICE_ICONS } from '@/lib/constants';

export function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const { data: navigationItems = [] } = useQuery({
    queryKey: ['/api/navigation'],
    enabled: isAuthenticated,
  });

  const { data: publicSettings = {} } = useQuery({
    queryKey: ['/api/settings/public'],
  });

  const isAdmin = user?.role === 'super_admin' || user?.role === 'editor';

  const defaultNavItems = [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'VPS', path: '/vps', icon: 'server' },
    { label: 'Hosting', path: '/hosting', icon: 'cloud' },
    { label: 'Domains', path: '/domains', icon: 'globe' },
    { label: 'Development', path: '/website-making', icon: 'code' },
    { label: 'Bots', path: '/telegram-bot', icon: 'message-square' },
    { label: 'Contact', path: '/contact', icon: 'headphones' }
  ];

  const navItems = navigationItems.length > 0 ? navigationItems : defaultNavItems;
  const siteName = publicSettings.site_name || 'OnAnimeSeries';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-cyber-cyan/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer group">
                <div className="w-8 h-8 bg-gradient-to-r from-cyber-cyan to-neon-purple rounded-lg flex items-center justify-center group-hover:animate-float">
                  <i className="fas fa-terminal text-white text-sm"></i>
                </div>
                <span className="font-tech text-xl font-bold neon-text text-cyber-cyan">
                  {siteName}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const IconComponent = SERVICE_ICONS[item.icon as keyof typeof SERVICE_ICONS];
                const isActive = location === item.path;
                
                return (
                  <Link key={item.path} href={item.path}>
                    <div className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer
                      ${isActive 
                        ? 'text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30' 
                        : 'text-white hover:text-cyber-cyan hover:bg-cyber-cyan/5'
                      }
                    `}>
                      {IconComponent && <IconComponent size={16} />}
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
              
              {isAuthenticated && (
                <div className="flex items-center space-x-4">
                  {isAdmin && (
                    <Link href="/admin">
                      <CyberButton variant="outline" size="sm" className="border-neon-purple text-neon-purple hover:bg-neon-purple">
                        <Shield size={16} className="mr-2" />
                        Admin
                      </CyberButton>
                    </Link>
                  )}
                  
                  <a href="/api/logout">
                    <CyberButton variant="ghost" size="sm">
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </CyberButton>
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white hover:text-cyber-cyan transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <GlassmorphismCard className="m-4 border-t border-cyber-cyan/20">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => {
                  const IconComponent = SERVICE_ICONS[item.icon as keyof typeof SERVICE_ICONS];
                  const isActive = location === item.path;
                  
                  return (
                    <Link key={item.path} href={item.path}>
                      <div 
                        className={`
                          flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer
                          ${isActive 
                            ? 'text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30' 
                            : 'text-white hover:text-cyber-cyan hover:bg-cyber-cyan/5'
                          }
                        `}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {IconComponent && <IconComponent size={16} />}
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
                
                {isAuthenticated && (
                  <div className="border-t border-cyber-cyan/20 pt-2 mt-2 space-y-1">
                    {isAdmin && (
                      <Link href="/admin">
                        <div 
                          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-neon-purple hover:bg-neon-purple/10 transition-colors cursor-pointer"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Shield size={16} />
                          <span>Admin Panel</span>
                        </div>
                      </Link>
                    )}
                    
                    <a href="/api/logout">
                      <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white hover:bg-gray-700/50 transition-colors cursor-pointer">
                        <LogOut size={16} />
                        <span>Logout</span>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </GlassmorphismCard>
          </div>
        )}
      </nav>
    </>
  );
}
