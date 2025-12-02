'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/Icon';

const TABS = [
  { name: 'Kernel', icon: 'settings' },
  { name: 'Keyboard Settings', icon: 'settings-keyboard' },
  { name: 'Locale', icon: 'locale' },
  { name: 'Time and Date', icon: 'settings-time' },
  { name: 'User Accounts', icon: 'settings-user' },
];

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('Kernel');

  return (
    <div className="flex flex-col w-full h-full text-white bg-[#262626]">
      {/* Header */}
      <div className="flex bg-[#31363b] border-b border-gray-500 w-full h-10 items-center">
        <div className="w-[30%] h-full flex items-center px-2 border-r border-gray-500">
           <input className="w-[80%] bg-zinc-700 text-white px-1 text-sm rounded outline-none" placeholder="Search..." />
        </div>
        <div className="w-[70%] h-full flex items-center px-4">
           <span className="text-lg">{activeTab}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[30%] h-full border-r border-gray-600 bg-[#2a2e32] overflow-y-auto pt-2">
          {TABS.map(tab => (
            <div
              key={tab.name}
              className={`flex items-center px-4 py-2 cursor-pointer transition-colors duration-200 
                ${activeTab === tab.name ? 'bg-[#3daee9]/30 border-l-4 border-[#3daee9]' : 'hover:bg-white/5 border-l-4 border-transparent'}`}
              onClick={() => setActiveTab(tab.name)}
            >
              <Icon name={tab.icon} size={22} className="mr-3 opacity-80" />
              <span className="text-sm font-medium tracking-wide">{tab.name}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="w-[70%] h-full p-8 overflow-y-auto bg-[#262626]">
          {activeTab === 'Kernel' && (
            <div className="flex flex-col items-center w-full animate-fadeIn">
              <div className="flex flex-col items-center mb-10">
                 <div className="p-4 bg-white/5 rounded-full mb-4 shadow-lg">
                    <Icon name="manjaro" size={96} />
                 </div>
                 <div className="flex flex-col items-center">
                    <b className="text-3xl font-light tracking-tight">Manjaro Linux</b>
                    <a href="https://manjaro.org" target="_blank" rel="noopener noreferrer" className="text-[#3daee9] text-sm mt-1 hover:underline opacity-80 hover:opacity-100 transition-opacity">
                      https://manjaro.org/
                    </a>
                 </div>
              </div>

              <div className="flex flex-col gap-px w-[90%] max-w-lg bg-gray-700/30 rounded-lg overflow-hidden border border-gray-600/50">
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
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                  <Icon name="settings" size={64} className="opacity-20" />
                  <span className="text-lg font-light">Settings for {activeTab} not implemented.</span>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between p-3 bg-[#262626]/50 hover:bg-[#262626] transition-colors border-b border-gray-700/50 last:border-none">
    <span className="text-gray-400 text-sm font-medium">{label}</span>
    <span className="text-gray-200 text-sm">{value}</span>
  </div>
);
