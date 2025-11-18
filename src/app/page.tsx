'use client';
import { useDesktopStore } from '@/store/useDesktopStore';
import { Desktop } from '@/components/desktop/Desktop';
import { Taskbar } from '@/components/taskbar/Taskbar';
import { LockScreen } from '@/components/lock/LockScreen';
import { useEffect, useState } from 'react';

export default function Home() {
  const isLocked = useDesktopStore(state => state.isLocked);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <main className="w-full h-screen overflow-hidden relative text-white select-none">
       {/* Wallpaper */}
       <div className="absolute inset-0 -z-10">
          <img src="/images/blur-bg.jpg" className="w-full h-full object-cover" alt="" />
       </div>

       {isLocked && <LockScreen />}
       {!isLocked && (
         <>
           <Desktop />
           <Taskbar />
         </>
       )}
    </main>
  );
}