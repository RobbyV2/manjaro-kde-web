import { useState } from 'react';
import { Icon } from '@/components/Icon';
import clsx from 'clsx';

const SettingsTabs = ['Kernel', 'Keyboard Settings', 'Locale', 'Time and Date', 'User Accounts'];

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('Kernel');

  return (
    <div className="w-full h-full flex flex-col text-white bg-[#2b2e33]">
       {/* Header */}
       <div className="h-10 bg-[#31363b] border-b border-gray-600 flex items-center">
          <div className="w-[30%] h-full border-r border-gray-600 flex items-center px-2">
             <input className="w-full bg-[#212121] border border-gray-500 rounded px-2 py-0.5 text-sm outline-none focus:border-[#44bbff]" placeholder="Search..." />
          </div>
          <div className="w-[70%] h-full flex items-center px-4 text-lg font-light">
             {activeTab}
          </div>
       </div>

       {/* Body */}
       <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-[30%] h-full border-r border-gray-600 bg-[#2b2e33] flex flex-col">
             {SettingsTabs.map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={clsx(
                   "flex items-center px-2 py-2 hover:bg-[#7dcfff]/20 transition-colors text-left",
                   activeTab === tab && "bg-[#44bbff]/50"
                 )}
               >
                  <Icon name={getIconForTab(tab)} size={20} className="mr-3" />
                  <span className="text-sm">{tab}</span>
               </button>
             ))}
          </div>

          {/* Content */}
          <div className="w-[70%] h-full p-8 overflow-y-auto bg-[#2b2e33]">
             {activeTab === 'Kernel' && (
               <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-4 mb-4">
                     <Icon name="manjaro" size={96} />
                     <div className="flex flex-col">
                        <span className="text-2xl font-bold">Manjaro Linux</span>
                        <a href="https://manjaro.org" target="_blank" className="text-[#2980b9] hover:underline">https://manjaro.org/</a>
                     </div>
                  </div>

                  <div className="w-full max-w-md space-y-2 text-sm">
                     <InfoRow label="KDE Plasma Version:" value="5.21.4" />
                     <InfoRow label="KDE Frameworks Version:" value="5.81.0" />
                     <InfoRow label="Qt Version:" value="5.15.2" />
                     <InfoRow label="Kernel Version:" value="5.10.34-1-MANJARO" />
                     <InfoRow label="OS Type:" value="64-bit" />
                     <InfoRow label="Graphics Platform:" value="X11" />
                  </div>
               </div>
             )}
             {activeTab !== 'Kernel' && (
                 <div className="flex flex-col items-center justify-center h-full text-gray-500">
                     <Icon name="settings" size={64} className="opacity-20 mb-4" />
                     <p>Not implemented yet.</p>
                 </div>
             )}
          </div>
       </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex">
        <span className="w-1/2 text-right text-gray-400 pr-4">{label}</span>
        <span className="w-1/2 text-left font-medium">{value}</span>
    </div>
);

const getIconForTab = (tab: string) => {
    switch (tab) {
        case 'Kernel': return 'settings';
        case 'Keyboard Settings': return 'settings-keyboard';
        case 'Locale': return 'locale';
        case 'Time and Date': return 'settings-time';
        case 'User Accounts': return 'settings-user';
        default: return 'settings';
    }
};
