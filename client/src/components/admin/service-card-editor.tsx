import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Save, Plus, Trash2, ArrowLeft, DollarSign } from 'lucide-react';
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
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

const planSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  description: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  originalPrice: z.string().optional(),
  currency: z.string().default('INR'),
  billingCycle: z.enum(['monthly', 'yearly', 'one-time']).default('monthly'),
  features: z.array(z.string()).default([]),
  specifications: z.object({
    cpu: z.string().optional(),
    ram: z.string().optional(),
    storage: z.string().optional(),
    bandwidth: z.string().optional(),
    uptime: z.string().optional(),
    domains: z.string().optional(),
    email_accounts: z.string().optional(),
  }).optional(),
  isPopular: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
  ribbon: z.string().optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;
type PlanFormData = z.infer<typeof planSchema>;

interface ServiceCardEditorProps {
  service?: any;
  editingPlans?: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function ServiceCardEditor({ service, editingPlans = false, onClose, onSave }: ServiceCardEditorProps) {
  const [activeTab, setActiveTab] = useState(editingPlans ? 'plans' : 'service');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Service form
  const serviceForm = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service || {
      isActive: true,
      sortOrder: 0,
      color: '#00D9FF'
    }
  });

  // Plan form
  const planForm = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      currency: 'INR',
      billingCycle: 'monthly',
      isActive: true,
      isPopular: false,
      sortOrder: 0,
      features: [],
      specifications: {}
    }
  });

  const { fields: featureFields, append: addFeature, remove: removeFeature } = useFieldArray({
    control: planForm.control,
    name: 'features'
  });

  const { data: servicePlans = [] } = useQuery({
    queryKey: [`/api/admin/services/${service?.id}/plans`],
    enabled: !!service?.id && editingPlans
  });

  // Mutations
  const saveServiceMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      if (service) {
        return await apiRequest('PUT', `/api/admin/services/${service.id}`, data);
      } else {
        return await apiRequest('POST', '/api/admin/services', data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Service ${service ? 'updated' : 'created'} successfully`,
      });
      onSave();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${service ? 'update' : 'create'} service`,
        variant: "destructive",
      });
    },
  });

  const savePlanMutation = useMutation({
    mutationFn: async (data: PlanFormData & { serviceId: number }) => {
      if (selectedPlan) {
        return await apiRequest('PUT', `/api/admin/service-plans/${selectedPlan.id}`, data);
      } else {
        return await apiRequest('POST', '/api/admin/service-plans', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/services/${service?.id}/plans`] });
      toast({
        title: "Success",
        description: `Plan ${selectedPlan ? 'updated' : 'created'} successfully`,
      });
      setSelectedPlan(null);
      planForm.reset({
        currency: 'INR',
        billingCycle: 'monthly',
        isActive: true,
        isPopular: false,
        sortOrder: servicePlans.length,
        features: [],
        specifications: {}
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${selectedPlan ? 'update' : 'create'} plan`,
        variant: "destructive",
      });
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/service-plans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/services/${service?.id}/plans`] });
      toast({
        title: "Success",
        description: "Plan deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete plan",
        variant: "destructive",
      });
    },
  });

  const onServiceSubmit = (data: ServiceFormData) => {
    saveServiceMutation.mutate(data);
  };

  const onPlanSubmit = (data: PlanFormData) => {
    if (!service?.id) {
      toast({
        title: "Error",
        description: "Please save the service first before adding plans",
        variant: "destructive",
      });
      return;
    }
    savePlanMutation.mutate({ ...data, serviceId: service.id });
  };

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan);
    planForm.reset(plan);
  };

  const handleDeletePlan = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete the plan "${name}"?`)) {
      deletePlanMutation.mutate(id);
    }
  };

  const iconOptions = [
    { value: 'fa-server', label: 'Server' },
    { value: 'fa-cloud', label: 'Cloud' },
    { value: 'fa-globe', label: 'Globe' },
    { value: 'fa-code', label: 'Code' },
    { value: 'fa-robot', label: 'Robot' },
    { value: 'fa-headset', label: 'Headset' },
    { value: 'fa-shield-alt', label: 'Shield' },
    { value: 'fa-bolt', label: 'Bolt' }
  ];

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
              {service ? `Edit ${service.name}` : 'Create New Service'}
            </h1>
            <p className="text-gray-400">
              {editingPlans ? 'Manage service plans and pricing' : 'Configure service details and settings'}
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-steel-gray/30">
          <TabsTrigger value="service" className="data-[state=active]:bg-cyber-cyan/20 data-[state=active]:text-cyber-cyan">
            Service Details
          </TabsTrigger>
          <TabsTrigger 
            value="plans" 
            className="data-[state=active]:bg-cyber-cyan/20 data-[state=active]:text-cyber-cyan"
            disabled={!service?.id}
          >
            Plans & Pricing
          </TabsTrigger>
        </TabsList>

        {/* Service Details Tab */}
        <TabsContent value="service">
          <GlassmorphismCard className="p-8">
            <form onSubmit={serviceForm.handleSubmit(onServiceSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-cyber-cyan">Service Name *</Label>
                  <Input
                    id="name"
                    {...serviceForm.register('name')}
                    className="cyber-input"
                    placeholder="VPS Hosting"
                  />
                  {serviceForm.formState.errors.name && (
                    <p className="text-red-400 text-sm">{serviceForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-cyber-cyan">URL Slug *</Label>
                  <Input
                    id="slug"
                    {...serviceForm.register('slug')}
                    className="cyber-input"
                    placeholder="vps-hosting"
                  />
                  {serviceForm.formState.errors.slug && (
                    <p className="text-red-400 text-sm">{serviceForm.formState.errors.slug.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-cyber-cyan">Description</Label>
                <Textarea
                  id="description"
                  {...serviceForm.register('description')}
                  className="cyber-input"
                  rows={3}
                  placeholder="Brief description of your service..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="icon" className="text-cyber-cyan">Icon</Label>
                  <Select onValueChange={(value) => serviceForm.setValue('icon', value)}>
                    <SelectTrigger className="cyber-input">
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <i className={`fas ${option.value}`}></i>
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color" className="text-cyber-cyan">Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="color"
                      {...serviceForm.register('color')}
                      className="w-20 h-10 rounded-lg border border-cyber-cyan/20"
                    />
                    <Input
                      {...serviceForm.register('color')}
                      className="cyber-input flex-1"
                      placeholder="#00D9FF"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortOrder" className="text-cyber-cyan">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    {...serviceForm.register('sortOrder', { valueAsNumber: true })}
                    className="cyber-input"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={serviceForm.watch('isActive')}
                  onCheckedChange={(checked) => serviceForm.setValue('isActive', checked)}
                />
                <Label htmlFor="isActive" className="text-white">
                  Service is active
                </Label>
              </div>

              <div className="flex space-x-4 pt-6">
                <CyberButton type="submit" glow disabled={saveServiceMutation.isPending}>
                  <Save size={20} className="mr-2" />
                  {saveServiceMutation.isPending ? 'Saving...' : (service ? 'Update Service' : 'Create Service')}
                </CyberButton>
              </div>
            </form>
          </GlassmorphismCard>
        </TabsContent>

        {/* Plans & Pricing Tab */}
        <TabsContent value="plans">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Plan Form */}
            <GlassmorphismCard className="p-6">
              <h3 className="font-tech text-xl font-bold text-cyber-cyan mb-6">
                {selectedPlan ? 'Edit Plan' : 'Add New Plan'}
              </h3>

              <form onSubmit={planForm.handleSubmit(onPlanSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="planName" className="text-cyber-cyan">Plan Name *</Label>
                  <Input
                    id="planName"
                    {...planForm.register('name')}
                    className="cyber-input"
                    placeholder="VPS Pro"
                  />
                  {planForm.formState.errors.name && (
                    <p className="text-red-400 text-sm">{planForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="planDescription" className="text-cyber-cyan">Description</Label>
                  <Textarea
                    id="planDescription"
                    {...planForm.register('description')}
                    className="cyber-input"
                    rows={2}
                    placeholder="Plan description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-cyber-cyan">Price *</Label>
                    <Input
                      id="price"
                      {...planForm.register('price')}
                      className="cyber-input"
                      placeholder="999"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice" className="text-cyber-cyan">Original Price</Label>
                    <Input
                      id="originalPrice"
                      {...planForm.register('originalPrice')}
                      className="cyber-input"
                      placeholder="1499"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-cyber-cyan">Currency</Label>
                    <Select onValueChange={(value) => planForm.setValue('currency', value)}>
                      <SelectTrigger className="cyber-input">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingCycle" className="text-cyber-cyan">Billing Cycle</Label>
                    <Select onValueChange={(value) => planForm.setValue('billingCycle', value as any)}>
                      <SelectTrigger className="cyber-input">
                        <SelectValue placeholder="Select cycle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="one-time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-cyber-cyan">Features</Label>
                  <div className="space-y-2">
                    {featureFields.map((field, index) => (
                      <div key={field.id} className="flex space-x-2">
                        <Input
                          {...planForm.register(`features.${index}`)}
                          className="cyber-input"
                          placeholder="Feature description"
                        />
                        <CyberButton 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeFeature(index)}
                        >
                          <Trash2 size={14} />
                        </CyberButton>
                      </div>
                    ))}
                    <CyberButton 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => addFeature('')}
                    >
                      <Plus size={14} className="mr-2" />
                      Add Feature
                    </CyberButton>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ribbon" className="text-cyber-cyan">Ribbon Text</Label>
                  <Input
                    id="ribbon"
                    {...planForm.register('ribbon')}
                    className="cyber-input"
                    placeholder="🔥 POPULAR"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPopular"
                      checked={planForm.watch('isPopular')}
                      onCheckedChange={(checked) => planForm.setValue('isPopular', checked)}
                    />
                    <Label htmlFor="isPopular" className="text-white">Popular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="planIsActive"
                      checked={planForm.watch('isActive')}
                      onCheckedChange={(checked) => planForm.setValue('isActive', checked)}
                    />
                    <Label htmlFor="planIsActive" className="text-white">Active</Label>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <CyberButton type="submit" glow disabled={savePlanMutation.isPending}>
                    <Save size={16} className="mr-2" />
                    {savePlanMutation.isPending ? 'Saving...' : (selectedPlan ? 'Update Plan' : 'Add Plan')}
                  </CyberButton>
                  {selectedPlan && (
                    <CyberButton 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setSelectedPlan(null);
                        planForm.reset({
                          currency: 'INR',
                          billingCycle: 'monthly',
                          isActive: true,
                          isPopular: false,
                          sortOrder: servicePlans.length,
                          features: [],
                          specifications: {}
                        });
                      }}
                    >
                      Cancel
                    </CyberButton>
                  )}
                </div>
              </form>
            </GlassmorphismCard>

            {/* Existing Plans */}
            <div className="space-y-4">
              <h3 className="font-tech text-xl font-bold text-cyber-cyan">Existing Plans</h3>
              
              {servicePlans.length === 0 ? (
                <GlassmorphismCard className="p-8 text-center">
                  <DollarSign size={48} className="mx-auto text-gray-500 mb-4" />
                  <h4 className="text-lg font-medium text-gray-400 mb-2">No plans yet</h4>
                  <p className="text-gray-500">Create your first pricing plan to get started</p>
                </GlassmorphismCard>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {servicePlans.map((plan: any) => (
                    <GlassmorphismCard key={plan.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white flex items-center space-x-2">
                            <span>{plan.name}</span>
                            {plan.isPopular && (
                              <span className="px-2 py-1 bg-volt-green/20 text-volt-green text-xs rounded-full">
                                Popular
                              </span>
                            )}
                            {!plan.isActive && (
                              <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                                Inactive
                              </span>
                            )}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                            <span className="text-volt-green font-semibold">
                              ₹{plan.price}/{plan.billingCycle}
                            </span>
                            <span>{plan.features?.length || 0} features</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <CyberButton
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPlan(plan)}
                          >
                            Edit
                          </CyberButton>
                          <CyberButton
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePlan(plan.id, plan.name)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 size={14} />
                          </CyberButton>
                        </div>
                      </div>
                    </GlassmorphismCard>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
