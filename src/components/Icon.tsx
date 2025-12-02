import Image from 'next/image';

interface IconProps {
  name: string;
  size?: number | string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export const Icon = ({ name, size = 24, className, onClick, style }: IconProps) => {
  const sizePx = typeof size === 'number' ? size : parseInt(size as string) || 24;
  
  return (
    <div 
      className={`flex items-center justify-center select-none ${className || ''}`} 
      onClick={onClick} 
      style={{ width: size, height: size, ...style }}
    >
       <Image
         src={`/svg/${name}.svg`}
         alt={name}
         width={sizePx}
         height={sizePx}
         draggable={false}
         className="w-full h-full object-contain"
       />
    </div>
  );
};
