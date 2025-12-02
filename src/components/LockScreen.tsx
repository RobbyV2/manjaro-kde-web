'use client';

import { useAppStore } from '@/store/useAppStore';
import { Icon } from './Icon';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export const LockScreen = () => {
  const { isLocked, setLocked, setPowerState } = useAppStore();
  const [time, setTime] = useState(dayjs());
  const [password, setPassword] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTime(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = () => {
    setLocked(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if (!isLocked) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white z-[100] transition-opacity duration-200">
      <div className="absolute top-0 left-0 w-full h-full bg-black/15 -z-10" />
      
      <div className="flex flex-col items-center mt-20">
        <strong className="text-5xl">{time.format('HH:mm A')}</strong>
        <span className="text-xl mt-2">{time.format('DD MMM YYYY')}</span>
      </div>

      <div className="flex flex-col items-center my-16">
        <div className="border-2 border-white rounded-full p-3 bg-white/20">
          <Icon name="user" size={80} className="fill-white" />
        </div>
        <span className="text-lg mt-4">User</span>
      </div>

      <div className="flex items-center">
        <input
          type="password"
          className="bg-zinc-700/80 border border-zinc-500 rounded px-2 py-1 text-white outline-none focus:border-blue-400 w-48"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div 
          className="ml-2 bg-zinc-700/80 border border-zinc-500 rounded p-1.5 cursor-pointer hover:border-blue-400 group"
          onClick={handleLogin}
        >
          <Icon name="arrow" size={16} className="fill-white transform rotate-90 group-hover:fill-blue-400" />
        </div>
      </div>

      <div className="flex items-center gap-8 mt-12">
        <div 
          className="flex flex-col items-center cursor-pointer group"
          onClick={() => setPowerState('shutdown')}
        >
          <div className="transition-transform duration-200 group-hover:rotate-180">
            <Icon name="system-shutdown" size={40} />
          </div>
          <span className="text-xs mt-1">Shutdown</span>
        </div>
        <div 
          className="flex flex-col items-center cursor-pointer group"
          onClick={() => setPowerState('reboot')}
        >
          <div className="transition-transform duration-200 group-hover:rotate-180">
            <Icon name="system-reboot" size={40} />
          </div>
          <span className="text-xs mt-1">Reboot</span>
        </div>
      </div>
    </div>
  );
};
