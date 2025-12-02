'use client';

import { useAppStore } from '@/store/useAppStore';
import { Window } from './Window';
import Image from 'next/image';

export const Desktop = () => {
  const { apps } = useAppStore();

  return (
    <div className="relative w-screen h-[calc(100vh-3.2rem)] overflow-hidden">
      <Image
        src="/assets/images/wallpaper.png" // Next.js needs public assets. But I copied to src/assets. 
        // I should have copied images to public/images too or configured alias.
        // Wait, I copied public/* from ref. Ref has public/favicon.png etc.
        // I also copied src/assets/images.
        // I need to verify where wallpaper is.
        // Ref: src/assets/images/wallpaper.png.
        // I should move src/assets/images to public/images to be served.
        alt="wallpaper"
        fill
        className="object-cover pointer-events-none select-none -z-10"
        priority
      />
      {apps.map((app) => (
        <Window key={app.name} app={app} />
      ))}
    </div>
  );
};
