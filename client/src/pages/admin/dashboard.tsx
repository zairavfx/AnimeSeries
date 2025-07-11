import { useQuery } from '@tanstack/react-query';
import { BarChart3, Users, FileText, Server, TrendingUp, Activity } from 'lucide-react';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/dashboard/stats'],
  });

  const { data: activityLogs = [] } = useQuery({
    queryKey: ['/api/admin/activity-logs'],
  });

  const statsCards = [
    {
      title: 'Total Pages',
      value: stats?.totalPages || 0,
      icon: FileText,
      color: 'from-cyber-cyan to-deep-blue',
      change: '+12%'
    },
    {
      title: 'Active Services',
      value: stats?.activeServices || 0,
      icon: Server,
      color: 'from-neon-purple to-volt-green',
      change: '+8%'
    },
    {
      title: 'Media Files',
      value: stats?.totalMediaFiles || 0,
      icon: BarChart3,
      color: 'from-volt-green to-sunset-orange',
      change: '+24%'
    },
    {
      title: 'New Contacts',
      value: stats?.newContacts || 0,
      icon: Users,
      color: 'from-sunset-orange to-cyber-cyan',
      change: '+5%'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="font-tech text-3xl font-bold text-cyber-cyan mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-400">
          Monitor your website's performance and manage content from here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <GlassmorphismCard key={stat.title} className="p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-volt-green text-sm font-medium mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </GlassmorphismCard>
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Activity */}
        <GlassmorphismCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-tech text-xl font-bold text-cyber-cyan">Recent Activity</h3>
            <Activity size={20} className="text-cyber-cyan" />
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activityLogs.slice(0, 10).map((log, index) => (
              <div key={log.id} className="flex items-start space-x-4 p-4 bg-steel-gray/30 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-cyber-cyan to-neon-purple rounded-lg flex items-center justify-center flex-shrink-0">
                  <getActionIcon action={log.action} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm">
                    {getActionDescription(log.action, log.resource, log.details)}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            
            {activityLogs.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Activity size={48} className="mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </GlassmorphismCard>

        {/* Quick Actions */}
        <GlassmorphismCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-tech text-xl font-bold text-cyber-cyan">Quick Actions</h3>
            <TrendingUp size={20} className="text-cyber-cyan" />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <button className="p-4 bg-gradient-to-r from-cyber-cyan/10 to-deep-blue/10 border border-cyber-cyan/20 rounded-lg text-left hover:border-cyber-cyan/40 transition-colors">
              <div className="flex items-center space-x-3">
                <FileText size={20} className="text-cyber-cyan" />
                <div>
                  <h4 className="font-semibold text-white">Create New Page</h4>
                  <p className="text-gray-400 text-sm">Add a new page to your website</p>
                </div>
              </div>
            </button>
            
            <button className="p-4 bg-gradient-to-r from-neon-purple/10 to-volt-green/10 border border-neon-purple/20 rounded-lg text-left hover:border-neon-purple/40 transition-colors">
              <div className="flex items-center space-x-3">
                <Server size={20} className="text-neon-purple" />
                <div>
                  <h4 className="font-semibold text-white">Add Service Plan</h4>
                  <p className="text-gray-400 text-sm">Create a new hosting plan</p>
                </div>
              </div>
            </button>
            
            <button className="p-4 bg-gradient-to-r from-volt-green/10 to-sunset-orange/10 border border-volt-green/20 rounded-lg text-left hover:border-volt-green/40 transition-colors">
              <div className="flex items-center space-x-3">
                <BarChart3 size={20} className="text-volt-green" />
                <div>
                  <h4 className="font-semibold text-white">Upload Media</h4>
                  <p className="text-gray-400 text-sm">Add images and files</p>
                </div>
              </div>
            </button>
            
            <button className="p-4 bg-gradient-to-r from-sunset-orange/10 to-cyber-cyan/10 border border-sunset-orange/20 rounded-lg text-left hover:border-sunset-orange/40 transition-colors">
              <div className="flex items-center space-x-3">
                <Users size={20} className="text-sunset-orange" />
                <div>
                  <h4 className="font-semibold text-white">View Contacts</h4>
                  <p className="text-gray-400 text-sm">Check new contact submissions</p>
                </div>
              </div>
            </button>
          </div>
        </GlassmorphismCard>
      </div>

      {/* System Status */}
      <GlassmorphismCard className="p-6">
        <h3 className="font-tech text-xl font-bold text-cyber-cyan mb-6">System Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-volt-green to-sunset-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-volt-green rounded-full animate-pulse"></div>
            </div>
            <h4 className="font-semibold text-white mb-1">Website Status</h4>
            <p className="text-volt-green text-sm">Online & Operational</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-cyber-cyan to-deep-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-cyber-cyan rounded-full animate-pulse"></div>
            </div>
            <h4 className="font-semibold text-white mb-1">Database</h4>
            <p className="text-cyber-cyan text-sm">Connected</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-neon-purple to-volt-green rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-neon-purple rounded-full animate-pulse"></div>
            </div>
            <h4 className="font-semibold text-white mb-1">API Services</h4>
            <p className="text-neon-purple text-sm">All Systems Go</p>
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  );
}

function getActionIcon(action: string) {
  switch (action) {
    case 'create':
      return <i className="fas fa-plus text-white text-xs"></i>;
    case 'update':
      return <i className="fas fa-edit text-white text-xs"></i>;
    case 'delete':
      return <i className="fas fa-trash text-white text-xs"></i>;
    default:
      return <i className="fas fa-circle text-white text-xs"></i>;
  }
}

function getActionDescription(action: string, resource: string, details: any) {
  const resourceName = details?.title || details?.name || 'item';
  
  switch (action) {
    case 'create':
      return `Created new ${resource}: ${resourceName}`;
    case 'update':
      return `Updated ${resource}: ${resourceName}`;
    case 'delete':
      return `Deleted ${resource}: ${resourceName}`;
    default:
      return `${action} ${resource}: ${resourceName}`;
  }
}
