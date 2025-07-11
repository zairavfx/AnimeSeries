import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, ArrowLeft, Eye, Globe } from 'lucide-react';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const pageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.object({
    sections: z.array(z.object({
      type: z.string(),
      content: z.any(),
    })).default([])
  }).default({ sections: [] }),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  ogImage: z.string().optional(),
  isPublished: z.boolean().default(false),
  layoutType: z.enum(['default', 'cards', 'pricing', 'grid', 'timeline']).default('default'),
  sortOrder: z.number().default(0),
});

type PageFormData = z.infer<typeof pageSchema>;

interface PageEditorProps {
  page?: any;
  onClose: () => void;
  onSave: () => void;
}

export function PageEditor({ page, onClose, onSave }: PageEditorProps) {
  const [activeTab, setActiveTab] = useState('content');
  const [contentSections, setContentSections] = useState(page?.content?.sections || []);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: page || {
      isPublished: false,
      layoutType: 'default',
      sortOrder: 0,
      content: { sections: [] }
    }
  });

  const savePageMutation = useMutation({
    mutationFn: async (data: PageFormData) => {
      const payload = {
        ...data,
        content: { sections: contentSections }
      };
      
      if (page) {
        return await apiRequest('PUT', `/api/admin/pages/${page.id}`, payload);
      } else {
        return await apiRequest('POST', '/api/admin/pages', payload);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Page ${page ? 'updated' : 'created'} successfully`,
      });
      onSave();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${page ? 'update' : 'create'} page`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PageFormData) => {
    savePageMutation.mutate(data);
  };

  const addContentSection = (type: string) => {
    const newSection = {
      id: Date.now().toString(),
      type,
      content: getDefaultContentForType(type)
    };
    setContentSections([...contentSections, newSection]);
  };

  const updateContentSection = (index: number, content: any) => {
    const updated = [...contentSections];
    updated[index] = { ...updated[index], content };
    setContentSections(updated);
  };

  const removeContentSection = (index: number) => {
    const updated = contentSections.filter((_, i) => i !== index);
    setContentSections(updated);
  };

  const getDefaultContentForType = (type: string) => {
    switch (type) {
      case 'hero':
        return {
          title: 'Hero Title',
          subtitle: 'Hero subtitle text',
          backgroundImage: '',
          ctaText: 'Get Started',
          ctaLink: '#'
        };
      case 'text':
        return {
          title: 'Section Title',
          content: 'Your content here...'
        };
      case 'features':
        return {
          title: 'Features',
          items: [
            { icon: 'fa-star', title: 'Feature 1', description: 'Feature description' }
          ]
        };
      case 'pricing':
        return {
          title: 'Pricing Plans',
          plans: []
        };
      default:
        return {};
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
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
              {page ? `Edit ${page.title}` : 'Create New Page'}
            </h1>
            <p className="text-gray-400">
              {page ? 'Update page content and settings' : 'Add a new page to your website'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {page && (
            <CyberButton variant="outline" onClick={() => window.open(`/${page.slug}`, '_blank')}>
              <Eye size={20} className="mr-2" />
              Preview
            </CyberButton>
          )}
          <CyberButton onClick={handleSubmit(onSubmit)} glow disabled={savePageMutation.isPending}>
            <Save size={20} className="mr-2" />
            {savePageMutation.isPending ? 'Saving...' : (page ? 'Update Page' : 'Create Page')}
          </CyberButton>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-steel-gray/30">
          <TabsTrigger value="content" className="data-[state=active]:bg-cyber-cyan/20 data-[state=active]:text-cyber-cyan">
            Content
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-cyber-cyan/20 data-[state=active]:text-cyber-cyan">
            Settings
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-cyber-cyan/20 data-[state=active]:text-cyber-cyan">
            SEO
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Content Sections */}
            <div className="lg:col-span-3 space-y-6">
              <GlassmorphismCard className="p-6">
                <h3 className="font-tech text-xl font-bold text-cyber-cyan mb-6">Page Content</h3>
                
                {contentSections.length === 0 ? (
                  <div className="text-center py-12">
                    <Globe size={48} className="mx-auto text-gray-500 mb-4" />
                    <h4 className="text-lg font-medium text-gray-400 mb-2">No content sections yet</h4>
                    <p className="text-gray-500 mb-4">Add your first content section to get started</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {contentSections.map((section, index) => (
                      <div key={section.id || index} className="border border-cyber-cyan/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-tech text-lg font-bold text-cyber-cyan capitalize">
                            {section.type} Section
                          </h4>
                          <CyberButton
                            size="sm"
                            variant="outline"
                            onClick={() => removeContentSection(index)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            Remove
                          </CyberButton>
                        </div>
                        
                        {section.type === 'hero' && (
                          <div className="space-y-4">
                            <Input
                              value={section.content.title || ''}
                              onChange={(e) => updateContentSection(index, { ...section.content, title: e.target.value })}
                              placeholder="Hero title"
                              className="cyber-input"
                            />
                            <Textarea
                              value={section.content.subtitle || ''}
                              onChange={(e) => updateContentSection(index, { ...section.content, subtitle: e.target.value })}
                              placeholder="Hero subtitle"
                              className="cyber-input"
                              rows={2}
                            />
                            <Input
                              value={section.content.backgroundImage || ''}
                              onChange={(e) => updateContentSection(index, { ...section.content, backgroundImage: e.target.value })}
                              placeholder="Background image URL"
                              className="cyber-input"
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                value={section.content.ctaText || ''}
                                onChange={(e) => updateContentSection(index, { ...section.content, ctaText: e.target.value })}
                                placeholder="CTA text"
                                className="cyber-input"
                              />
                              <Input
                                value={section.content.ctaLink || ''}
                                onChange={(e) => updateContentSection(index, { ...section.content, ctaLink: e.target.value })}
                                placeholder="CTA link"
                                className="cyber-input"
                              />
                            </div>
                          </div>
                        )}
                        
                        {section.type === 'text' && (
                          <div className="space-y-4">
                            <Input
                              value={section.content.title || ''}
                              onChange={(e) => updateContentSection(index, { ...section.content, title: e.target.value })}
                              placeholder="Section title"
                              className="cyber-input"
                            />
                            <Textarea
                              value={section.content.content || ''}
                              onChange={(e) => updateContentSection(index, { ...section.content, content: e.target.value })}
                              placeholder="Section content"
                              className="cyber-input"
                              rows={6}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </GlassmorphismCard>
            </div>

            {/* Content Tools */}
            <div className="space-y-6">
              <GlassmorphismCard className="p-6">
                <h3 className="font-tech text-lg font-bold text-cyber-cyan mb-4">Add Content</h3>
                <div className="space-y-2">
                  <CyberButton
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addContentSection('hero')}
                  >
                    <Globe size={16} className="mr-2" />
                    Hero Section
                  </CyberButton>
                  <CyberButton
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addContentSection('text')}
                  >
                    <i className="fas fa-paragraph mr-2"></i>
                    Text Content
                  </CyberButton>
                  <CyberButton
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addContentSection('features')}
                  >
                    <i className="fas fa-star mr-2"></i>
                    Features Grid
                  </CyberButton>
                  <CyberButton
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addContentSection('pricing')}
                  >
                    <i className="fas fa-dollar-sign mr-2"></i>
                    Pricing Table
                  </CyberButton>
                </div>
              </GlassmorphismCard>
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <GlassmorphismCard className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-cyber-cyan">Page Title *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    className="cyber-input"
                    placeholder="Page title"
                    onChange={(e) => {
                      const title = e.target.value;
                      setValue('title', title);
                      if (!page) {
                        setValue('slug', generateSlug(title));
                      }
                    }}
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-cyber-cyan">URL Slug *</Label>
                  <Input
                    id="slug"
                    {...register('slug')}
                    className="cyber-input"
                    placeholder="page-url-slug"
                  />
                  {errors.slug && (
                    <p className="text-red-400 text-sm">{errors.slug.message}</p>
                  )}
                  <p className="text-gray-500 text-xs">
                    Page will be accessible at: /{watch('slug')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="layoutType" className="text-cyber-cyan">Layout Type</Label>
                  <Select onValueChange={(value) => setValue('layoutType', value as any)}>
                    <SelectTrigger className="cyber-input">
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="cards">Cards Layout</SelectItem>
                      <SelectItem value="pricing">Pricing Layout</SelectItem>
                      <SelectItem value="grid">Grid Layout</SelectItem>
                      <SelectItem value="timeline">Timeline Layout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sortOrder" className="text-cyber-cyan">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    {...register('sortOrder', { valueAsNumber: true })}
                    className="cyber-input"
                    placeholder="0"
                  />
                  <p className="text-gray-500 text-xs">Lower numbers appear first in navigation</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublished"
                    checked={watch('isPublished')}
                    onCheckedChange={(checked) => setValue('isPublished', checked)}
                  />
                  <Label htmlFor="isPublished" className="text-white">
                    Publish page
                  </Label>
                </div>

                <div className="p-4 bg-cyber-cyan/10 border border-cyber-cyan/20 rounded-lg">
                  <h4 className="font-semibold text-cyber-cyan mb-2">Publishing Status</h4>
                  <p className="text-sm text-gray-300">
                    {watch('isPublished') 
                      ? 'This page will be visible to visitors'
                      : 'This page is saved as a draft and not visible to visitors'
                    }
                  </p>
                </div>
              </div>
            </div>
          </GlassmorphismCard>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo">
          <GlassmorphismCard className="p-8">
            <h3 className="font-tech text-xl font-bold text-cyber-cyan mb-6">SEO & Meta Tags</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="metaTitle" className="text-cyber-cyan">Meta Title</Label>
                <Input
                  id="metaTitle"
                  {...register('metaTitle')}
                  className="cyber-input"
                  placeholder="SEO title for search engines"
                />
                <p className="text-gray-500 text-xs">
                  Recommended length: 50-60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="text-cyber-cyan">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  {...register('metaDescription')}
                  className="cyber-input"
                  rows={3}
                  placeholder="Brief description for search engine results"
                />
                <p className="text-gray-500 text-xs">
                  Recommended length: 150-160 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords" className="text-cyber-cyan">Keywords</Label>
                <Input
                  id="metaKeywords"
                  {...register('metaKeywords')}
                  className="cyber-input"
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-gray-500 text-xs">
                  Separate keywords with commas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage" className="text-cyber-cyan">Open Graph Image</Label>
                <Input
                  id="ogImage"
                  {...register('ogImage')}
                  className="cyber-input"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-gray-500 text-xs">
                  Image displayed when page is shared on social media (1200x630px recommended)
                </p>
              </div>

              {/* SEO Preview */}
              <div className="mt-8 p-6 bg-steel-gray/30 rounded-lg">
                <h4 className="font-semibold text-cyber-cyan mb-4">Search Engine Preview</h4>
                <div className="space-y-2">
                  <div className="text-blue-400 text-lg font-medium">
                    {watch('metaTitle') || watch('title') || 'Page Title'}
                  </div>
                  <div className="text-green-600 text-sm">
                    yoursite.com/{watch('slug') || 'page-slug'}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {watch('metaDescription') || 'Meta description will appear here...'}
                  </div>
                </div>
              </div>
            </div>
          </GlassmorphismCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
