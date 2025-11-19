import { useDesktopStore } from '@/store/useDesktopStore';
import { Window } from './Window';
import { About } from '@/components/apps/About';
import { Terminal } from '@/components/apps/Terminal';
import { VSCode } from '@/components/apps/VSCode';
import { Chrome } from '@/components/apps/Chrome';
import { Settings } from '@/components/apps/Settings';
import { Dolphin } from '@/components/apps/Dolphin';
import { Gedit } from '@/components/apps/Gedit';
import { ImageViewer } from '@/components/apps/ImageViewer';
import { Music } from '@/components/apps/Music';

export const Desktop = () => {
  const apps = useDesktopStore(state => state.apps);

  const getComponent = (name: string) => {
    switch (name) {
        case 'About': return About;
        case 'Terminal': return Terminal;
        case 'VSCode': return VSCode;
        case 'Chrome': return Chrome;
        case 'Settings': return Settings;
        case 'Dolphin': return Dolphin;
        case 'Gedit': return Gedit;
        case 'ImageViewer': return ImageViewer;
        case 'Music': return Music;
        default: return null;
    }
  };

  return (
    <div className="w-full h-[calc(100%-3rem)] relative overflow-hidden">
       {/* Windows */}
       {apps.map(app => {
         const Component = getComponent(app.component);
         return (
             <Window key={app.id} app={app}>
                 {Component ? <Component /> : (
                     <div className="w-full h-full flex items-center justify-center text-gray-500">
                         Not Implemented
                     </div>
                 )}
             </Window>
         );
       })}
    </div>
  );
};
