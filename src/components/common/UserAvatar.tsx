import React from 'react';

interface UserAvatarProps {
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  role?: string;
}

export const getInitials = (name?: string): string => {
  if (!name || !name.trim()) return 'ED';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name = 'Usuario', 
  size = 'md', 
  className = '',
  role
}) => {
  const initials = getInitials(name);

  const sizeClasses: Record<string, string> = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs font-bold',
    md: 'w-10 h-10 text-sm font-bold',
    lg: 'w-14 h-14 text-lg font-extrabold',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl font-black'
  };

  // Cohesive institutional color palettes (no random internet portrait photos)
  const gradients = [
    'from-teal-600 to-emerald-800 text-white border-teal-500/50 shadow-teal-900/20',
    'from-blue-600 to-indigo-800 text-white border-blue-500/50 shadow-blue-900/20',
    'from-amber-600 to-amber-800 text-white border-amber-500/50 shadow-amber-900/20',
    'from-emerald-600 to-teal-800 text-white border-emerald-500/50 shadow-emerald-900/20',
    'from-slate-700 to-slate-900 text-white border-slate-600/50 shadow-slate-900/20'
  ];

  const charCode = (name || '').charCodeAt(0) || 0;
  const gradientClass = gradients[charCode % gradients.length];

  return (
    <div 
      className={`rounded-2xl flex items-center justify-center select-none shadow-xs border bg-gradient-to-br ${gradientClass} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title={name}
      aria-label={name}
    >
      <span className="leading-none tracking-tight">{initials}</span>
    </div>
  );
};
