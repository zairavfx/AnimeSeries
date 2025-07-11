import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  children: React.ReactNode;
}

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ children, className, variant = 'primary', size = 'md', glow = false, ...props }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-r from-cyber-cyan to-deep-blue hover:from-deep-blue hover:to-cyber-cyan text-rich-black font-semibold',
      secondary: 'bg-gradient-to-r from-neon-purple to-volt-green hover:from-volt-green hover:to-neon-purple text-rich-black font-semibold',
      outline: 'cyber-button border-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-rich-black',
      ghost: 'text-cyber-cyan hover:bg-cyber-cyan/10 hover:text-cyber-cyan'
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    };

    return (
      <Button
        ref={ref}
        className={cn(
          'transition-all duration-300 relative overflow-hidden',
          variants[variant],
          sizes[size],
          glow && 'animate-glow-pulse',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

CyberButton.displayName = "CyberButton";
