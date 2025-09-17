import React from 'react';
import { Icon } from '../ui/icon';
import { IconName } from '../../lib/asset-types';

interface LutarLogoProps {
  variant?: 'default' | 'white';
  size?: number;
  className?: string;
}

const LutarLogo: React.FC<LutarLogoProps> = ({ variant = 'default', size = 32, className }) => {
  const iconName: IconName = variant === 'white' ? 'lutar-white' : 'lutar';
  
  return (
    <Icon
      name={iconName}
      size={size}
      className={className}
    />
  );
};

export { LutarLogo };
