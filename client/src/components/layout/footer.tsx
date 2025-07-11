import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card';

export function Footer() {
  const { data: publicSettings = {} } = useQuery({
    queryKey: ['/api/settings/public'],
  });

  const currentYear = new Date().getFullYear();
  const siteName = publicSettings.site_name || 'OnAnimeSeries';
  const companyEmail = publicSettings.company_email || 'contact@onanimeseries.com';
  const companyPhone = publicSettings.company_phone || '+91 98765 43210';
  const companyAddress = publicSettings.company_address || 'Mumbai, Maharashtra, India';

  const services = [
    { name: 'VPS Hosting', href: '/vps' },
    { name: 'Web Hosting', href: '/hosting' },
    { name: 'Domain Services', href: '/domains' },
    { name: 'Web Development', href: '/website-making' },
    { name: 'Telegram Bots', href: '/telegram-bot' }
  ];

  const company = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Team', href: '/team' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press', href: '/press' }
  ];

  const support = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Help Center', href: '/help' },
    { name: 'Status Page', href: '/status' },
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/api-docs' }
  ];

  const legal = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Acceptable Use', href: '/aup' },
    { name: 'SLA', href: '/sla' }
  ];

  return (
    <footer className="relative mt-20 py-16 border-t border-cyber-cyan/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-cyber-cyan to-neon-purple rounded-lg flex items-center justify-center">
                <i className="fas fa-terminal text-white"></i>
              </div>
              <span className="font-tech text-2xl font-bold neon-text text-cyber-cyan">
                {siteName}
              </span>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Premium hosting, VPS solutions, and full-stack development powered by cutting-edge 
              anime-inspired technology. Building the future of digital infrastructure.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail size={16} className="text-cyber-cyan" />
                <a href={`mailto:${companyEmail}`} className="hover:text-cyber-cyan transition-colors">
                  {companyEmail}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone size={16} className="text-cyber-cyan" />
                <a href={`tel:${companyPhone.replace(/\s/g, '')}`} className="hover:text-cyber-cyan transition-colors">
                  {companyPhone}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin size={16} className="text-cyber-cyan" />
                <span>{companyAddress}</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="w-10 h-10 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 rounded-lg flex items-center justify-center text-cyber-cyan hover:text-white transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 rounded-lg flex items-center justify-center text-cyber-cyan hover:text-white transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 rounded-lg flex items-center justify-center text-cyber-cyan hover:text-white transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 rounded-lg flex items-center justify-center text-cyber-cyan hover:text-white transition-all duration-300">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-tech text-lg font-bold text-cyber-cyan mb-6">Services</h3>
            <ul className="space-y-3">
              {services.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <span className="text-gray-300 hover:text-cyber-cyan transition-colors cursor-pointer">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-tech text-lg font-bold text-neon-purple mb-6">Company</h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <span className="text-gray-300 hover:text-neon-purple transition-colors cursor-pointer">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-tech text-lg font-bold text-volt-green mb-6">Support</h3>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <span className="text-gray-300 hover:text-volt-green transition-colors cursor-pointer">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-cyber-cyan/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} {siteName}. All rights reserved. Built with ⚡ and 🚀
            </div>
            
            <div className="flex flex-wrap space-x-6 text-sm">
              {legal.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span className="text-gray-400 hover:text-cyber-cyan transition-colors cursor-pointer">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-cyber-cyan/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-neon-purple/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
    </footer>
  );
}
