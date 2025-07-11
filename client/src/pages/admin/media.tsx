import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Search, Grid, List, Trash2, Edit, Download } from 'lucide-react';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { MediaUpload } from '@/components/admin/media-upload';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function AdminMedia() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mediaFiles = [], isLoading } = useQuery({
    queryKey: ['/api/admin/media'],
  });

  const deleteMediaMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/media'] });
      toast({
        title: "Success",
        description: "Media file deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete media file",
        variant: "destructive",
      });
    },
  });

  const filteredFiles = mediaFiles.filter((file: any) =>
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.alt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = async (id: number, filename: string) => {
    if (window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      deleteMediaMutation.mutate(id);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'fa-image';
    if (mimeType.startsWith('video/')) return 'fa-video';
    if (mimeType.startsWith('audio/')) return 'fa-music';
    if (mimeType.includes('pdf')) return 'fa-file-pdf';
    return 'fa-file';
  };

  if (isUploading) {
    return (
      <MediaUpload 
        onClose={() => setIsUploading(false)}
        onUpload={() => {
          queryClient.invalidateQueries({ queryKey: ['/api/admin/media'] });
          setIsUploading(false);
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
            Media Library
          </h1>
          <p className="text-gray-400">
            Manage all uploaded images, videos, and files
          </p>
        </div>
        <CyberButton onClick={() => setIsUploading(true)} glow>
          <Upload size={20} className="mr-2" />
          Upload Files
        </CyberButton>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="cyber-input pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-cyber-cyan/20 text-cyber-cyan' 
                : 'bg-steel-gray/30 text-gray-400 hover:text-white'
            }`}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-cyber-cyan/20 text-cyber-cyan' 
                : 'bg-steel-gray/30 text-gray-400 hover:text-white'
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Upload Drop Zone */}
      <GlassmorphismCard 
        className="p-8 border-2 border-dashed border-cyber-cyan/30 hover:border-cyber-cyan/50 transition-colors cursor-pointer"
        onClick={() => setIsUploading(true)}
      >
        <div className="text-center">
          <Upload size={48} className="mx-auto text-cyber-cyan mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Drag & Drop Files Here</h3>
          <p className="text-gray-400 mb-4">Or click to browse files</p>
          <p className="text-sm text-gray-500">Supports: JPG, PNG, GIF, SVG, MP4, WebP (Max: 10MB)</p>
        </div>
      </GlassmorphismCard>

      {/* Media Grid/List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-cyan mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading media files...</p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredFiles.map((file: any) => (
                <GlassmorphismCard key={file.id} className="p-2 group cursor-pointer hover:scale-105 transition-transform">
                  <div className="aspect-square bg-center bg-cover rounded-lg mb-2 relative overflow-hidden">
                    {file.mimeType.startsWith('image/') ? (
                      <img 
                        src={file.url} 
                        alt={file.alt || file.originalName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-steel-gray/50 flex items-center justify-center">
                        <i className={`fas ${getFileTypeIcon(file.mimeType)} text-4xl text-gray-400`}></i>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(file.url, '_blank')}
                          className="w-8 h-8 bg-cyber-cyan/80 hover:bg-cyber-cyan rounded-lg flex items-center justify-center text-white"
                          title="View"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(file.id, file.originalName)}
                          className="w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-lg flex items-center justify-center text-white"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 truncate">{file.originalName}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="w-6 h-6 bg-cyber-cyan/20 hover:bg-cyber-cyan/40 rounded text-cyber-cyan text-xs flex items-center justify-center"
                        title="Edit"
                      >
                        <Edit size={10} />
                      </button>
                    </div>
                  </div>
                </GlassmorphismCard>
              ))}
            </div>
          ) : (
            <GlassmorphismCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-steel-gray/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        File
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Uploaded
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-steel-gray/30">
                    {filteredFiles.map((file: any) => (
                      <tr key={file.id} className="hover:bg-steel-gray/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-steel-gray/50 rounded-lg flex items-center justify-center mr-3">
                              {file.mimeType.startsWith('image/') ? (
                                <img 
                                  src={file.url} 
                                  alt={file.alt || file.originalName}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <i className={`fas ${getFileTypeIcon(file.mimeType)} text-gray-400`}></i>
                              )}
                            </div>
                            <div>
                              <div className="text-white font-medium">{file.originalName}</div>
                              <div className="text-gray-400 text-sm">{file.alt || 'No description'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {file.mimeType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {new Date(file.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => window.open(file.url, '_blank')}
                              className="text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
                              title="Download"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              className="text-neon-purple hover:text-neon-purple/80 transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(file.id, file.originalName)}
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
              </div>
            </GlassmorphismCard>
          )}

          {filteredFiles.length === 0 && (
            <div className="text-center py-12">
              <Upload size={48} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">
                {searchQuery ? 'No files found' : 'No media files yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Upload your first file to get started'}
              </p>
              {!searchQuery && (
                <CyberButton onClick={() => setIsUploading(true)}>
                  <Upload size={16} className="mr-2" />
                  Upload Files
                </CyberButton>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
