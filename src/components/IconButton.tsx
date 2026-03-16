import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  title?: string;
  size?: number;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon: Icon, 
  title, 
  size = 18, 
  className = '', 
  ...props 
}) => {
  return (
    <button 
      className={`w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#FF8FA3] shadow-sm hover:shadow-md hover:bg-white hover:border hover:border-pink-100 transition-all flex-shrink-0 ${className}`}
      title={title}
      {...props}
    >
      <Icon size={size} className="md:w-5 md:h-5" />
    </button>
  );
};
