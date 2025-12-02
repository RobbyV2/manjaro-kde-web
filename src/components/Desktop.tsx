'use client';

import { useAppStore } from '@/store/useAppStore';
import { Window } from './Window';
import { basePath } from '@/utils/utils';
import Image from 'next/image';

export const Desktop = () => {
  const { apps } = useAppStore();

  return (
    <div className="relative w-screen h-[calc(100vh-3.2rem)] overflow-hidden">
      <Image
        src={`${basePath}/assets/images/wallpaper.png`}
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
