import React from 'react';
import { User } from 'lucide-react';
import { getProfilePicture } from '@/utils/getImage';

interface AvatarProps {
  user?: {
    first_name?: string;
    last_name?: string;
    image?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  user, 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (user?.first_name) {
    return (
      <img
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        src={getProfilePicture(user.image || '')}
        alt={`${user.first_name} ${user.last_name || ''}`}
        width={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
        height={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center ${className}`}>
      <User className={`${iconSize[size]} text-gray-600 dark:text-gray-300`} />
    </div>
  );
};