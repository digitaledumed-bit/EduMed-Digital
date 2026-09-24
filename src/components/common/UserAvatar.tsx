import React, { useState } from 'react';
import { getDefaultAvatarByGender } from '../../utils/avatarUtils';

export interface UserAvatarProps {
  name?: string;
  avatarUrl?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  gender?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name = '',
  avatarUrl,
  src,
  size = 'md',
  className = '',
  gender,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses: Record<string, string> = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const imageToDisplay = src || avatarUrl;
  const fallbackSvg = getDefaultAvatarByGender(gender);

  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('')
    : 'U';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      {imageToDisplay && !imgError ? (
        <img
          src={imageToDisplay}
          alt={name || 'Avatar'}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : fallbackSvg ? (
        <img
          src={fallbackSvg}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-bold text-teal-800 dark:text-teal-200 select-none">
          {initials}
        </span>
      )}
    </div>
  );
};

export default UserAvatar;
