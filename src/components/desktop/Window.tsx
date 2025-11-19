import { Rnd } from 'react-rnd';
import { useDesktopStore, AppInstance } from '@/store/useDesktopStore';
import { Icon } from '@/components/Icon';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

interface WindowProps {
  app: AppInstance;
  children?: React.ReactNode;
}

export const Window = ({ app, children }: WindowProps) => {
  const { 
    closeApp, 
    minimizeApp, 
    toggleMaximize, 
    setZIndex, 
    updateWindowPosition, 
    updateWindowSize 
  } = useDesktopStore();

  const isMaximized = app.isMaximized;
  const [isResizing, setIsResizing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const handleMouseDown = () => {
    setZIndex(app.id);
  };

  if (app.isMinimized || !app.isOpen) return null;

  return (
    <Rnd
      size={isMaximized ? { width: '100%', height: '100%' } : { width: app.size.width, height: app.size.height }}
      position={isMaximized ? { x: 0, y: 0 } : { x: app.position.x, y: app.position.y }}
      onDragStart={() => { setIsMoving(true); handleMouseDown(); }}
      onDragStop={(e, d) => {
        setIsMoving(false);
        if (!isMaximized) updateWindowPosition(app.id, { x: d.x, y: d.y });
      }}
      onResizeStart={() => { setIsResizing(true); handleMouseDown(); }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setIsResizing(false);
        if (!isMaximized) {
            updateWindowSize(app.id, { 
            width: parseInt(ref.style.width), 
            height: parseInt(ref.style.height) 
            });
            updateWindowPosition(app.id, position);
        }
      }}
      onMouseDown={handleMouseDown}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      style={{ zIndex: app.zIndex }}
      className={clsx(
        "absolute p-[8px] transition-[box-shadow] duration-150 ease-linear origin-top-left",
        isMaximized && "!w-full !h-full !p-0"
      )}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      dragHandleClassName="window-drag-handle"
    >
       <div className={clsx("w-full h-full shadow-[0_0_0.4rem_rgba(0,0,0,0.6)] flex flex-col", activeAppId === app.id && "shadow-[0_0_0.8rem_rgba(0,0,0,0.6)]")}>
           {/* Titlebar */}
           <div 
                className={clsx(
                    "window-drag-handle w-full h-[1.6rem] bg-[#31363B] py-[0.2rem] flex items-center relative select-none",
                    isMoving ? "cursor-move" : "cursor-default"
                )}
                onDoubleClick={() => toggleMaximize(app.id)}
           >
              <div className="ml-[0.3rem] order-1 flex items-center">
                  <Icon name={app.icon} style={{ width: '1.4rem', height: '1.4rem' }} />
              </div>
              
              <div className="order-2 m-auto text-[0.9rem] text-[#9a9a9a] absolute left-0 right-0 text-center pointer-events-none">
                  {app.name}
              </div>

              <div className="order-3 ml-auto mr-[0.1rem] flex items-center z-10">
                 <button onClick={() => minimizeApp(app.id)} className="p-[0.3rem] rounded-full hover:bg-white group flex items-center justify-center">
                    <Icon name="arrow" style={{ width: '0.85rem', height: '0.85rem' }} className="fill-white group-hover:!fill-black rotate-180" />
                 </button>
                 <button onClick={() => toggleMaximize(app.id)} className="p-[0.3rem] rounded-full hover:bg-white group flex items-center justify-center mx-[0.1rem]">
                    <Icon name={isMaximized ? "rhomb" : "arrow"} style={{ width: '0.85rem', height: '0.85rem' }} className="fill-white group-hover:!fill-black" />
                 </button>
                 <button onClick={() => closeApp(app.id)} className="p-[0.4rem] rounded-full hover:bg-[#ff6666] group flex items-center justify-center">
                    <Icon name="close" style={{ width: '0.65rem', height: '0.65rem' }} className="fill-white group-hover:!fill-black" />
                 </button>
              </div>
           </div>

           {/* Content */}
           <div className={clsx("w-full h-[calc(100%-1.6rem)] bg-[#262626] overflow-hidden relative", isResizing || isMoving ? "pointer-events-none" : "")}>
              {children}
           </div>
       </div>
    </Rnd>
  );
};

// Helper to get activeAppId if not passed prop
const activeAppId = useDesktopStore.getState().activeAppId;