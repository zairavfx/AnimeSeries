import { useQuery } from '@tanstack/react-query';
import { Code, Smartphone, Globe, Zap, Check, ArrowRight } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { CyberButton } from '@/components/ui/cyber-button';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { HolographicBorder } from '@/components/ui/holographic-border';
import { Particles } from '@/components/ui/particles';

export default function WebsiteMaking() {
  const { data: serviceData } = useQuery({
    queryKey: ['/api/services/website-making'],
  });

  const service = serviceData || {};
  const plans = service.plans || [];

  const techStack = [
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' }
  ];

  const services = [
    {
      title: "Custom Web Development",
      description: "Tailor-made websites built from scratch with modern technologies",
      icon: Code,
      color: "from-cyber-cyan to-deep-blue",
      features: ["Custom Design", "Responsive Layout", "SEO Optimized", "Fast Loading"]
    },
    {
      title: "E-commerce Solutions",
      description: "Complete online stores with payment integration and inventory management",
      icon: Globe,
      color: "from-neon-purple to-volt-green",
      features: ["Payment Gateway", "Inventory Management", "Order Tracking", "Admin Panel"]
    },
    {
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android",
      icon: Smartphone,
      color: "from-sunset-orange to-cyber-cyan",
      features: ["Cross-platform", "Native Performance", "App Store Ready", "Push Notifications"]
    }
  ];

  const process = [
    { step: 1, title: "Discovery", description: "Understanding your requirements and goals" },
    { step: 2, title: "Design", description: "Creating wireframes and visual designs" },
    { step: 3, title: "Development", description: "Building your website with modern technologies" },
    { step: 4, title: "Testing", description: "Thorough testing across devices and browsers" },
    { step: 5, title: "Launch", description: "Deploying your website and going live" },
    { step: 6, title: "Support", description: "Ongoing maintenance and support" }
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
              {service.name || 'Full-Stack Web Development'}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {service.description || 'Custom web applications built with modern frameworks, responsive design, and cutting-edge technology'}
            </p>
          </div>

          {/* Service Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.map((serviceItem, index) => (
              <HolographicBorder key={serviceItem.title} className="group hover:scale-105 transition-all duration-300">
                <GlassmorphismCard className="p-8 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${serviceItem.color} rounded-lg flex items-center justify-center mb-6 group-hover:animate-float`}>
                    <serviceItem.icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-tech text-xl font-bold mb-4 text-cyber-cyan">
                    {serviceItem.title}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {serviceItem.description}
                  </p>
                  <div className="space-y-2">
                    {serviceItem.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Check size={14} className="text-volt-green" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </GlassmorphismCard>
              </HolographicBorder>
            ))}
          </div>

          {/* Development Plans */}
          {plans.length > 0 && (
            <div className="mb-20">
              <h2 className="font-tech text-3xl font-bold text-center mb-12 neon-text text-cyber-cyan">
                Development Packages
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map((plan, index) => {
                  const isPopular = plan.isPopular;
                  
                  return (
                    <div key={plan.id} className={`relative ${isPopular ? 'transform scale-105' : ''}`}>
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-volt-green to-sunset-orange px-6 py-1 rounded-full text-rich-black font-semibold text-sm z-10">
                          {plan.ribbon || '⭐ MOST POPULAR'}
                        </div>
                      )}
                      
                      <HolographicBorder className="group hover:scale-105 transition-all duration-300">
                        <GlassmorphismCard className="p-8 h-full">
                          <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-sunset-orange to-neon-purple rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:animate-float">
                              <Code size={24} className="text-white" />
                            </div>
                            <h3 className="font-tech text-2xl font-bold text-sunset-orange mb-2">
                              {plan.name}
                            </h3>
                            <div className="text-3xl font-bold text-volt-green mb-2">
                              ₹{plan.price}
                              {plan.originalPrice && (
                                <span className="text-lg text-gray-400 line-through ml-2">
                                  ₹{plan.originalPrice}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-400">
                              {plan.billingCycle === 'one-time' ? 'One-time Payment' : `Per ${plan.billingCycle}`}
                            </div>
                          </div>

                          <div className="space-y-4 mb-8">
                            {plan.features && plan.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center space-x-3">
                                <Check size={16} className="text-volt-green" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>

                          <CyberButton 
                            className="w-full" 
                            variant={isPopular ? 'secondary' : 'primary'}
                            glow={isPopular}
                          >
                            Get Started
                          </CyberButton>
                        </GlassmorphismCard>
                      </HolographicBorder>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          <div className="mb-20">
            <h2 className="font-tech text-3xl font-bold text-center mb-12 neon-text text-cyber-cyan">
              Technologies We Use
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {techStack.map((tech, index) => (
                <GlassmorphismCard key={tech.name} className="p-6 text-center hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-4">
                    <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">{tech.name}</h3>
                </GlassmorphismCard>
              ))}
            </div>
          </div>

          {/* Development Process */}
          <div className="mt-20">
            <h2 className="font-tech text-3xl font-bold text-center mb-12 neon-text text-cyber-cyan">
              Our Development Process
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {process.map((step, index) => (
                <GlassmorphismCard key={step.step} className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyber-cyan to-neon-purple rounded-full flex items-center justify-center mx-auto mb-4 font-tech font-bold text-white">
                    {step.step}
                  </div>
                  <h3 className="font-tech text-lg font-bold text-cyber-cyan mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </GlassmorphismCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
