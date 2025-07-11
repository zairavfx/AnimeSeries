import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { CyberButton } from '@/components/ui/cyber-button';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { HolographicBorder } from '@/components/ui/holographic-border';
import { Particles } from '@/components/ui/particles';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  serviceInterest: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      priority: 'normal'
    }
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return await apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await contactMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "contact@onanimeseries.com",
      description: "Send us an email anytime",
      link: "mailto:contact@onanimeseries.com"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+91 98765 43210",
      description: "Call us for immediate support",
      link: "tel:+919876543210"
    },
    {
      icon: MapPin,
      title: "Location",
      content: "Mumbai, Maharashtra",
      description: "India",
      link: null
    },
    {
      icon: Clock,
      title: "Support Hours",
      content: "24/7 Available",
      description: "Round the clock support",
      link: null
    }
  ];

  const services = [
    'VPS Hosting',
    'Web Hosting',
    'Domain Services',
    'Web Development',
    'Telegram Bots',
    'Technical Support',
    'Other'
  ];

  const socialLinks = [
    { name: 'Telegram', icon: '📱', url: 'https://t.me/onanimeseries' },
    { name: 'WhatsApp', icon: '💬', url: 'https://wa.me/919876543210' },
    { name: 'Discord', icon: '🎮', url: 'https://discord.gg/onanimeseries' },
    { name: 'Email', icon: '📧', url: 'mailto:contact@onanimeseries.com' }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <Particles count={20} />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-tech text-4xl md:text-5xl font-bold mb-6 neon-text text-cyber-cyan">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get in touch with our expert team for all your hosting and development needs. We're here to help 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div>
              <HolographicBorder>
                <GlassmorphismCard className="p-8">
                  <h2 className="font-tech text-2xl font-bold text-cyber-cyan mb-6">
                    Send us a Message
                  </h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          {...register('name')}
                          placeholder="Your Name *"
                          className="cyber-input"
                        />
                        {errors.name && (
                          <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <Input
                          {...register('phone')}
                          placeholder="Phone Number"
                          className="cyber-input"
                        />
                      </div>
                    </div>

                    <div>
                      <Input
                        {...register('email')}
                        type="email"
                        placeholder="Email Address *"
                        className="cyber-input"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Select onValueChange={(value) => setValue('serviceInterest', value)}>
                          <SelectTrigger className="cyber-input">
                            <SelectValue placeholder="Service Interest" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service} value={service}>
                                {service}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Select onValueChange={(value) => setValue('priority', value as any)}>
                          <SelectTrigger className="cyber-input">
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Input
                        {...register('subject')}
                        placeholder="Subject *"
                        className="cyber-input"
                      />
                      {errors.subject && (
                        <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>
                      )}
                    </div>

                    <div>
                      <Textarea
                        {...register('message')}
                        placeholder="Your Message *"
                        rows={6}
                        className="cyber-input resize-none"
                      />
                      {errors.message && (
                        <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    <CyberButton 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      glow
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2" size={20} />
                          Send Message
                        </>
                      )}
                    </CyberButton>
                  </form>
                </GlassmorphismCard>
              </HolographicBorder>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              
              {/* Contact Details */}
              <div className="grid grid-cols-1 gap-6">
                {contactInfo.map((info, index) => (
                  <GlassmorphismCard key={info.title} className="p-6 hover:scale-105 transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyber-cyan to-neon-purple rounded-lg flex items-center justify-center">
                        <info.icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-tech text-lg font-bold text-cyber-cyan mb-1">
                          {info.title}
                        </h3>
                        {info.link ? (
                          <a 
                            href={info.link} 
                            className="text-white hover:text-cyber-cyan transition-colors font-medium"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-white font-medium">{info.content}</p>
                        )}
                        <p className="text-gray-400 text-sm">{info.description}</p>
                      </div>
                    </div>
                  </GlassmorphismCard>
                ))}
              </div>

              {/* Quick Contact */}
              <HolographicBorder>
                <GlassmorphismCard className="p-8 text-center">
                  <h3 className="font-tech text-xl font-bold text-cyber-cyan mb-4">
                    Need Immediate Help?
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Connect with us instantly through your preferred platform
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {socialLinks.map((link, index) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 p-3 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 rounded-lg transition-colors border border-cyber-cyan/20 hover:border-cyber-cyan/40"
                      >
                        <span className="text-lg">{link.icon}</span>
                        <span className="text-sm font-medium">{link.name}</span>
                      </a>
                    ))}
                  </div>
                </GlassmorphismCard>
              </HolographicBorder>

              {/* FAQ Quick Links */}
              <GlassmorphismCard className="p-6">
                <h3 className="font-tech text-lg font-bold text-cyber-cyan mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3">
                  {[
                    'How do I get started with VPS hosting?',
                    'What payment methods do you accept?',
                    'Do you provide 24/7 technical support?',
                    'Can I upgrade my hosting plan later?'
                  ].map((question, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-300 hover:text-cyber-cyan transition-colors cursor-pointer">
                      <MessageSquare size={14} />
                      <span className="text-sm">{question}</span>
                    </div>
                  ))}
                </div>
              </GlassmorphismCard>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
