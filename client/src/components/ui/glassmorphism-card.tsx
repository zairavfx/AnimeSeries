import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'medium' | 'heavy';
  glow?: 'cyan' | 'purple' | 'green' | 'orange' | 'none';
  hover?: boolean;
}

export function GlassmorphismCard({ 
  children, 
  className, 
  variant = 'medium',
  glow = 'none',
  hover = true
}: GlassmorphismCardProps) {
  const variantStyles = {
    light: 'backdrop-blur-md bg-white/10 border border-white/20',
    medium: 'backdrop-blur-lg bg-white/5 border border-cyber-cyan/20',
    heavy: 'backdrop-blur-xl bg-black/30 border border-cyber-cyan/30'
  };

  const glowStyles = {
    cyan: 'shadow-[0_0_20px_rgba(0,217,255,0.3)]',
    purple: 'shadow-[0_0_20px_rgba(157,78,221,0.3)]',
    green: 'shadow-[0_0_20px_rgba(57,255,20,0.3)]',
    orange: 'shadow-[0_0_20px_rgba(255,107,53,0.3)]',
    none: ''
  };

  return (
    <Card 
      className={cn(
        'glass-card',
        variantStyles[variant],
        glow !== 'none' && glowStyles[glow],
        hover && 'hover-glow transition-all duration-300',
        className
      )}
    >
      {children}
    </Card>
  );
}
