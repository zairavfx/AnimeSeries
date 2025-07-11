import { cn } from "@/lib/utils";

interface HolographicBorderProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  animated?: boolean;
}

export function HolographicBorder({ 
  children, 
  className, 
  innerClassName,
  animated = true 
}: HolographicBorderProps) {
  return (
    <div 
      className={cn(
        'holographic-border rounded-xl p-[1px]',
        animated && 'animate-gradient',
        className
      )}
    >
      <div className={cn('bg-rich-black rounded-xl h-full w-full', innerClassName)}>
        {children}
      </div>
    </div>
  );
}
