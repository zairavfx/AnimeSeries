import { 
  Server, 
  Cloud, 
  Globe, 
  Code, 
  MessageSquare, 
  Headphones,
  Cpu,
  Shield,
  Zap,
  Settings
} from "lucide-react";

export const CYBER_COLORS = {
  cyan: 'hsl(195, 100%, 50%)',
  purple: 'hsl(271, 56%, 59%)',
  blue: 'hsl(208, 96%, 39%)',
  green: 'hsl(103, 100%, 54%)',
  orange: 'hsl(17, 100%, 58%)',
  black: 'hsl(0, 0%, 3.9%)',
  charcoal: 'hsl(0, 0%, 10.2%)',
  gray: 'hsl(0, 0%, 17.6%)'
};

export const NAVIGATION_ITEMS = [
  { label: 'Home', path: '/', icon: 'home' },
  { label: 'VPS', path: '/vps', icon: 'server' },
  { label: 'Hosting', path: '/hosting', icon: 'cloud' },
  { label: 'Domains', path: '/domains', icon: 'globe' },
  { label: 'Development', path: '/website-making', icon: 'code' },
  { label: 'Bots', path: '/telegram-bot', icon: 'message-square' },
  { label: 'Contact', path: '/contact', icon: 'headphones' }
];

export const SERVICE_ICONS = {
  vps: Server,
  hosting: Cloud,
  domains: Globe,
  development: Code,
  bots: MessageSquare,
  support: Headphones,
  cpu: Cpu,
  shield: Shield,
  zap: Zap,
  settings: Settings
};

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
} as const;

export const PAGE_LAYOUTS = {
  DEFAULT: 'default',
  CARDS: 'cards',
  PRICING: 'pricing',
  GRID: 'grid',
  TIMELINE: 'timeline'
} as const;

export const CONTACT_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export const CONTACT_STATUSES = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
} as const;

export const BILLING_CYCLES = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  ONE_TIME: 'one-time'
} as const;

export const DEFAULT_VPS_FEATURES = [
  'Full Root Access',
  'KVM Virtualization',
  'NVMe SSD Storage',
  'DDoS Protection',
  '99.9% Uptime SLA',
  '24/7 Support'
];

export const DEFAULT_HOSTING_FEATURES = [
  'cPanel Control Panel',
  'Free SSL Certificate',
  'Daily Backups',
  'WordPress Optimized',
  'Email Accounts',
  '24/7 Support'
];

export const TECH_STACK_ICONS = {
  'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'
};

export const ANIME_QUOTES = [
  "Innovation is the key to staying ahead in the digital realm.",
  "Every line of code is a step towards digital mastery.",
  "In the cyber world, only the adaptable survive.",
  "Technology is magic that actually works.",
  "The future belongs to those who code it."
];

export const GLASSMORPHISM_STYLES = {
  light: 'backdrop-blur-md bg-white/10 border border-white/20',
  medium: 'backdrop-blur-lg bg-white/5 border border-cyan-500/20',
  heavy: 'backdrop-blur-xl bg-black/30 border border-cyan-500/30'
};

export const GLOW_VARIANTS = {
  cyan: 'shadow-[0_0_20px_rgba(0,217,255,0.3)]',
  purple: 'shadow-[0_0_20px_rgba(157,78,221,0.3)]',
  green: 'shadow-[0_0_20px_rgba(57,255,20,0.3)]',
  orange: 'shadow-[0_0_20px_rgba(255,107,53,0.3)]'
};
