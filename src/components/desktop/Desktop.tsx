import { useDesktopStore } from '@/store/useDesktopStore';
import { Icon } from '@/components/Icon';

export const Desktop = () => {
  const apps = useDesktopStore(state => state.apps);

  return (
    <div className="w-full h-[calc(100%-3rem)] relative overflow-hidden">
       {/* Windows */}
       {apps.map(app => (
         app.isOpen && (
            <div 
              key={app.id}
              className="absolute bg-gray-800 text-white border border-gray-600 rounded shadow-lg flex items-center justify-center"
              style={{
                 left: app.position.x,
                 top: app.position.y,
                 width: app.size.width,
                 height: app.size.height,
                 zIndex: app.zIndex,
                 display: app.isMinimized ? 'none' : 'flex'
              }}
            >
               <div className="flex flex-col items-center">
                  <Icon name={app.icon} size={64} />
                  <h2 className="text-xl mt-4">{app.name}</h2>
                  <p className="text-gray-400">Placeholder Component</p>
               </div>
            </div>
         )
       ))}
    </div>
  );
};
