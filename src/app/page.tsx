'use client';

import { Desktop } from '@/components/Desktop';
import { Taskbar } from '@/components/Taskbar';
import { LockScreen } from '@/components/LockScreen';
import { CmdMsg } from '@/components/CmdMsg';
import { useAppStore } from '@/store/useAppStore';
import Image from 'next/image';

export default function Home() {
  const { isLocked, powerState } = useAppStore();

  return (
    <main className="relative flex min-h-screen flex-col bg-zinc-900 overflow-hidden font-sans select-none">
       {/* Wallpaper is shared for Lock and Desktop in ref via index.vue but Desktop has its own. 
           Ref index.vue has wallpaper img. 
           Let's put wallpaper here as background for everything except CmdMsg.
       */}
       {(powerState === '' || (powerState === '' && isLocked)) && (
         <Image
          src="/images/blur-bg.jpg" // Ref uses blur-bg.jpg for lock/index
          alt="background"
          fill
          className="object-cover -z-50"
          priority
         />
       )}
       
       <CmdMsg />
       
       {powerState === '' && (
         <>
           <LockScreen />
           {!isLocked && (
             <>
               <Desktop />
               <Taskbar />
             </>
           )}
         </>
       )}
    </main>
  );
}
