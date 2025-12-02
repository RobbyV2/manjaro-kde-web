'use client';

import { useAppStore } from '@/store/useAppStore';
import { typeApp } from '@/utils/apps';
import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Icon } from './Icon';

import { AppRenderer } from '@/apps';

interface WindowProps {
  app: typeApp;
}

export const Window = ({ app }: WindowProps) => {
  const { bringToFront, closeApp, minimizeApp, maximizeApp, setAppPosition, setAppSize } = useAppStore();
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const initialX = Array.isArray(app.position) ? app.position[0] : app.position.x;
  const initialY = Array.isArray(app.position) ? app.position[1] : app.position.y;
  
  const [position, setPosition] = useState({ x: initialX || 0, y: initialY || 0 }); // Using x,y from store refactor
  // Note: apps.ts currently has position as number[] or object. I updated it to number[] in write_file, but interface says object. 
  // Let's assume the store/utils normalized it. In utils/apps.ts I wrote: position: [number, number].
  // So app.position[0] is x.
  
  // Wait, I need to check `src/utils/apps.ts`. I wrote `position: [number, number]`.
  // So app.position is array.
  const x = Array.isArray(app.position) ? app.position[0] : app.position.x;
  const y = Array.isArray(app.position) ? app.position[1] : app.position.y;
  const w = Array.isArray(app.size) ? app.size[0] : app.size.w;
  const h = Array.isArray(app.size) ? app.size[1] : app.size.h;

  const isActive = app.status === 2 || app.status === 1; // 1: open, 2: active (maybe) - let's simplify. 
  // Store logic: status 1 is open. 
  // I need to track active window (z-index). Store has bringToFront.
  
  const handleStart = () => {
    bringToFront(app.name);
  };

  const handleDrag = (e: any, data: { x: number, y: number }) => {
    // setPosition({ x: data.x, y: data.y });
    // Update store on stop? Or local state?
    // Draggable is uncontrolled by default but can be controlled.
    // If we want persistent position we should update store on stop.
  };

  const handleStop = (e: any, data: { x: number, y: number }) => {
    setAppPosition(app.name, data.x, data.y);
  };

  if (app.status === 0) return null;

  return (
    <Draggable
      handle=".window-head"
      defaultPosition={{ x, y }}
      position={app.maxed ? { x: 0, y: 0 } : { x, y }}
      onStart={handleStart}
      onStop={handleStop}
      disabled={app.maxed}
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        className={`absolute flex flex-col shadow-lg overflow-hidden bg-[#262626] rounded-sm transition-shadow duration-150 ease-linear ${
          app.maxed ? 'w-full h-full top-0 left-0 !transform-none rounded-none' : ''
        }`}
        style={{
          width: app.maxed ? '100%' : w,
          height: app.maxed ? '100%' : h,
          zIndex: app.zindex,
        }}
        onClick={() => bringToFront(app.name)}
      >
        <div
          className="window-head flex items-center justify-between bg-[#31363b] h-8 px-2 cursor-default select-none relative"
          onDoubleClick={() => maximizeApp(app.name)}
        >
          <div className="flex items-center gap-2">
            <Icon name={app.icon} size={18} />
            <span className="text-gray-400 text-sm ml-2 capitalize">{app.name}</span>
          </div>
          <div className="flex items-center gap-1 z-10">
            <div
              className="p-1 hover:bg-white/10 rounded-full cursor-pointer group"
              onClick={(e) => { e.stopPropagation(); minimizeApp(app.name); }}
            >
               <Icon name="arrow" size={10} className="transform rotate-180 group-hover:invert" />
            </div>
            <div
              className="p-1 hover:bg-white/10 rounded-full cursor-pointer group"
              onClick={(e) => { e.stopPropagation(); maximizeApp(app.name); }}
            >
               <Icon name={app.maxed ? "rhomb" : "arrow"} size={10} className="group-hover:invert" />
            </div>
            <div
              className="p-1 hover:bg-red-500 rounded-full cursor-pointer group"
              onClick={(e) => { e.stopPropagation(); closeApp(app.name); }}
            >
               <Icon name="close" size={10} className="group-hover:invert" />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto text-white relative">
           <AppRenderer appName={app.app} params={app.params} />
        </div>
      </div>
    </Draggable>
  );
};
