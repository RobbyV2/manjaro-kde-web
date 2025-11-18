import { useDesktopStore } from '@/store/useDesktopStore';
import { Window } from './Window';

export const Desktop = () => {
  const apps = useDesktopStore(state => state.apps);

  return (
    <div className="w-full h-[calc(100%-3rem)] relative overflow-hidden">
       {/* Desktop Icons could go here */}
       
       {/* Windows */}
       {apps.map(app => (
         <Window key={app.id} app={app} />
       ))}
    </div>
  );
};