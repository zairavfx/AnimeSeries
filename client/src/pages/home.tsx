import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight, Zap, Server, Cloud, Globe, Code, MessageSquare, Headphones } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { CyberButton } from '@/components/ui/cyber-button';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { HolographicBorder } from '@/components/ui/holographic-border';
import { Particles } from '@/components/ui/particles';

export default function Home() {
  const { data: services = [] } = useQuery({
    queryKey: ['/api/services'],
  });

  const { data: publicSettings = {} } = useQuery({
    queryKey: ['/api/settings/public'],
  });

  const serviceIcons = {
    vps: Server,
    hosting: Cloud,
    domains: Globe,
    development: Code,
    'website-making': Code,
    'telegram-bot': MessageSquare,
    bots: MessageSquare,
    support: Headphones
  };

  const stats = [
    { value: publicSettings.client_count || "500+", label: "Happy Clients", color: "text-cyber-cyan" },
    { value: publicSettings.uptime_sla || "99.9%", label: "Uptime SLA", color: "text-neon-purple" },
    { value: publicSettings.projects_delivered || "1000+", label: "Projects Delivered", color: "text-volt-green" },
    { value: "24/7", label: "Tech Support", color: "text-sunset-orange" }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <Particles count={25} />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" 
          style={{
            backgroundImage: publicSettings.hero_background_url || "url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-rich-black/80 via-transparent to-charcoal/80" />
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 animate-fade-in">
          <h1 className="font-tech text-4xl md:text-6xl lg:text-7xl font-black mb-6 neon-text text-cyber-cyan">
            {publicSettings.hero_title || (
              <>
                Next-Gen{' '}
                <span className="gradient-text">
                  Tech Solutions
                </span>
              </>
            )}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {publicSettings.hero_subtitle || "Premium hosting, VPS solutions, and full-stack development powered by cutting-edge anime-inspired technology"}
          </p>
          
          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/vps">
              <CyberButton size="lg" glow>
                <Zap className="mr-2" size={20} />
                Explore Services
              </CyberButton>
            </Link>
            
            <Link href="/contact">
              <CyberButton variant="outline" size="lg">
                <ArrowRight className="mr-2" size={20} />
                Get Started
              </CyberButton>
            </Link>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <GlassmorphismCard 
                key={stat.label} 
                className="p-6 text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`text-3xl font-tech font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </GlassmorphismCard>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-tech text-3xl md:text-4xl font-bold mb-6 neon-text text-cyber-cyan">
              {publicSettings.services_title || "Our Tech Arsenal"}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {publicSettings.services_subtitle || "Comprehensive technology solutions designed for modern businesses and developers"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = serviceIcons[service.slug as keyof typeof serviceIcons] || Server;
              const colors = ['cyber-cyan', 'neon-purple', 'volt-green', 'sunset-orange', 'deep-blue'];
              const colorClass = `text-${colors[index % colors.length]}`;
              
              return (
                <HolographicBorder key={service.id} className="group hover:scale-105 transition-all duration-300">
                  <Link href={`/${service.slug}`}>
                    <GlassmorphismCard className="p-8 h-full cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyber-cyan to-deep-blue rounded-lg flex items-center justify-center mb-6 group-hover:animate-float">
                        <IconComponent size={24} className="text-white" />
                      </div>
                      <h3 className={`font-tech text-xl font-bold mb-4 ${colorClass}`}>
                        {service.name}
                      </h3>
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-volt-green font-semibold">
                          Starting ₹{service.startingPrice || 'Contact'}
                        </span>
                        <ArrowRight className={`${colorClass} group-hover:translate-x-2 transition-transform`} size={20} />
                      </div>
                    </GlassmorphismCard>
                  </Link>
                </HolographicBorder>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-tech text-3xl md:text-4xl font-bold mb-6 neon-text text-cyber-cyan">
              Why Choose OnAnimeSeries?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of web hosting and development with our cutting-edge infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "NVMe SSD storage with optimized configurations for maximum performance"
              },
              {
                icon: Server,
                title: "Enterprise Security",
                description: "Advanced firewall and DDoS protection with 24/7 monitoring"
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                description: "Expert technical support around the clock via multiple channels"
              },
              {
                icon: Globe,
                title: "Global Infrastructure",
                description: "Multiple data centers worldwide for optimal performance"
              }
            ].map((feature, index) => (
              <GlassmorphismCard key={feature.title} className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-cyber-cyan to-neon-purple rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </GlassmorphismCard>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
