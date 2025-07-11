import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Globe, Shield, Zap, Check, ArrowRight } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { CyberButton } from '@/components/ui/cyber-button';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';
import { HolographicBorder } from '@/components/ui/holographic-border';
import { Particles } from '@/components/ui/particles';
import { Input } from '@/components/ui/input';

export default function Domains() {
  const [searchDomain, setSearchDomain] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const { data: serviceData } = useQuery({
    queryKey: ['/api/services/domains'],
  });

  const service = serviceData || {};

  const popularTlds = [
    { tld: '.com', price: '₹999', description: 'Most popular choice for businesses' },
    { tld: '.in', price: '₹599', description: 'Perfect for Indian businesses' },
    { tld: '.org', price: '₹899', description: 'Ideal for organizations' },
    { tld: '.net', price: '₹1,199', description: 'Great for tech companies' },
    { tld: '.co', price: '₹2,499', description: 'Modern alternative to .com' },
    { tld: '.io', price: '₹4,999', description: 'Popular among startups' }
  ];

  const features = [
    {
      icon: Globe,
      title: "Easy Management",
      description: "User-friendly control panel for all domain settings and DNS management"
    },
    {
      icon: Shield,
      title: "WHOIS Privacy",
      description: "Free domain privacy protection to keep your personal information secure"
    },
    {
      icon: Zap,
      title: "Free DNS",
      description: "Advanced DNS management with A, CNAME, MX, and TXT record support"
    },
    {
      icon: Check,
      title: "Easy Transfer",
      description: "Hassle-free domain transfers with our expert support team assistance"
    }
  ];

  const services = [
    {
      title: "Domain Registration",
      description: "Register new domains with competitive pricing and instant activation",
      icon: Globe,
      color: "from-cyber-cyan to-deep-blue"
    },
    {
      title: "Domain Transfer",
      description: "Transfer your existing domains to us with free 1-year extension",
      icon: ArrowRight,
      color: "from-neon-purple to-volt-green"
    },
    {
      title: "Domain Parking",
      description: "Park your unused domains and monetize them with our parking service",
      icon: Shield,
      color: "from-sunset-orange to-cyber-cyan"
    }
  ];

  const handleSearchDomain = () => {
    if (!searchDomain.trim()) return;
    
    // Simulate domain search
    const suggestions = [
      `${searchDomain}.com`,
      `${searchDomain}.in`,
      `${searchDomain}.org`,
      `${searchDomain}.net`,
      `${searchDomain}.co`,
      `${searchDomain}.io`
    ];
    setSearchResults(suggestions);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <Particles count={20} />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-tech text-4xl md:text-5xl font-bold mb-6 neon-text text-cyber-cyan">
              {service.name || 'Domain Services'}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              {service.description || 'Register, transfer, and manage domains with competitive pricing and free WHOIS privacy protection'}
            </p>

            {/* Domain Search */}
            <HolographicBorder className="max-w-2xl mx-auto">
              <GlassmorphismCard className="p-8">
                <h3 className="font-tech text-xl font-bold text-cyber-cyan mb-6">
                  Find Your Perfect Domain
                </h3>
                <div className="flex gap-4">
                  <Input
                    type="text"
                    placeholder="Enter domain name..."
                    value={searchDomain}
                    onChange={(e) => setSearchDomain(e.target.value)}
                    className="cyber-input flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchDomain()}
                  />
                  <CyberButton onClick={handleSearchDomain}>
                    <Search size={20} className="mr-2" />
                    Search
                  </CyberButton>
                </div>

                {searchResults.length > 0 && (
                  <div className="mt-6 space-y-2">
                    {searchResults.map((domain, index) => (
                      <div key={domain} className="flex items-center justify-between p-3 bg-steel-gray/30 rounded-lg">
                        <span className="font-medium">{domain}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-volt-green font-semibold">
                            {popularTlds.find(tld => domain.endsWith(tld.tld))?.price || '₹999'}
                          </span>
                          <CyberButton size="sm">Add to Cart</CyberButton>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassmorphismCard>
            </HolographicBorder>
          </div>

          {/* Domain Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.map((serviceItem, index) => (
              <HolographicBorder key={serviceItem.title} className="group hover:scale-105 transition-all duration-300">
                <GlassmorphismCard className="p-8 text-center h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${serviceItem.color} rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:animate-float`}>
                    <serviceItem.icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-tech text-xl font-bold mb-4 text-cyber-cyan">
                    {serviceItem.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {serviceItem.description}
                  </p>
                </GlassmorphismCard>
              </HolographicBorder>
            ))}
          </div>

          {/* Popular TLDs */}
          <div className="mb-20">
            <h2 className="font-tech text-3xl font-bold text-center mb-12 neon-text text-cyber-cyan">
              Popular Domain Extensions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularTlds.map((tld, index) => (
                <GlassmorphismCard key={tld.tld} className="p-6 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-tech text-2xl font-bold text-cyber-cyan">
                      {tld.tld}
                    </span>
                    <span className="text-volt-green font-bold text-xl">
                      {tld.price}<span className="text-sm text-gray-400">/year</span>
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{tld.description}</p>
                  <CyberButton size="sm" className="w-full">
                    Register Now
                  </CyberButton>
                </GlassmorphismCard>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-20">
            <h2 className="font-tech text-3xl font-bold text-center mb-12 neon-text text-cyber-cyan">
              Domain Management Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <GlassmorphismCard key={feature.title} className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-volt-green to-sunset-orange rounded-lg flex items-center justify-center mx-auto mb-4">
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
