import { useState, useEffect } from 'react';
import { Icon } from '@/components/Icon';
import clsx from 'clsx';

type TrayView = 'paste' | 'volume' | 'bluetooth' | 'wifi' | 'arrow' | '';

interface SystemTrayPopupProps {
  view: TrayView;
  onClose: () => void;
}

export const SystemTrayPopup = ({ view, onClose }: SystemTrayPopupProps) => {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [btEnabled, setBtEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  const [clipboard, setClipboard] = useState<string[]>([]);

  useEffect(() => {
    const handleCopy = () => {
        const text = window.getSelection()?.toString();
        if (text) {
            setClipboard(prev => [text, ...prev].slice(0, 10));
        }
    };
    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, []);

  if (!view) return null;

  const getTitle = () => {
    switch (view) {
      case 'paste': return 'Clipboard';
      case 'volume': return 'Audio Volume';
      case 'bluetooth': return 'Bluetooth';
      case 'wifi': return 'Networks';
      case 'arrow': return 'Status and Notification';
      default: return '';
    }
  };

  return (
    <div className="absolute bottom-14 right-2 w-[20rem] h-[15rem] bg-[#2b2e33] rounded shadow-[0_0_1rem_rgba(0,0,0,0.4)] flex flex-col overflow-hidden z-50 text-white animate-in slide-in-from-bottom-2 duration-200">
       {/* Header */}
       <div className="h-[18%] bg-[#303439] flex items-center px-3">
          <Icon name="arrow" size={16} className="mr-3 -rotate-90" />
          <span className="text-lg">{getTitle()}</span>
       </div>

       {/* Body */}
       <div className="h-[82%] p-3 overflow-y-auto">
          
          {/* Clipboard */}
          {view === 'paste' && (
            <div className="flex flex-col h-full">
               {clipboard.length === 0 ? (
                 <div className="m-4 text-base font-bold text-gray-400">Nothing in Clipboard</div>
               ) : (
                 clipboard.map((item, idx) => (
                   <div key={idx} className="py-2 border-b border-[#4b4b4b] text-xs truncate last:border-none">
                     {item}
                   </div>
                 ))
               )}
            </div>
          )}

          {/* Volume */}
          {view === 'volume' && (
            <div className="flex flex-col h-full">
               <p className="mb-2 text-base">Speaker</p>
               <div className="flex items-center gap-3">
                  <Icon name={volume === 0 ? 'audio-volume-muted' : volume < 50 ? 'audio-volume-low' : 'audio-volume-high'} size={26} />
                  <div className="flex-1 h-2 bg-[#555555] rounded-full relative group cursor-pointer">
                     <input 
                       type="range" 
                       min="0" 
                       max="100" 
                       value={volume} 
                       onChange={(e) => setVolume(Number(e.target.value))}
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                     />
                     <div 
                       className="h-full bg-[#0091e7] rounded-full pointer-events-none" 
                       style={{ width: `${volume}%` }}
                     />
                     <div 
                       className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-[#2b2e33] border border-gray-400 rounded-full hover:border-[#0091e7] transition-colors pointer-events-none"
                       style={{ left: `calc(${volume}% - 10px)` }}
                     />
                  </div>
                  <span className="w-10 text-center text-sm">{volume}%</span>
               </div>
            </div>
          )}

          {/* Bluetooth */}
          {view === 'bluetooth' && (
             <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                   <button 
                     onClick={() => setBtEnabled(!btEnabled)}
                     className={clsx(
                       "w-4 h-4 border rounded flex items-center justify-center transition-colors",
                       btEnabled ? "border-[#0091e7] bg-transparent" : "border-[#0091e7]"
                     )}
                   >
                      {btEnabled && <div className="w-2.5 h-2.5 bg-[#0091e7] rounded-sm" />}
                   </button>
                   <Icon name="bluetooth" size={24} className="ml-auto" />
                </div>

                {!btEnabled ? (
                   <div className="mt-4 text-center text-base">Please Enable Bluetooth!</div>
                ) : (
                   <div className="flex flex-col gap-2">
                      <div className="text-xs text-gray-400 mb-2">Available Devices</div>
                      {[
                        { name: 'Air Pods', icon: 'earphone' },
                        { name: 'My iPhone', icon: 'phone' }
                      ].map((device) => (
                        <div key={device.name} className="flex items-center justify-between p-1 rounded hover:bg-[#44bbff]/20 hover:border-[#44bbff] border border-transparent transition-colors group cursor-default">
                           <div className="flex items-center gap-2">
                              <Icon name={device.icon} size={32} />
                              <span className="text-sm">{device.name}</span>
                           </div>
                           <button className="px-2 py-1 border border-transparent rounded hover:bg-[#44bbff]/20 hover:border-[#44bbff] flex items-center gap-1 text-xs">
                              <Icon name="connect" size={16} />
                              Connect
                           </button>
                        </div>
                      ))}
                   </div>
                )}
             </div>
          )}

          {/* WiFi */}
          {view === 'wifi' && (
             <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                   <button 
                     onClick={() => setWifiEnabled(!wifiEnabled)}
                     className={clsx(
                       "w-4 h-4 border rounded flex items-center justify-center transition-colors",
                       wifiEnabled ? "border-[#0091e7] bg-transparent" : "border-[#0091e7]"
                     )}
                   >
                      {wifiEnabled && <div className="w-2.5 h-2.5 bg-[#0091e7] rounded-sm" />}
                   </button>
                   <Icon name="wifi" size={24} className="ml-auto" />
                </div>

                {!wifiEnabled ? (
                   <div className="mt-4 text-center text-base">Please Enable Wifi!</div>
                ) : (
                   <div className="flex flex-col gap-2">
                      {['Home', 'Work'].map((net) => (
                        <div key={net} className="flex items-center justify-between p-1 rounded hover:bg-[#44bbff]/20 hover:border-[#44bbff] border border-transparent transition-colors group cursor-default">
                           <div className="flex items-center gap-2">
                              <Icon name="wifi" size={32} />
                              <span className="text-sm">{net}</span>
                           </div>
                           <button className="px-2 py-1 border border-transparent rounded hover:bg-[#44bbff]/20 hover:border-[#44bbff] flex items-center gap-1 text-xs">
                              <Icon name="connect" size={16} />
                              Connect
                           </button>
                        </div>
                      ))}
                   </div>
                )}
             </div>
          )}

          {/* Arrow (Quick Settings) */}
          {view === 'arrow' && (
             <div className="flex flex-wrap content-start gap-2">
                {[
                  { name: 'Notifications', icon: 'notifications' },
                  { name: 'Battery', icon: 'battery' },
                  { name: 'Printers', icon: 'printer' }
                ].map((item) => (
                  <div key={item.name} className="w-[4.6rem] h-[4.6rem] border border-transparent rounded flex flex-col items-center justify-center hover:bg-[#44bbff]/25 hover:border-[#44bbff] transition-colors cursor-default">
                     <Icon name={item.icon} size={32} className="mb-1" />
                     <span className="text-[0.7rem]">{item.name}</span>
                  </div>
                ))}
             </div>
          )}

       </div>
    </div>
  );
};
