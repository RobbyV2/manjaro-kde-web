import { useDesktopStore } from '@/store/useDesktopStore';
import { Icon } from '@/components/Icon';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export const Taskbar = () => {
  const { apps, openApp, minimizeApp, activeAppId } = useDesktopStore();
  const [time, setTime] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => setTime(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Pinned apps + Running Unpinned apps
  const pinnedApps = apps.filter(app => app.isPinned).sort((a, b) => (a.priority || 0) - (b.priority || 0));
  const runningUnpinnedApps = apps.filter(app => !app.isPinned && app.isOpen);

  const handleAppClick = (id: string, isOpen: boolean, isMinimized: boolean) => {
    if (isOpen && !isMinimized && activeAppId === id) {
      minimizeApp(id);
    } else {
      openApp(id);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-12 bg-[#2b2e33] z-50 flex items-center px-2 select-none shadow-[0_0_0.5rem_#171717] text-white">
      <button className="p-2 hover:bg-white/10 rounded transition-colors mr-2 flex items-center justify-center">
         <Icon name="plasma" size={32} />
      </button>

      <div className="flex items-center h-full gap-1 mr-auto">
        {/* Pinned Apps */}
        {pinnedApps.map(app => (
           <button 
             key={app.id}
             onClick={() => handleAppClick(app.id, app.isOpen, app.isMinimized)}
             className={clsx(
               "p-2 rounded transition-all hover:bg-white/10 relative group",
               app.isOpen && !app.isMinimized && "bg-white/5"
             )}
           >
             <Icon name={app.icon} size={24} className={clsx("transition-all", app.isOpen && "drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]")} />
             {app.isOpen && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>}
           </button>
        ))}
        
        {/* Separator if needed */}
        {runningUnpinnedApps.length > 0 && <div className="w-[1px] h-6 bg-gray-600 mx-2"></div>}

        {/* Running Unpinned Apps */}
        {runningUnpinnedApps.map(app => (
           <button 
             key={app.id}
             onClick={() => handleAppClick(app.id, app.isOpen, app.isMinimized)}
             className={clsx(
               "p-2 rounded transition-all hover:bg-white/10 relative",
               app.isOpen && !app.isMinimized && "bg-white/5"
             )}
           >
             <Icon name={app.icon} size={24} />
             <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
           </button>
        ))}
      </div>

      <div className="flex items-center gap-2 h-full">
         {/* Tray Icons */}
         <div className="flex items-center px-2 gap-2">
            <Icon name="paste" size={18} className="opacity-80 hover:opacity-100 cursor-pointer" />
            <Icon name="keyboard" size={18} className="opacity-80 hover:opacity-100 cursor-pointer" />
            <Icon name="audio-volume-muted" size={18} className="opacity-80 hover:opacity-100 cursor-pointer" />
            <Icon name="bluetooth" size={18} className="opacity-80 hover:opacity-100 cursor-pointer" />
            <Icon name="wifi" size={18} className="opacity-80 hover:opacity-100 cursor-pointer" />
         </div>

         {/* Clock */}
         <div className="flex flex-col items-center justify-center px-2 hover:bg-white/10 h-full cursor-pointer transition-colors text-xs leading-tight">
            <span className="text-lg font-medium">{time.format('HH:mm')}</span>
            <span className="opacity-80">{time.format('DD MMM')}</span>
         </div>
      </div>
    </div>
  );
};
