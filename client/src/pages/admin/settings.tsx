import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Globe, Palette, Mail, Shield, Database } from 'lucide-react';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: siteSettings = [], isLoading } = useQuery({
    queryKey: ['/api/admin/settings'],
    onSuccess: (data) => {
      const settingsMap = data.reduce((acc: any, setting: any) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});
      setSettings(settingsMap);
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value, type = 'string', isPublic = false }: any) => {
      return await apiRequest('PUT', '/api/admin/settings', {
        key,
        value,
        type,
        isPublic
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/settings/public'] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const updateSetting = (key: string, value: any, type = 'string', isPublic = false) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    updateSettingMutation.mutate({ key, value, type, isPublic });
  };

  const settingValue = (key: string, defaultValue: any = '') => {
    return settings[key] ?? defaultValue;
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-cyan mx-auto"></div>
        <p className="text-gray-400 mt-4">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-tech text-3xl font-bold text-cyber-cyan mb-2">
          Global Settings
        </h1>
        <p className="text-gray-400">
          Configure global website settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-steel-gray/30">
          <TabsTrigger value="general" className="data-[state=active]:bg-cyber-cyan/20 data-[state=active]:text-cyber-cyan">
            <Globe size={16} className="mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-cyber-cyan/20 data-[state=active]:text-cyber-cyan">
            <Palette size={16} className="mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-cyber-cyan/20 data-[state=active]:text-cyber-cyan">
            <Mail size={16} className="mr-2" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-cyber-cyan/20 data-[state=active]:text-cyber-cyan">
            <Shield size={16} className="mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-cyber-cyan/20 data-[state=active]:text-cyber-cyan">
            <Database size={16} className="mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassmorphismCard className="p-6">
              <h3 className="font-tech text-xl font-bold text-cyber-cyan mb-6">Site Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="site_name" className="text-white mb-2 block">Site Name</Label>
                  <Input
                    id="site_name"
                    value={settingValue('site_name', 'OnAnimeSeries')}
                    onChange={(e) => updateSetting('site_name', e.target.value, 'string', true)}
                    className="cyber-input"
                    placeholder="Your site name"
                  />
                </div>

                <div>
                  <Label htmlFor="site_description" className="text-white mb-2 block">Site Description</Label>
                  <Textarea
                    id="site_description"
                    value={settingValue('site_description')}
                    onChange={(e) => updateSetting('site_description', e.target.value, 'string', true)}
                    className="cyber-input"
                    rows={3}
                    placeholder="Brief description of your website"
                  />
                </div>

                <div>
                  <Label htmlFor="site_keywords" className="text-white mb-2 block">SEO Keywords</Label>
                  <Input
                    id="site_keywords"
                    value={settingValue('site_keywords')}
                    onChange={(e) => updateSetting('site_keywords', e.target.value, 'string', true)}
                    className="cyber-input"
                    placeholder="hosting, vps, web development"
                  />
                </div>

                <div>
                  <Label htmlFor="analytics_id" className="text-white mb-2 block">Google Analytics ID</Label>
                  <Input
                    id="analytics_id"
                    value={settingValue('analytics_id')}
                    onChange={(e) => updateSetting('analytics_id', e.target.value)}
                    className="cyber-input"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
              </div>
            </GlassmorphismCard>

            <GlassmorphismCard className="p-6">
              <h3 className="font-tech text-xl font-bold text-cyber-cyan mb-6">Business Statistics</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="client_count" className="text-white mb-2 block">Total Clients</Label>
                  <Input
                    id="client_count"
                    value={settingValue('client_count', '500+')}
                    onChange={(e) => updateSetting('client_count', e.target.value, 'string', true)}
                    className="cyber-input"
                    placeholder="500+"
                  />
                </div>

                <div>
                  <Label htmlFor="uptime_sla" className="text-white mb-2 block">Uptime SLA</Label>
                  <Input
                    id="uptime_sla"
                    value={settingValue('uptime_sla', '99.9%')}
                    onChange={(e) => updateSetting('uptime_sla', e.target.value, 'string', true)}
                    className="cyber-input"
                    placeholder="99.9%"
                  />
                </div>

                <div>
                  <Label htmlFor="projects_delivered" className="text-white mb-2 block">Projects Delivered</Label>
                  <Input
                    id="projects_delivered"
                    value={settingValue('projects_delivered', '1000+')}
                    onChange={(e) => updateSetting('projects_delivered', e.target.value, 'string', true)}
                    className="cyber-input"
                    placeholder="1000+"
                  />
                </div>

                <div>
                  <Label htmlFor="years_experience" className="text-white mb-2 block">Years of Experience</Label>
                  <Input
                    id="years_experience"
                    value={settingValue('years_experience', '5+')}
                    onChange={(e) => updateSetting('years_experience', e.target.value, 'string', true)}
                    className="cyber-input"
                    placeholder="5+"
                  />
                </div>
              </div>
            </GlassmorphismCard>
          </div>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassmorphismCard className="p-6">
              <h3 className="font-tech text-xl font-bold text-cyber-cyan mb-6">Theme & Branding</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="logo_url" className="text-white mb-2 block">Logo URL</Label>
                  <Input
                    id="logo_url"
                    value={settingValue('logo_url')}
                    onChange={(e) => updateSetting('logo_url', e.target.value, 'string', true)}
                    className="cyber-input"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <Label htmlFor="favicon_url" className="text-white mb-2 block">Favicon URL</Label>
                  <Input
                    id="favicon_url"
                    value={settingValue('favicon_url')}
                    onChange={(e) => updateSetting('favicon_url', e.target.value, 'string', true)}
                    className="cyber-input"
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>

                <div>
                  <Label htmlFor="primary_color" className="text-white mb-2 block">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={settingValue('primary_color', '#00D9FF')}
                      onChange={(e) => updateSetting('primary_color', e.target.value, 'string', true)}
                      className="w-20 h-10 rounded-lg border border-cyber-cyan/20"
                    />
                    <Input
                      value={settingValue('primary_color', '#00D9FF')}
                      onChange={(e) => updateSetting('primary_color', e.target.value, 'string', true)}
                      className="cyber-input flex-1"
                      placeholder="#00D9FF"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondary_color" className="text-white mb-2 block">Secondary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={settingValue('secondary_color', '#9D4EDD')}
                      onChange={(e) => updateSetting('secondary_color', e.target.value, 'string', true)}
                      className="w-20 h-10 rounded-lg border border-cyber-cyan/20"
                    />
                    <Input
                      value={settingValue('secondary_color', '#9D4EDD')}
                      onChange={(e) => updateSetting('secondary_color', e.target.value, 'string', true)}
                      className="cyber-input flex-1"
                      placeholder="#9D4EDD"
                    />
                  </div>
                </div>
              </div>
            </GlassmorphismCard>

            <GlassmorphismCard className="p-6">
              <h3 className="font-tech text-xl font-bold text-cyber-cyan mb-6">Hero Section</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hero_title" className="text-white mb-2 block">Hero Title</Label>
                  <Input
                    id="hero_title"
                    value={settingValue('hero_title')}
                    onChange={(e) => updateSetting('hero_title', e.target.value, 'string', true)}
                    className="cyber-input"
                    placeholder="Next-Gen Tech Solutions"
                  />
                </div>

                <div>
                  <Label htmlFor="hero_subtitle" className="text-white mb-2 block">Hero Subtitle</Label>
                  <Textarea
                    id="hero_subtitle"
                    value={settingValue('hero_subtitle')}
                    onChange={(e) => updateSetting('hero_subtitle', e.target.value, 'string', true)}
                    className="cyber-input"
                    rows={3}
                    placeholder="Premium hosting and development services..."
                  />
                </div>

                <div>
                  <Label htmlFor="hero_background_url" className="text-white mb-2 block">Hero Background URL</Label>
                  <Input
                    id="hero_background_url"
                    value={settingValue('hero_background_url')}
                    onChange={(e) => updateSetting('hero_background_url', e.target.value, 'string', true)}
                    className="cyber-input"
                    placeholder="https://example.com/hero-bg.jpg"
                  />
                </div>
              </div>
            </GlassmorphismCard>
          </div>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassmorphismCard className="p-6">
              <h3 className="font-tech text-xl font-bold text-cyber-cyan mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company_email" className="text-white mb-2 block">Company Email</Label>
                  <Input
                    id="company_email"
                    type="email"
                    value={settingValue('company_email')}
                    onChange={(e) => updateSetting('company_email', e.target.value, 'string', true)}
                    className="cyber-input"
                    placeholder="contact@onanimeseries.com"
                  />
                </div>

                <div>
                  <Label htmlFor="company_phone" className="text-white mb-2 block">Company Phone</Label>
                  <Input
                    id="company_phone"
                    value={settingValue('company_phone')}
                    onChange={(e) => updateSetting('company_phone', e.target.value, 'string', true)}
                    className="cyber-input"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <Label htmlFor="company_address" className="text-white mb-2 block">Company Address</Label>
                  <Textarea
                    id="company_address"
                    value={settingValue('company_address')}
                    onChange={(e) => updateSetting('company_address', e.target.value, 'string', true)}
                    className="cyber-input"
                    rows={3}
                    placeholder="Mumbai, Maharashtra, India"
                  />
                </div>

                <div>
                  <Label htmlFor="support_hours" className="text-white mb-2 block">Support Hours</Label>
                  <Input
                    id="support_hours"
                    value={settingValue('support_hours', '24/7')}
                    onChange={(e) => updateSetting('support_hours', e.target.value, 'string', true)}
                    className="cyber-input"
                    placeholder="24/7"
                  />
                </div>
              </div>
            </GlassmorphismCard>

            <GlassmorphismCard className="p-6">
              <h3 className="font-tech text-xl font-bold text-cyber-cyan mb-6">Social Media</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="facebook_url" className="text-white mb-2 block">Facebook URL</Label>
                  <Input
                    id="facebook_url"
                    value={settingValue('facebook_url')}
                    onChange={(e) => updateSetting('facebook_url', e.target.value, 'string', true)}
                    className="cyber-input"
                    placeholder="https://facebook.com/onanimeseries"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter_url" className="text-white mb-2 block">Twitter URL</Label>
                  <Input
                    id="twitter_url"
                    value={settingValue('twitter_url')}
                    onChange={(e) => updateSetting('twitter_url', e.target.value, 'string', true)}
                    className="cyber-input"
                    placeholder="https://twitter.com/onanimeseries"
                  />
                </div>

                <div>
                  <Label htmlFor="telegram_url" className="text-white mb-2 block">Telegram URL</Label>
                  <Input
                    id="telegram_url"
                    value={settingValue('telegram_url')}
                    onChange={(e) => updateSetting('telegram_url', e.target.value, 'string', true)}
                    className="cyber-input"
                    placeholder="https://t.me/onanimeseries"
                  />
                </div>

                <div>
                  <Label htmlFor="discord_url" className="text-white mb-2 block">Discord URL</Label>
                  <Input
                    id="discord_url"
                    value={settingValue('discord_url')}
                    onChange={(e) => updateSetting('discord_url', e.target.value, 'string', true)}
                    className="cyber-input"
                    placeholder="https://discord.gg/onanimeseries"
                  />
                </div>
              </div>
            </GlassmorphismCard>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <GlassmorphismCard className="p-6">
            <h3 className="font-tech text-xl font-bold text-cyber-cyan mb-6">Security & Privacy</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Maintenance Mode</Label>
                  <p className="text-gray-400 text-sm">Enable to show maintenance page to visitors</p>
                </div>
                <Switch
                  checked={settingValue('maintenance_mode', false)}
                  onCheckedChange={(checked) => updateSetting('maintenance_mode', checked, 'boolean')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Registration Enabled</Label>
                  <p className="text-gray-400 text-sm">Allow new user registrations</p>
                </div>
                <Switch
                  checked={settingValue('registration_enabled', true)}
                  onCheckedChange={(checked) => updateSetting('registration_enabled', checked, 'boolean')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Google Analytics</Label>
                  <p className="text-gray-400 text-sm">Enable Google Analytics tracking</p>
                </div>
                <Switch
                  checked={settingValue('analytics_enabled', false)}
                  onCheckedChange={(checked) => updateSetting('analytics_enabled', checked, 'boolean', true)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Cookie Consent</Label>
                  <p className="text-gray-400 text-sm">Show cookie consent banner</p>
                </div>
                <Switch
                  checked={settingValue('cookie_consent', true)}
                  onCheckedChange={(checked) => updateSetting('cookie_consent', checked, 'boolean', true)}
                />
              </div>
            </div>
          </GlassmorphismCard>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassmorphismCard className="p-6">
              <h3 className="font-tech text-xl font-bold text-cyber-cyan mb-6">Email Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="smtp_host" className="text-white mb-2 block">SMTP Host</Label>
                  <Input
                    id="smtp_host"
                    value={settingValue('smtp_host')}
                    onChange={(e) => updateSetting('smtp_host', e.target.value)}
                    className="cyber-input"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <Label htmlFor="smtp_port" className="text-white mb-2 block">SMTP Port</Label>
                  <Input
                    id="smtp_port"
                    type="number"
                    value={settingValue('smtp_port')}
                    onChange={(e) => updateSetting('smtp_port', parseInt(e.target.value), 'number')}
                    className="cyber-input"
                    placeholder="587"
                  />
                </div>

                <div>
                  <Label htmlFor="smtp_username" className="text-white mb-2 block">SMTP Username</Label>
                  <Input
                    id="smtp_username"
                    value={settingValue('smtp_username')}
                    onChange={(e) => updateSetting('smtp_username', e.target.value)}
                    className="cyber-input"
                    placeholder="your-email@gmail.com"
                  />
                </div>

                <div>
                  <Label htmlFor="smtp_password" className="text-white mb-2 block">SMTP Password</Label>
                  <Input
                    id="smtp_password"
                    type="password"
                    value={settingValue('smtp_password')}
                    onChange={(e) => updateSetting('smtp_password', e.target.value)}
                    className="cyber-input"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>
            </GlassmorphismCard>

            <GlassmorphismCard className="p-6">
              <h3 className="font-tech text-xl font-bold text-cyber-cyan mb-6">Custom Code</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="custom_css" className="text-white mb-2 block">Custom CSS</Label>
                  <Textarea
                    id="custom_css"
                    value={settingValue('custom_css')}
                    onChange={(e) => updateSetting('custom_css', e.target.value)}
                    className="cyber-input font-mono"
                    rows={6}
                    placeholder="/* Add your custom CSS here */"
                  />
                </div>

                <div>
                  <Label htmlFor="custom_js" className="text-white mb-2 block">Custom JavaScript</Label>
                  <Textarea
                    id="custom_js"
                    value={settingValue('custom_js')}
                    onChange={(e) => updateSetting('custom_js', e.target.value)}
                    className="cyber-input font-mono"
                    rows={6}
                    placeholder="// Add your custom JavaScript here"
                  />
                </div>
              </div>
            </GlassmorphismCard>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <CyberButton glow disabled={updateSettingMutation.isPending}>
          <Save size={20} className="mr-2" />
          {updateSettingMutation.isPending ? 'Saving...' : 'Settings Auto-Saved'}
        </CyberButton>
      </div>
    </div>
  );
}
