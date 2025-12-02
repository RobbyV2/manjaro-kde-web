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
        <div className="w-[30%] h-full border-r border-gray-500 overflow-y-auto">
          {TABS.map(tab => (
            <div
              key={tab.name}
              className={`flex items-center p-2 border-b border-gray-500/30 cursor-pointer hover:bg-[#7dcfff33] ${activeTab === tab.name ? 'bg-[#44bbff88]' : ''}`}
              onClick={() => setActiveTab(tab.name)}
            >
              <Icon name={tab.icon} size={24} className="mr-2" />
              <span className="text-sm">{tab.name}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="w-[70%] h-full p-4 overflow-y-auto bg-[#262626]">
          {activeTab === 'Kernel' && (
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-col items-center my-8">
                 <Icon name="manjaro" size={112} />
                 <div className="flex flex-col items-center mt-4">
                    <b className="text-2xl">Manjaro Linux</b>
                    <a href="https://manjaro.org" target="_blank" rel="noopener noreferrer" className="text-[#2980b9] text-sm mt-2 hover:underline">
                      https://manjaro.org/
                    </a>
                 </div>
              </div>

              <div className="flex flex-col gap-2 w-[80%] max-w-md">
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
              <div className="flex items-center justify-center h-full text-gray-500">
                  Settings for {activeTab} not implemented.
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex text-sm">
    <span className="w-1/2 text-right text-gray-400 mr-4">{label}</span>
    <span className="w-1/2 text-left">{value}</span>
  </div>
);
