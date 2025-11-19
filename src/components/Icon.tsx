import React from 'react';
import { getPublicUrl } from '@/utils/publicUrl';

interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name: string;
  size?: number | string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, className, style, ...props }) => {
  return (
    <img
      src={getPublicUrl(`/icons/${name}.svg`)}
      alt={name}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, ...style }}
      draggable={false}
      {...props}
    />
  );
};
