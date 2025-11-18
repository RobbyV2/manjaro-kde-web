import { useDesktopStore } from '@/store/useDesktopStore';
import { useState } from 'react';

export const LockScreen = () => {
  const setLocked = useDesktopStore(state => state.setLocked);
  const [password, setPassword] = useState('');

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    setLocked(false);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm absolute z-[100] text-white">
      <div className="flex flex-col items-center gap-4">
        <img src="https://blog.yunyuyuan.net/favicon.png" alt="User" className="w-24 h-24 rounded-full border-2 border-white/20" />
        <h1 className="text-2xl font-bold">hitu</h1>
        <form onSubmit={handleLogin} className="flex gap-2">
          <input 
            type="password" 
            placeholder="Password" 
            className="bg-gray-800/50 border border-gray-600 rounded px-3 py-1 focus:outline-none focus:border-blue-500 transition-colors"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="text-white hover:text-blue-400">→</button>
        </form>
      </div>
    </div>
  );
};
