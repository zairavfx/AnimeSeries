import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Eye, Power, Trash2 } from 'lucide-react';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { PageEditor } from '@/components/admin/page-editor';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function AdminPages() {
  const [selectedPage, setSelectedPage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['/api/admin/pages'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      toast({
        title: "Success",
        description: "Page deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: number; isPublished: boolean }) => {
      await apiRequest('PUT', `/api/admin/pages/${id}`, { isPublished: !isPublished });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      toast({
        title: "Success",
        description: "Page status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update page status",
        variant: "destructive",
      });
    },
  });

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (page: any) => {
    setSelectedPage(page);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setSelectedPage(null);
    setIsEditing(true);
  };

  const handleCloseEditor = () => {
    setIsEditing(false);
    setSelectedPage(null);
  };

  if (isEditing) {
    return (
      <PageEditor 
        page={selectedPage} 
        onClose={handleCloseEditor}
        onSave={() => {
          queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
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
            Page Management
          </h1>
          <p className="text-gray-400">
            Create and manage all website pages with dynamic content
          </p>
        </div>
        <CyberButton onClick={handleCreate} glow>
          <Plus size={20} className="mr-2" />
          Create New Page
        </CyberButton>
      </div>

      {/* Pages Table */}
      <GlassmorphismCard className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-cyan mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading pages...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-steel-gray/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Modified
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-gray/30">
                {pages.map((page: any) => (
                  <tr key={page.id} className="hover:bg-steel-gray/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyber-cyan to-neon-purple rounded-lg flex items-center justify-center mr-3">
                          <i className="fas fa-file-alt text-white text-xs"></i>
                        </div>
                        <div>
                          <div className="text-white font-medium">{page.title}</div>
                          <div className="text-gray-400 text-sm">{page.layoutType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      /{page.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        page.isPublished 
                          ? 'bg-volt-green/20 text-volt-green' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {page.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(page)}
                          className="text-neon-purple hover:text-neon-purple/80 transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => window.open(`/${page.slug}`, '_blank')}
                          className="text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
                          title="Preview"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => toggleStatusMutation.mutate({ id: page.id, isPublished: page.isPublished })}
                          className={`${page.isPublished ? 'text-sunset-orange' : 'text-volt-green'} hover:opacity-80 transition-colors`}
                          title={page.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          <Power size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(page.id, page.title)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {pages.length === 0 && (
              <div className="text-center py-12">
                <i className="fas fa-file-alt text-gray-500 text-4xl mb-4"></i>
                <h3 className="text-lg font-medium text-gray-400 mb-2">No pages yet</h3>
                <p className="text-gray-500 mb-4">Create your first page to get started</p>
                <CyberButton onClick={handleCreate}>
                  <Plus size={16} className="mr-2" />
                  Create Page
                </CyberButton>
              </div>
            )}
          </div>
        )}
      </GlassmorphismCard>
    </div>
  );
}
