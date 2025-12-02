'use client';

import { useAppStore } from '@/store/useAppStore';
import { Icon } from './Icon';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export const Taskbar = () => {
  const { apps, openApp, bringToFront } = useAppStore();
  const [time, setTime] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => setTime(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pinnedApps = apps
    .filter((app) => app.taskbar !== undefined)
    .sort((a, b) => (a.taskbar || 0) - (b.taskbar || 0));

  const runningApps = apps
    .filter((app) => app.status > 0 && app.taskbar === undefined)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleAppClick = (appName: string, isActive: boolean) => {
    if (isActive) {
        // If active (top), minimize? Or just bring to front if not top?
        // Logic: if top, minimize. If not top, bring to front.
        // I need to know if it's top.
        // For now, simple toggle: open if closed, bringToFront if open.
        // minimize logic is tricky without knowing if it's top.
        // Let's just open/bringToFront for now.
        const app = apps.find(a => a.name === appName);
        if (app?.status === 0) {
            openApp(appName);
        } else {
             // Toggle minimize? 
             // We'll stick to basic open/focus.
             bringToFront(appName);
        }
    } else {
      openApp(appName);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-[3.2rem] bg-[#2b2e33] flex items-center shadow-[0_0_0.5rem_#171717] z-50 text-white px-2">
      <div className="flex items-center px-2 hover:bg-white/10 h-full cursor-pointer transition-colors">
        <Icon name="plasma" size={40} className="fill-white" />
      </div>

      <div className="flex h-full mx-2 gap-1">
        {pinnedApps.map((app) => (
          <div
            key={app.name}
            className={`flex items-center justify-center px-2 h-full hover:bg-white/10 cursor-pointer transition-all border-b-2 ${
              app.status > 0 ? 'border-[#44bbff]' : 'border-transparent'
            }`}
            onClick={() => handleAppClick(app.name, app.status > 0)}
          >
            <Icon name={app.icon} size={32} />
          </div>
        ))}
      </div>

      <div className="flex h-full mx-2 gap-1">
        {runningApps.map((app) => (
            <div
            key={app.name}
            className={`flex items-center justify-center px-2 h-full hover:bg-white/10 cursor-pointer transition-all border-b-2 border-[#44bbff]`}
            onClick={() => handleAppClick(app.name, true)}
          >
            <Icon name={app.icon} size={32} />
          </div>
        ))}
      </div>

      <div className="ml-auto flex items-center h-full gap-2">
         {/* System Tray */}
         <div className="flex items-center h-full px-1 hover:bg-white/10 cursor-pointer">
             <Icon name="paste" size={20} />
         </div>
         <div className="flex items-center h-full px-1 hover:bg-white/10 cursor-pointer">
             <Icon name="keyboard" size={20} />
         </div>
         <div className="flex items-center h-full px-1 hover:bg-white/10 cursor-pointer">
             <Icon name="audio-volume-muted" size={20} />
         </div>
         <div className="flex items-center h-full px-1 hover:bg-white/10 cursor-pointer">
             <Icon name="bluetooth" size={20} />
         </div>
         <div className="flex items-center h-full px-1 hover:bg-white/10 cursor-pointer">
             <Icon name="wifi" size={20} />
         </div>
         <div className="flex items-center h-full px-1 hover:bg-white/10 cursor-pointer">
             <Icon name="triangle" size={16} style={{transform: 'rotate(-90deg)'}} />
         </div>

         {/* Desktop Peek */}
         <div className="flex items-center h-full px-2 hover:bg-white/10 cursor-pointer">
             <Icon name="desktop" size={30} />
         </div>

         {/* Clock */}
         <div className="flex flex-col items-center justify-center h-full px-3 hover:bg-white/10 cursor-pointer select-none leading-none">
             <span className="text-lg">{time.format('HH:mm')}</span>
             <span className="text-xs text-gray-400">{time.format('DD MMM')}</span>
         </div>
      </div>
    </div>
  );
};
