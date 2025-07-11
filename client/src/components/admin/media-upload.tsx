import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, X, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface MediaUploadProps {
  onClose: () => void;
  onUpload: () => void;
}

interface FileWithPreview extends File {
  preview?: string;
  id?: string;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  progress?: number;
  alt?: string;
  caption?: string;
  tags?: string[];
}

export function MediaUpload({ onClose, onUpload }: MediaUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (fileData: { file: File; alt?: string; caption?: string; tags?: string[] }) => {
      const formData = new FormData();
      formData.append('file', fileData.file);
      if (fileData.alt) formData.append('alt', fileData.alt);
      if (fileData.caption) formData.append('caption', fileData.caption);
      if (fileData.tags?.length) formData.append('tags', JSON.stringify(fileData.tags));

      // Simulate file upload since we don't have actual upload endpoint
      // In real implementation, this would upload to your storage service
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now(),
            filename: `${Date.now()}_${fileData.file.name}`,
            originalName: fileData.file.name,
            mimeType: fileData.file.type,
            size: fileData.file.size,
            url: URL.createObjectURL(fileData.file),
            alt: fileData.alt,
            caption: fileData.caption,
            tags: fileData.tags
          });
        }, 1500);
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (fileList: File[]) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'video/mp4'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = fileList.filter(file => {
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    const filesWithPreview: FileWithPreview[] = validFiles.map(file => ({
      ...file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
      alt: '',
      caption: '',
      tags: []
    }));

    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const updateFileData = (id: string, data: Partial<FileWithPreview>) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, ...data } : file
    ));
  };

  const uploadFile = async (file: FileWithPreview) => {
    if (!file.id) return;

    updateFileData(file.id, { status: 'uploading', progress: 0 });

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        updateFileData(file.id!, { 
          progress: Math.min((files.find(f => f.id === file.id)?.progress || 0) + 10, 90)
        });
      }, 150);

      await uploadMutation.mutateAsync({
        file,
        alt: file.alt,
        caption: file.caption,
        tags: file.tags
      });

      clearInterval(progressInterval);
      updateFileData(file.id, { status: 'success', progress: 100 });
    } catch (error) {
      updateFileData(file.id, { status: 'error', progress: 0 });
    }
  };

  const uploadAllFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    for (const file of pendingFiles) {
      await uploadFile(file);
    }

    // Check if all files uploaded successfully
    const allSuccess = files.every(f => f.status === 'success');
    if (allSuccess) {
      toast({
        title: "All files uploaded",
        description: "All files have been uploaded successfully",
      });
      onUpload();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return 'fa-image';
    if (type.startsWith('video/')) return 'fa-video';
    return 'fa-file';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <CyberButton variant="outline" onClick={onClose}>
            <ArrowLeft size={20} className="mr-2" />
            Back
          </CyberButton>
          <div>
            <h1 className="font-tech text-3xl font-bold text-cyber-cyan">
              Upload Media Files
            </h1>
            <p className="text-gray-400">
              Add images and videos to your media library
            </p>
          </div>
        </div>
        {files.length > 0 && (
          <CyberButton onClick={uploadAllFiles} glow disabled={uploadMutation.isPending}>
            <Upload size={20} className="mr-2" />
            Upload All Files
          </CyberButton>
        )}
      </div>

      {/* Upload Area */}
      <GlassmorphismCard 
        className={`p-8 border-2 border-dashed transition-colors ${
          dragActive 
            ? 'border-cyber-cyan/50 bg-cyber-cyan/5' 
            : 'border-cyber-cyan/30 hover:border-cyber-cyan/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload size={64} className={`mx-auto mb-4 ${dragActive ? 'text-cyber-cyan' : 'text-gray-400'}`} />
          <h3 className="text-2xl font-semibold text-white mb-2">
            {dragActive ? 'Drop files here' : 'Drag & Drop Files Here'}
          </h3>
          <p className="text-gray-400 mb-6">Or click to browse files</p>
          
          <input
            type="file"
            multiple
            onChange={handleChange}
            accept="image/*,video/mp4"
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <CyberButton as="span" className="cursor-pointer">
              <Upload size={20} className="mr-2" />
              Browse Files
            </CyberButton>
          </label>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Supported formats: JPG, PNG, GIF, SVG, WebP, MP4</p>
            <p>Maximum file size: 10MB</p>
          </div>
        </div>
      </GlassmorphismCard>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-tech text-xl font-bold text-cyber-cyan">
            Files to Upload ({files.length})
          </h3>
          
          <div className="space-y-4">
            {files.map((file) => (
              <GlassmorphismCard key={file.id} className="p-6">
                <div className="flex items-start space-x-4">
                  {/* File Preview */}
                  <div className="w-20 h-20 bg-steel-gray/50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {file.type.startsWith('image/') ? (
                      <img 
                        src={file.preview} 
                        alt={file.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <i className={`fas ${getFileIcon(file.type)} text-2xl text-gray-400`}></i>
                    )}
                  </div>

                  {/* File Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white truncate">{file.name}</h4>
                      <div className="flex items-center space-x-2">
                        {file.status === 'success' && (
                          <CheckCircle size={20} className="text-volt-green" />
                        )}
                        {file.status === 'error' && (
                          <AlertCircle size={20} className="text-red-400" />
                        )}
                        <button
                          onClick={() => removeFile(file.id!)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.type}</span>
                      <span className={`capitalize ${
                        file.status === 'success' ? 'text-volt-green' :
                        file.status === 'error' ? 'text-red-400' :
                        file.status === 'uploading' ? 'text-cyber-cyan' :
                        'text-gray-400'
                      }`}>
                        {file.status || 'pending'}
                      </span>
                    </div>

                    {/* Upload Progress */}
                    {file.status === 'uploading' && (
                      <div className="mb-4">
                        <Progress value={file.progress || 0} className="w-full" />
                        <p className="text-xs text-gray-400 mt-1">
                          Uploading... {file.progress || 0}%
                        </p>
                      </div>
                    )}

                    {/* File Metadata */}
                    {file.status !== 'uploading' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor={`alt-${file.id}`} className="text-xs text-gray-400">
                            Alt Text
                          </Label>
                          <Input
                            id={`alt-${file.id}`}
                            value={file.alt || ''}
                            onChange={(e) => updateFileData(file.id!, { alt: e.target.value })}
                            placeholder="Describe the image"
                            className="cyber-input text-sm"
                            disabled={file.status === 'uploading'}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor={`caption-${file.id}`} className="text-xs text-gray-400">
                            Caption
                          </Label>
                          <Input
                            id={`caption-${file.id}`}
                            value={file.caption || ''}
                            onChange={(e) => updateFileData(file.id!, { caption: e.target.value })}
                            placeholder="Image caption"
                            className="cyber-input text-sm"
                            disabled={file.status === 'uploading'}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor={`tags-${file.id}`} className="text-xs text-gray-400">
                            Tags
                          </Label>
                          <Input
                            id={`tags-${file.id}`}
                            value={file.tags?.join(', ') || ''}
                            onChange={(e) => updateFileData(file.id!, { 
                              tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                            })}
                            placeholder="tag1, tag2, tag3"
                            className="cyber-input text-sm"
                            disabled={file.status === 'uploading'}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </GlassmorphismCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
