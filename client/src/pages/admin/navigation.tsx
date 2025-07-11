import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, ArrowUp, ArrowDown, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const navigationItemSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  path: z.string().optional(),
  externalUrl: z.string().optional(),
  parentId: z.number().optional(),
  sortOrder: z.number().default(0),
  isVisible: z.boolean().default(true),
  icon: z.string().optional(),
});

type NavigationItemFormData = z.infer<typeof navigationItemSchema>;

export default function AdminNavigation() {
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: navigationItems = [], isLoading } = useQuery({
    queryKey: ['/api/admin/navigation'],
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<NavigationItemFormData>({
    resolver: zodResolver(navigationItemSchema),
    defaultValues: {
      isVisible: true,
      sortOrder: 0
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: NavigationItemFormData) => {
      return await apiRequest('POST', '/api/admin/navigation', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/navigation'] });
      toast({
        title: "Success",
        description: "Navigation item created successfully",
      });
      handleCancel();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create navigation item",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<NavigationItemFormData> }) => {
      return await apiRequest('PUT', `/api/admin/navigation/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/navigation'] });
      toast({
        title: "Success",
        description: "Navigation item updated successfully",
      });
      handleCancel();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update navigation item",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/navigation/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/navigation'] });
      toast({
        title: "Success",
        description: "Navigation item deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete navigation item",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: NavigationItemFormData) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsCreating(true);
    reset(item);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsCreating(true);
    reset({
      isVisible: true,
      sortOrder: navigationItems.length
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingItem(null);
    reset();
  };

  const handleDelete = async (id: number, label: string) => {
    if (window.confirm(`Are you sure you want to delete "${label}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const moveItem = async (id: number, direction: 'up' | 'down') => {
    const currentItem = navigationItems.find((item: any) => item.id === id);
    if (!currentItem) return;

    const newSortOrder = direction === 'up' ? currentItem.sortOrder - 1 : currentItem.sortOrder + 1;
    updateMutation.mutate({ 
      id, 
      data: { sortOrder: newSortOrder } 
    });
  };

  const iconOptions = [
    { value: 'home', label: 'Home' },
    { value: 'server', label: 'Server' },
    { value: 'cloud', label: 'Cloud' },
    { value: 'globe', label: 'Globe' },
    { value: 'code', label: 'Code' },
    { value: 'message-square', label: 'Message' },
    { value: 'headphones', label: 'Headphones' },
    { value: 'shield', label: 'Shield' },
    { value: 'zap', label: 'Zap' },
    { value: 'settings', label: 'Settings' }
  ];

  if (isCreating) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-tech text-3xl font-bold text-cyber-cyan mb-2">
              {editingItem ? 'Edit Navigation Item' : 'Create Navigation Item'}
            </h1>
            <p className="text-gray-400">
              {editingItem ? 'Update navigation item details' : 'Add a new item to the navigation menu'}
            </p>
          </div>
          <CyberButton variant="outline" onClick={handleCancel}>
            Cancel
          </CyberButton>
        </div>

        {/* Form */}
        <GlassmorphismCard className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="label" className="text-cyber-cyan">Label *</Label>
                <Input
                  id="label"
                  {...register('label')}
                  placeholder="Navigation label"
                  className="cyber-input"
                />
                {errors.label && (
                  <p className="text-red-400 text-sm">{errors.label.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon" className="text-cyber-cyan">Icon</Label>
                <Select onValueChange={(value) => setValue('icon', value)}>
                  <SelectTrigger className="cyber-input">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="path" className="text-cyber-cyan">Internal Path</Label>
                <Input
                  id="path"
                  {...register('path')}
                  placeholder="/page-slug"
                  className="cyber-input"
                />
                <p className="text-gray-500 text-xs">Use for internal pages (e.g., /vps, /hosting)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="externalUrl" className="text-cyber-cyan">External URL</Label>
                <Input
                  id="externalUrl"
                  {...register('externalUrl')}
                  placeholder="https://example.com"
                  className="cyber-input"
                />
                <p className="text-gray-500 text-xs">Use for external links</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sortOrder" className="text-cyber-cyan">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  {...register('sortOrder', { valueAsNumber: true })}
                  className="cyber-input"
                />
                <p className="text-gray-500 text-xs">Lower numbers appear first</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentId" className="text-cyber-cyan">Parent Item</Label>
                <Select onValueChange={(value) => setValue('parentId', parseInt(value))}>
                  <SelectTrigger className="cyber-input">
                    <SelectValue placeholder="Select parent (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None (Top Level)</SelectItem>
                    {navigationItems.filter((item: any) => item.id !== editingItem?.id).map((item: any) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isVisible"
                checked={watch('isVisible')}
                onCheckedChange={(checked) => setValue('isVisible', checked)}
              />
              <Label htmlFor="isVisible" className="text-white">
                Visible in navigation
              </Label>
            </div>

            <div className="flex space-x-4 pt-6">
              <CyberButton type="submit" glow>
                {editingItem ? 'Update Item' : 'Create Item'}
              </CyberButton>
              <CyberButton type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </CyberButton>
            </div>
          </form>
        </GlassmorphismCard>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-tech text-3xl font-bold text-cyber-cyan mb-2">
            Navigation Management
          </h1>
          <p className="text-gray-400">
            Manage website navigation menu items and their order
          </p>
        </div>
        <CyberButton onClick={handleCreate} glow>
          <Plus size={20} className="mr-2" />
          Add Navigation Item
        </CyberButton>
      </div>

      {/* Navigation Items List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-cyan mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading navigation items...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {navigationItems
            .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
            .map((item: any, index: number) => (
              <GlassmorphismCard key={item.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => moveItem(item.id, 'up')}
                        disabled={index === 0}
                        className="w-6 h-6 bg-cyber-cyan/20 hover:bg-cyber-cyan/40 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowUp size={12} className="text-cyber-cyan" />
                      </button>
                      <button
                        onClick={() => moveItem(item.id, 'down')}
                        disabled={index === navigationItems.length - 1}
                        className="w-6 h-6 bg-cyber-cyan/20 hover:bg-cyber-cyan/40 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowDown size={12} className="text-cyber-cyan" />
                      </button>
                    </div>

                    <div className="w-10 h-10 bg-gradient-to-r from-cyber-cyan to-neon-purple rounded-lg flex items-center justify-center">
                      {item.icon ? (
                        <i className={`fas fa-${item.icon} text-white`}></i>
                      ) : (
                        <i className="fas fa-circle text-white"></i>
                      )}
                    </div>

                    <div>
                      <h3 className="font-tech text-lg font-bold text-white flex items-center space-x-2">
                        <span>{item.label}</span>
                        {!item.isVisible && (
                          <EyeOff size={16} className="text-gray-500" />
                        )}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Order: {item.sortOrder}</span>
                        {item.path && (
                          <span className="flex items-center space-x-1">
                            <i className="fas fa-link text-xs"></i>
                            <span>{item.path}</span>
                          </span>
                        )}
                        {item.externalUrl && (
                          <span className="flex items-center space-x-1">
                            <ExternalLink size={12} />
                            <span>{item.externalUrl}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="w-8 h-8 bg-neon-purple/20 hover:bg-neon-purple/40 rounded-lg flex items-center justify-center transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} className="text-neon-purple" />
                    </button>
                    
                    {(item.path || item.externalUrl) && (
                      <button
                        onClick={() => window.open(item.path || item.externalUrl, '_blank')}
                        className="w-8 h-8 bg-cyber-cyan/20 hover:bg-cyber-cyan/40 rounded-lg flex items-center justify-center transition-colors"
                        title="Preview"
                      >
                        <Eye size={14} className="text-cyber-cyan" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(item.id, item.label)}
                      className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 rounded-lg flex items-center justify-center transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </GlassmorphismCard>
            ))}

          {navigationItems.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-bars text-gray-500 text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-400 mb-2">No navigation items yet</h3>
              <p className="text-gray-500 mb-4">Create your first navigation item to get started</p>
              <CyberButton onClick={handleCreate}>
                <Plus size={16} className="mr-2" />
                Add Navigation Item
              </CyberButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
