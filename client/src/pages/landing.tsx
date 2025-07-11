import { Link } from 'wouter';
import { ArrowRight, Zap, Shield, Cpu, Globe } from 'lucide-react';
import { CyberButton } from '@/components/ui/cyber-button';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { HolographicBorder } from '@/components/ui/holographic-border';
import { Particles } from '@/components/ui/particles';

export default function Landing() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "High-performance infrastructure with NVMe SSD storage and optimized configurations."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Advanced firewall protection, DDoS mitigation, and 24/7 security monitoring."
    },
    {
      icon: Cpu,
      title: "Scalable Resources",
      description: "Flexible scaling options with guaranteed resources and 99.9% uptime SLA."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Multiple data center locations for optimal performance worldwide."
    }
  ];

  const stats = [
    { value: "500+", label: "Happy Clients", color: "text-cyber-cyan" },
    { value: "99.9%", label: "Uptime SLA", color: "text-neon-purple" },
    { value: "1000+", label: "Projects Delivered", color: "text-volt-green" },
    { value: "24/7", label: "Tech Support", color: "text-sunset-orange" }
  ];

  return (
    <div className="min-h-screen relative">
      <Particles count={30} />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-rich-black/80 via-transparent to-charcoal/80" />
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 animate-fade-in">
          <h1 className="font-tech text-4xl md:text-6xl lg:text-7xl font-black mb-6 neon-text text-cyber-cyan">
            Next-Gen{' '}
            <span className="gradient-text">
              Tech Solutions
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Premium hosting, VPS solutions, and full-stack development powered by cutting-edge anime-inspired technology
          </p>
          
          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a href="/api/login">
              <CyberButton size="lg" glow>
                <Zap className="mr-2" size={20} />
                Get Started
              </CyberButton>
            </a>
            
            <a href="/api/login">
              <CyberButton variant="outline" size="lg">
                <ArrowRight className="mr-2" size={20} />
                Explore Services
              </CyberButton>
            </a>
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

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-tech text-3xl md:text-4xl font-bold mb-6 neon-text text-cyber-cyan">
              Why Choose OnAnimeSeries?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We deliver cutting-edge technology solutions with enterprise-grade reliability and 24/7 support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <HolographicBorder key={feature.title} className="group hover:scale-105 transition-all duration-300">
                <GlassmorphismCard className="p-8 h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyber-cyan to-neon-purple rounded-lg flex items-center justify-center mb-6 group-hover:animate-float">
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-tech text-xl font-bold mb-4 text-cyber-cyan">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </GlassmorphismCard>
              </HolographicBorder>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HolographicBorder>
            <GlassmorphismCard className="p-12">
              <h2 className="font-tech text-3xl md:text-4xl font-bold mb-6 neon-text text-cyber-cyan">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers and experience the future of web hosting and development
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/api/login">
                  <CyberButton size="lg" glow>
                    <Zap className="mr-2" size={20} />
                    Start Your Journey
                  </CyberButton>
                </a>
                
                <a href="/api/login">
                  <CyberButton variant="outline" size="lg">
                    Learn More
                  </CyberButton>
                </a>
              </div>
            </GlassmorphismCard>
          </HolographicBorder>
        </div>
      </section>
    </div>
  );
}
