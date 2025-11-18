import { Rnd } from 'react-rnd';
import { useDesktopStore, AppInstance } from '@/store/useDesktopStore';
import { Icon } from '@/components/Icon';
import clsx from 'clsx';
import { useRef } from 'react';

interface WindowProps {
  app: AppInstance;
}

export const Window = ({ app }: WindowProps) => {
  const { 
    closeApp, 
    minimizeApp, 
    toggleMaximize, 
    setZIndex, 
    updateWindowPosition, 
    updateWindowSize 
  } = useDesktopStore();

  // Bring to front on click
  const handleMouseDown = () => {
    setZIndex(app.id);
  };

  if (app.isMinimized || !app.isOpen) return null;

  // If maximized, we override props to fill screen (minus taskbar)
  // Taskbar is 3rem (12 * 0.25rem in tailwind h-12) = 48px.
  // But Desktop container handles the available space `h-[calc(100%-3rem)]`.
  // So we just need to fill the parent.
  
  const isMaximized = app.isMaximized;

  return (
    <Rnd
      size={isMaximized ? { width: '100%', height: '100%' } : { width: app.size.width, height: app.size.height }}
      position={isMaximized ? { x: 0, y: 0 } : { x: app.position.x, y: app.position.y }}
      onDragStop={(e, d) => {
        if (!isMaximized) updateWindowPosition(app.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
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
        "flex flex-col bg-[#2b2e33] rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden border border-[#171717]", 
        isMaximized ? "rounded-none border-none" : "transition-all duration-200 ease-out"
      )}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      dragHandleClassName="window-drag-handle"
    >
       {/* Titlebar */}
       <div className="window-drag-handle h-9 bg-[#2b2e33] flex items-center justify-between px-3 select-none border-b border-black/40 shrink-0" 
            onDoubleClick={() => toggleMaximize(app.id)}
       >
          <div className="flex items-center gap-2">
             <Icon name={app.icon} size={18} />
             <span className="text-sm font-medium text-gray-200">{app.name}</span>
          </div>
          <div className="flex items-center gap-2" onMouseDown={e => e.stopPropagation()}>
             <button onClick={() => minimizeApp(app.id)} className="p-1 hover:bg-white/10 rounded transition-colors">
                <Icon name="system-suspend" size={14} className="opacity-80" /> {/* Using system-suspend as minimize-like icon if available, or just css */}
             </button>
             <button onClick={() => toggleMaximize(app.id)} className="p-1 hover:bg-white/10 rounded transition-colors">
                <div className={clsx("border border-gray-400 rounded-sm", isMaximized ? "w-3 h-3 border-2" : "w-3 h-3")}></div>
             </button>
             <button onClick={() => closeApp(app.id)} className="p-1 hover:bg-red-500 rounded group transition-colors">
                <Icon name="close" size={14} className="opacity-80 group-hover:opacity-100 group-hover:text-white" />
             </button>
          </div>
       </div>

       {/* Content */}
       <div className="flex-1 bg-[#1e1e1e] relative overflow-hidden cursor-default text-white p-0">
          {/* Placeholder Content */}
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
             <Icon name={app.icon} size={96} className="opacity-20 mb-4" />
             <h1 className="text-2xl font-light mb-2">{app.name}</h1>
             <p>Application content goes here.</p>
          </div>
       </div>
    </Rnd>
  );
};
