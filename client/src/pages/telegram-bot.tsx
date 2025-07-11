import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Bot, Zap, Code, Check, Settings, Users } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { CyberButton } from '@/components/ui/cyber-button';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { HolographicBorder } from '@/components/ui/holographic-border';
import { Particles } from '@/components/ui/particles';

export default function TelegramBot() {
  const { data: serviceData } = useQuery({
    queryKey: ['/api/services/telegram-bot'],
  });

  const service = serviceData || {};
  const plans = service.plans || [];

  const botTypes = [
    {
      title: "Business Automation Bots",
      description: "Automate customer support, lead generation, and business processes",
      icon: Settings,
      color: "from-cyber-cyan to-deep-blue",
      features: ["Auto Responses", "Lead Capture", "Order Processing", "Customer Support"]
    },
    {
      title: "Entertainment Bots",
      description: "Games, quizzes, music bots, and interactive entertainment features",
      icon: Users,
      color: "from-neon-purple to-volt-green",
      features: ["Games & Quizzes", "Music Integration", "Interactive Features", "User Engagement"]
    },
    {
      title: "Utility & Productivity Bots",
      description: "Weather, news, reminders, calculators, and productivity tools",
      icon: Zap,
      color: "from-sunset-orange to-cyber-cyan",
      features: ["Weather Updates", "News Feeds", "Reminders", "Calculations"]
    }
  ];

  const features = [
    {
      icon: Bot,
      title: "Custom Commands",
      description: "Create custom commands and responses tailored to your needs"
    },
    {
      icon: Code,
      title: "API Integration",
      description: "Connect with external APIs and services for enhanced functionality"
    },
    {
      icon: Users,
      title: "User Management",
      description: "Advanced user management with roles and permissions"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Live updates and notifications with webhook integration"
    }
  ];

  const setupSteps = [
    { step: 1, title: "Requirements Analysis", description: "Understanding your bot's purpose and features" },
    { step: 2, title: "Bot Creation", description: "Setting up the bot with Telegram BotFather" },
    { step: 3, title: "Development", description: "Coding the bot with all required features" },
    { step: 4, title: "Testing", description: "Thorough testing of all commands and features" },
    { step: 5, title: "Deployment", description: "Deploying the bot to production servers" },
    { step: 6, title: "Maintenance", description: "Ongoing support and feature updates" }
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
              {service.name || 'Telegram Bot Development'}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {service.description || 'Custom Telegram bot development with advanced automation and integration capabilities'}
            </p>
          </div>

          {/* Bot Demo Section */}
          <div className="mb-16">
            <HolographicBorder className="max-w-4xl mx-auto">
              <GlassmorphismCard className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-deep-blue to-cyber-cyan rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <MessageSquare size={32} className="text-white" />
                </div>
                <h3 className="font-tech text-2xl font-bold text-cyber-cyan mb-4">
                  Try Our Demo Bot
                </h3>
                <p className="text-gray-300 mb-6">
                  Experience the power of our Telegram bots with our interactive demo
                </p>
                <CyberButton size="lg" glow>
                  <MessageSquare className="mr-2" size={20} />
                  Start Demo Chat
                </CyberButton>
              </GlassmorphismCard>
            </HolographicBorder>
          </div>

          {/* Bot Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {botTypes.map((botType, index) => (
              <HolographicBorder key={botType.title} className="group hover:scale-105 transition-all duration-300">
                <GlassmorphismCard className="p-8 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${botType.color} rounded-lg flex items-center justify-center mb-6 group-hover:animate-float`}>
                    <botType.icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-tech text-xl font-bold mb-4 text-deep-blue">
                    {botType.title}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {botType.description}
                  </p>
                  <div className="space-y-2">
                    {botType.features.map((feature, idx) => (
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

          {/* Bot Development Plans */}
          {plans.length > 0 && (
            <div className="mb-20">
              <h2 className="font-tech text-3xl font-bold text-center mb-12 neon-text text-cyber-cyan">
                Bot Development Packages
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map((plan, index) => {
                  const isPopular = plan.isPopular;
                  
                  return (
                    <div key={plan.id} className={`relative ${isPopular ? 'transform scale-105' : ''}`}>
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-volt-green to-sunset-orange px-6 py-1 rounded-full text-rich-black font-semibold text-sm z-10">
                          {plan.ribbon || '🤖 RECOMMENDED'}
                        </div>
                      )}
                      
                      <HolographicBorder className="group hover:scale-105 transition-all duration-300">
                        <GlassmorphismCard className="p-8 h-full">
                          <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-deep-blue to-cyber-cyan rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:animate-float">
                              <Bot size={24} className="text-white" />
                            </div>
                            <h3 className="font-tech text-2xl font-bold text-deep-blue mb-2">
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
                            Order Bot
                          </CyberButton>
                        </GlassmorphismCard>
                      </HolographicBorder>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="mb-20">
            <h2 className="font-tech text-3xl font-bold text-center mb-12 neon-text text-cyber-cyan">
              Bot Development Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <GlassmorphismCard key={feature.title} className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-deep-blue to-cyber-cyan rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </GlassmorphismCard>
              ))}
            </div>
          </div>

          {/* Setup Process */}
          <div className="mt-20">
            <h2 className="font-tech text-3xl font-bold text-center mb-12 neon-text text-cyber-cyan">
              Bot Development Process
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {setupSteps.map((step, index) => (
                <GlassmorphismCard key={step.step} className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-deep-blue to-cyber-cyan rounded-full flex items-center justify-center mx-auto mb-4 font-tech font-bold text-white">
                    {step.step}
                  </div>
                  <h3 className="font-tech text-lg font-bold text-deep-blue mb-2">{step.title}</h3>
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
