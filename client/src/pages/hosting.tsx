import { useQuery } from '@tanstack/react-query';
import { Check, Cloud, Zap, Shield, Globe, Database, Mail } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { CyberButton } from '@/components/ui/cyber-button';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { HolographicBorder } from '@/components/ui/holographic-border';
import { Particles } from '@/components/ui/particles';

export default function Hosting() {
  const { data: serviceData } = useQuery({
    queryKey: ['/api/services/hosting'],
  });

  const service = serviceData || {};
  const plans = service.plans || [];

  const features = [
    {
      icon: Zap,
      title: "Blazing Fast",
      description: "SSD storage with WordPress optimization and advanced caching"
    },
    {
      icon: Shield,
      title: "Free SSL",
      description: "Let's Encrypt SSL certificates included with all hosting plans"
    },
    {
      icon: Database,
      title: "Daily Backups",
      description: "Automated daily backups with one-click restore functionality"
    },
    {
      icon: Mail,
      title: "Email Hosting",
      description: "Professional email accounts with anti-spam protection"
    }
  ];

  const hostingTypes = [
    {
      title: "Shared Hosting",
      description: "Perfect for personal websites and small businesses",
      icon: Globe,
      color: "from-cyber-cyan to-deep-blue"
    },
    {
      title: "WordPress Hosting",
      description: "Optimized hosting specifically designed for WordPress",
      icon: Cloud,
      color: "from-neon-purple to-volt-green"
    },
    {
      title: "Reseller Hosting",
      description: "White-label hosting solutions for agencies and developers",
      icon: Database,
      color: "from-sunset-orange to-cyber-cyan"
    }
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
              {service.name || 'Web Hosting Solutions'}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {service.description || 'Reliable and fast web hosting with WordPress optimization and free SSL certificates'}
            </p>
          </div>

          {/* Hosting Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {hostingTypes.map((type, index) => (
              <HolographicBorder key={type.title} className="group hover:scale-105 transition-all duration-300">
                <GlassmorphismCard className="p-8 text-center h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:animate-float`}>
                    <type.icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-tech text-xl font-bold mb-4 text-cyber-cyan">
                    {type.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {type.description}
                  </p>
                </GlassmorphismCard>
              </HolographicBorder>
            ))}
          </div>

          {/* Hosting Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => {
              const isPopular = plan.isPopular;
              
              return (
                <div key={plan.id} className={`relative ${isPopular ? 'transform scale-105' : ''}`}>
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-volt-green to-sunset-orange px-6 py-1 rounded-full text-rich-black font-semibold text-sm z-10">
                      {plan.ribbon || '⭐ BEST VALUE'}
                    </div>
                  )}
                  
                  <HolographicBorder className="group hover:scale-105 transition-all duration-300">
                    <GlassmorphismCard className="p-8 h-full">
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-neon-purple to-deep-blue rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:animate-float">
                          <Cloud size={24} className="text-white" />
                        </div>
                        <h3 className="font-tech text-2xl font-bold text-neon-purple mb-2">
                          {plan.name}
                        </h3>
                        <div className="text-3xl font-bold text-volt-green mb-2">
                          ₹{plan.price}
                          {plan.originalPrice && (
                            <span className="text-lg text-gray-400 line-through ml-2">
                              ₹{plan.originalPrice}
                            </span>
                          )}
                          <span className="text-lg text-gray-400">/{plan.billingCycle}</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          Billed {plan.billingCycle === 'monthly' ? 'Monthly' : plan.billingCycle}
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        {plan.specifications && (
                          <>
                            {plan.specifications.storage && (
                              <div className="flex items-center space-x-3">
                                <Database size={16} className="text-volt-green" />
                                <span>{plan.specifications.storage}</span>
                              </div>
                            )}
                            {plan.specifications.bandwidth && (
                              <div className="flex items-center space-x-3">
                                <Globe size={16} className="text-sunset-orange" />
                                <span>{plan.specifications.bandwidth}</span>
                              </div>
                            )}
                            {plan.specifications.domains && (
                              <div className="flex items-center space-x-3">
                                <Cloud size={16} className="text-cyber-cyan" />
                                <span>{plan.specifications.domains}</span>
                              </div>
                            )}
                            {plan.specifications.email_accounts && (
                              <div className="flex items-center space-x-3">
                                <Mail size={16} className="text-neon-purple" />
                                <span>{plan.specifications.email_accounts}</span>
                              </div>
                            )}
                          </>
                        )}

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
                        Choose Plan
                      </CyberButton>
                    </GlassmorphismCard>
                  </HolographicBorder>
                </div>
              );
            })}
          </div>

          {/* Features Section */}
          <div className="mt-20">
            <h2 className="font-tech text-3xl font-bold text-center mb-12 neon-text text-cyber-cyan">
              Premium Hosting Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <GlassmorphismCard key={feature.title} className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-volt-green rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
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
