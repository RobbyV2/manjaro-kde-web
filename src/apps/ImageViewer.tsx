'use client';

import React from 'react';
import Image from 'next/image';

interface ImageViewerProps {
  filepath?: string;
}

export const ImageViewer = ({ filepath }: ImageViewerProps) => {
    // Mapping path to public URL
    // e.g. "Pictures/wallpaper.png"
    const getSrc = (path: string) => {
        if (!path) return "";
        // Mapping logic... 
        // For now hardcode or use simple replace if we know structure
        if (path.includes("wallpaper.png")) return "/images/wallpaper.png";
        if (path.includes("blur-bg.jpg")) return "/images/blur-bg.jpg";
        if (path.includes("gameover.png")) return "/images/gameover.png";
        
        // Dolphin files
        if (path.includes("mushishi.jpg")) return "/dolphin-files/images/mushishi.jpg";
        if (path.includes("yunyuyuan.png")) return "/dolphin-files/images/yunyuyuan.png";
        if (path.includes("1.png")) return "/dolphin-files/images/calendar/1.png";
        
        return "";
    };

    const src = getSrc(filepath || "");

  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden relative">
       {src ? (
           <img 
             src={src} 
             alt={filepath} 
             className="max-w-full max-h-full object-contain pointer-events-none"
             draggable={false}
           />
       ) : (
           <div className="text-gray-500">No Image Open</div>
       )}
    </div>
  );
};
