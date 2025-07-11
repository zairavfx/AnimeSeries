import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Eye, Settings, Trash2 } from 'lucide-react';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { ServiceCardEditor } from '@/components/admin/service-card-editor';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function AdminServices() {
  const [selectedService, setSelectedService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlans, setEditingPlans] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['/api/admin/services'],
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/services'] });
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    },
  });

  const toggleServiceMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      await apiRequest('PUT', `/api/admin/services/${id}`, { isActive: !isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/services'] });
      toast({
        title: "Success",
        description: "Service status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update service status",
        variant: "destructive",
      });
    },
  });

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteServiceMutation.mutate(id);
    }
  };

  const handleEdit = (service: any) => {
    setSelectedService(service);
    setIsEditing(true);
    setEditingPlans(false);
  };

  const handleManagePlans = (service: any) => {
    setSelectedService(service);
    setIsEditing(true);
    setEditingPlans(true);
  };

  const handleCreate = () => {
    setSelectedService(null);
    setIsEditing(true);
    setEditingPlans(false);
  };

  const handleCloseEditor = () => {
    setIsEditing(false);
    setSelectedService(null);
    setEditingPlans(false);
  };

  if (isEditing) {
    return (
      <ServiceCardEditor 
        service={selectedService}
        editingPlans={editingPlans}
        onClose={handleCloseEditor}
        onSave={() => {
          queryClient.invalidateQueries({ queryKey: ['/api/admin/services'] });
          handleCloseEditor();
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-tech text-3xl font-bold text-cyber-cyan mb-2">
            Service Management
          </h1>
          <p className="text-gray-400">
            Manage all hosting services, plans, and pricing
          </p>
        </div>
        <CyberButton onClick={handleCreate} glow>
          <Plus size={20} className="mr-2" />
          Add New Service
        </CyberButton>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-cyan mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading services...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((service: any) => (
            <GlassmorphismCard key={service.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyber-cyan to-neon-purple rounded-lg flex items-center justify-center">
                    <i className={`fas ${service.icon || 'fa-server'} text-white`}></i>
                  </div>
                  <div>
                    <h3 className="font-tech text-lg font-bold text-cyber-cyan">
                      {service.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{service.slug}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="w-8 h-8 bg-neon-purple/20 hover:bg-neon-purple/40 rounded-lg flex items-center justify-center transition-colors"
                    title="Edit Service"
                  >
                    <Edit size={14} className="text-neon-purple" />
                  </button>
                  <button
                    onClick={() => toggleServiceMutation.mutate({ id: service.id, isActive: service.isActive })}
                    className={`w-8 h-8 ${service.isActive ? 'bg-sunset-orange/20 hover:bg-sunset-orange/40' : 'bg-volt-green/20 hover:bg-volt-green/40'} rounded-lg flex items-center justify-center transition-colors`}
                    title={service.isActive ? 'Deactivate' : 'Activate'}
                  >
                    <Eye size={14} className={service.isActive ? 'text-sunset-orange' : 'text-volt-green'} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id, service.name)}
                    className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 rounded-lg flex items-center justify-center transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {service.description}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={service.isActive ? 'text-volt-green' : 'text-gray-500'}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sort Order:</span>
                  <span className="text-white">{service.sortOrder}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Color:</span>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-600"
                      style={{ backgroundColor: service.color || '#00D9FF' }}
                    ></div>
                    <span className="text-white text-sm">{service.color || '#00D9FF'}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <CyberButton 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleManagePlans(service)}
                >
                  <Settings size={14} className="mr-2" />
                  Manage Plans
                </CyberButton>
                <CyberButton 
                  size="sm" 
                  variant="outline" 
                  onClick={() => window.open(`/${service.slug}`, '_blank')}
                >
                  <Eye size={14} className="mr-2" />
                  Preview
                </CyberButton>
              </div>
            </GlassmorphismCard>
          ))}
        </div>
      )}

      {services.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <i className="fas fa-server text-gray-500 text-4xl mb-4"></i>
          <h3 className="text-lg font-medium text-gray-400 mb-2">No services yet</h3>
          <p className="text-gray-500 mb-4">Create your first service to get started</p>
          <CyberButton onClick={handleCreate}>
            <Plus size={16} className="mr-2" />
            Create Service
          </CyberButton>
        </div>
      )}
    </div>
  );
}
