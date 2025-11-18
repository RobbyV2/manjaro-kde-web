import { useDesktopStore } from '@/store/useDesktopStore';
import { Icon } from '@/components/Icon';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { StartMenu } from './StartMenu';
import { SystemTrayPopup } from './SystemTrayPopup';
import { CalendarWidget } from './CalendarWidget';

export const Taskbar = () => {
  const { apps, openApp, minimizeApp, activeAppId, activeMenu, setActiveMenu } = useDesktopStore();
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
    setActiveMenu(null);
  };

  const toggleMenu = (menu: typeof activeMenu) => {
    if (activeMenu === menu) {
        setActiveMenu(null);
    } else {
        setActiveMenu(menu);
    }
  };

  // Helper to get tray view from activeMenu string
  const getTrayView = () => {
      if (activeMenu?.startsWith('tray-')) {
          return activeMenu.replace('tray-', '') as any;
      }
      return '';
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-12 bg-[#2b2e33] z-[5000] flex items-center px-2 select-none shadow-[0_0_0.5rem_#171717] text-white font-sans">
      {/* Start Button */}
      <button 
        onClick={() => toggleMenu('start')}
        className={clsx(
            "p-2 rounded transition-colors mr-2 flex items-center justify-center",
            activeMenu === 'start' ? "bg-white/10" : "hover:bg-white/10"
        )}
      >
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
        
        {/* Separator */}
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

      {/* Tray Area */}
      <div className="flex items-center gap-2 h-full relative">
         {/* Tray Icons */}
         <div className="flex items-center px-2 gap-1 h-full">
            <button onClick={() => toggleMenu('tray-paste')} className={clsx("p-1.5 rounded hover:bg-white/10", activeMenu === 'tray-paste' && "bg-white/10")}>
                <Icon name="paste" size={18} className="opacity-80 hover:opacity-100" />
            </button>
            <button className="p-1.5 rounded hover:bg-white/10">
                 {/* Mock toggle for keyboard icon */}
                <Icon name="keyboard" size={18} className="opacity-80 hover:opacity-100" />
            </button>
            <button onClick={() => toggleMenu('tray-volume')} className={clsx("p-1.5 rounded hover:bg-white/10", activeMenu === 'tray-volume' && "bg-white/10")}>
                <Icon name="audio-volume-muted" size={18} className="opacity-80 hover:opacity-100" />
            </button>
            <button onClick={() => toggleMenu('tray-bluetooth')} className={clsx("p-1.5 rounded hover:bg-white/10", activeMenu === 'tray-bluetooth' && "bg-white/10")}>
                <Icon name="bluetooth" size={18} className="opacity-80 hover:opacity-100" />
            </button>
            <button onClick={() => toggleMenu('tray-wifi')} className={clsx("p-1.5 rounded hover:bg-white/10", activeMenu === 'tray-wifi' && "bg-white/10")}>
                <Icon name="wifi" size={18} className="opacity-80 hover:opacity-100" />
            </button>
            <button onClick={() => toggleMenu('tray-arrow')} className={clsx("p-1.5 rounded hover:bg-white/10 transition-transform", activeMenu === 'tray-arrow' && "bg-white/10 rotate-180")}>
                <Icon name="triangle" size={18} className="opacity-80 hover:opacity-100 -rotate-90" />
            </button>
         </div>

         {/* Clock */}
         <div 
            onClick={() => toggleMenu('calendar')}
            className={clsx(
                "flex flex-col items-center justify-center px-2 h-full cursor-pointer transition-colors text-xs leading-tight min-w-[4rem]",
                activeMenu === 'calendar' ? "bg-white/10" : "hover:bg-white/10"
            )}
         >
            <span className="text-lg font-medium">{time.format('HH:mm')}</span>
            <span className="opacity-80">{time.format('DD MMM')}</span>
         </div>
      </div>

      {/* Menus */}
      <StartMenu isOpen={activeMenu === 'start'} onClose={() => setActiveMenu(null)} />
      <SystemTrayPopup view={getTrayView()} onClose={() => setActiveMenu(null)} />
      <CalendarWidget isOpen={activeMenu === 'calendar'} onClose={() => setActiveMenu(null)} />
    </div>
  );
};