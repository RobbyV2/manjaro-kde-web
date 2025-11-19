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

  const getTrayView = () => {
      if (activeMenu?.startsWith('tray-')) {
          return activeMenu.replace('tray-', '') as any;
      }
      return '';
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full h-[3.2rem] z-[5000] flex items-center shadow-[0_0_0.5rem_#171717] select-none">
        {/* Background Layer */}
        <span className="absolute inset-0 bg-[#2b2e33] z-[2]"></span>
        
        {/* Content Layer */}
        <div className="relative z-[3] w-full h-full flex items-center px-0">
            {/* Start Button */}
            <div 
                onClick={() => toggleMenu('start')}
                className="flex items-center justify-center mx-[0.4rem] cursor-pointer"
            >
            <Icon name="plasma" size="2.5rem" className="fill-white" />
            </div>

            {/* Pinned & Running Apps */}
            <div className="flex items-center h-full">
                <div className="flex h-full">
                    {pinnedApps.map(app => (
                    <AppIcon 
                        key={app.id} 
                        app={app} 
                        isActive={app.isOpen && !app.isMinimized}
                        onClick={() => handleAppClick(app.id, app.isOpen, app.isMinimized)}
                    />
                    ))}
                </div>
                
                {/* Separator - only implicit by flex/spacing in legacy, but we'll keep it clean */}
                
                <div className="flex h-full">
                    {runningUnpinnedApps.map(app => (
                    <AppIcon 
                        key={app.id} 
                        app={app} 
                        isActive={app.isOpen && !app.isMinimized}
                        onClick={() => handleAppClick(app.id, app.isOpen, app.isMinimized)}
                    />
                    ))}
                </div>
            </div>

            {/* Tray / Pendant */}
            <div className={clsx("ml-auto h-full flex relative", activeMenu === 'tray-arrow' && "before:content-[''] before:absolute before:w-[77%] before:h-[3px] before:bg-[#44bbff] before:top-0 before:left-[0.5rem]")}>
                <TrayIcon 
                    name="paste" 
                    isActive={activeMenu === 'tray-paste'} 
                    onClick={() => toggleMenu('tray-paste')} 
                />
                <TrayIcon 
                    name="keyboard" 
                    isActive={false} // Keyboard doesn't have a menu in legacy for now
                    onClick={() => {}} 
                />
                <TrayIcon 
                    name="audio-volume-muted" 
                    isActive={activeMenu === 'tray-volume'} 
                    onClick={() => toggleMenu('tray-volume')} 
                />
                <TrayIcon 
                    name="bluetooth" 
                    isActive={activeMenu === 'tray-bluetooth'} 
                    onClick={() => toggleMenu('tray-bluetooth')} 
                />
                <TrayIcon 
                    name="wifi" 
                    isActive={activeMenu === 'tray-wifi'} 
                    onClick={() => toggleMenu('tray-wifi')} 
                />
                <div 
                    onClick={() => toggleMenu('tray-arrow')}
                    className="h-full flex items-center mx-[0.1rem] px-[0.15rem] relative cursor-pointer trans"
                >
                    <Icon 
                        name="triangle" 
                        style={{ width: '1.1rem', height: '1.1rem' }} 
                        className={clsx("fill-white transition-transform", activeMenu === 'tray-arrow' ? "rotate-180" : "-rotate-90")} 
                    />
                </div>
                <div 
                    className="h-full flex items-center mx-[0.1rem] px-[0.15rem] relative cursor-pointer"
                    onClick={() => {
                        // Show desktop logic could go here
                    }}
                >
                    <Icon name="desktop" style={{ width: '2.2rem', height: '2.2rem' }} />
                </div>

                {/* Time */}
                <div 
                    onClick={() => toggleMenu('calendar')}
                    className="h-full flex flex-col justify-center text-white mx-[0.6rem] cursor-pointer select-none hover:bg-white/5 px-2"
                >
                    <time className="text-[1.2rem] leading-none text-center">{time.format('HH:mm')}</time>
                    <span className="text-[0.85rem] leading-none text-center mt-0.5">{time.format('DD MMM')}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Menus */}
      <StartMenu isOpen={activeMenu === 'start'} onClose={() => setActiveMenu(null)} />
      <SystemTrayPopup view={getTrayView()} onClose={() => setActiveMenu(null)} />
      <CalendarWidget isOpen={activeMenu === 'calendar'} onClose={() => setActiveMenu(null)} />
    </>
  );
};

// Sub-components to match legacy styles exactly
const AppIcon = ({ app, isActive, onClick }: { app: any, isActive: boolean, onClick: () => void }) => (
    <div onClick={onClick} className="h-full flex items-center cursor-pointer px-1 hover:bg-white/10 group">
        <Icon 
            name={app.icon} 
            size="2rem" // Legacy didn't specify exact size in css for app icons but implied standard size
            className={clsx("transition-all duration-150", isActive ? "drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : "group-hover:brightness-125 group-hover:saturate-200")}
        />
    </div>
);

const TrayIcon = ({ name, isActive, onClick }: { name: string, isActive: boolean, onClick: () => void }) => (
    <div 
        onClick={onClick}
        className={clsx(
            "h-full flex items-center mx-[0.1rem] px-[0.15rem] relative cursor-pointer",
            isActive && "before:content-[''] before:absolute before:w-[80%] before:h-[3px] before:bg-[#44bbff] before:top-0 before:left-[10%]"
        )}
    >
        <Icon name={name} style={{ width: '1.6rem', height: '1.6rem' }} className="fill-white" />
    </div>
);
