import { useState } from 'react';
import { Icon } from '@/components/Icon';
import clsx from 'clsx';

export const Chrome = () => {
  const [tabs, setTabs] = useState(['https://www.google.com/search?igu=1', 'https://blog.yunyuyuan.net']);
  const [activeIdx, setActiveIdx] = useState(0);
  const [url, setUrl] = useState(tabs[0]);

  const handleCloseTab = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Prevent closing last tab for now
    const newTabs = tabs.filter((_, i) => i !== idx);
    setTabs(newTabs);
    if (activeIdx >= newTabs.length) setActiveIdx(newTabs.length - 1);
  };

  const handleAddTab = () => {
      setTabs([...tabs, 'https://www.google.com/search?igu=1']);
      setActiveIdx(tabs.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          const newTabs = [...tabs];
          newTabs[activeIdx] = url;
          setTabs(newTabs);
      }
  };

  // Update url input when switching tabs
  if (tabs[activeIdx] !== url && document.activeElement?.tagName !== 'INPUT') {
     setUrl(tabs[activeIdx]);
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
       {/* Tabs */}
       <div className="w-full bg-[#e7eaed] pt-1 flex items-end overflow-x-auto">
          {tabs.map((tab, idx) => (
             <div 
               key={idx}
               onClick={() => { setActiveIdx(idx); setUrl(tab); }}
               className={clsx(
                 "group flex items-center w-32 px-3 py-2 rounded-t-lg cursor-pointer text-xs select-none border-r border-gray-400/20 relative",
                 activeIdx === idx ? "bg-white shadow-[0_-2px_4px_rgba(0,0,0,0.1)] z-10" : "hover:bg-gray-200"
               )}
             >
                <span className="truncate flex-1">Tab {idx + 1}</span>
                <button onClick={(e) => handleCloseTab(e, idx)} className="p-1 rounded-full hover:bg-gray-300 ml-1 opacity-0 group-hover:opacity-100">
                   <Icon name="close" size={8} />
                </button>
             </div>
          ))}
          <button onClick={handleAddTab} className="p-1.5 ml-1 mb-1 rounded-full hover:bg-gray-300">
              <Icon name="close" size={12} className="rotate-45" />
          </button>
       </div>

       {/* Address Bar */}
       <div className="w-full p-1.5 border-b border-gray-200 flex">
          <input 
            className="w-full bg-[#f1f3f4] rounded-full px-4 py-1.5 text-sm outline-none border border-transparent focus:border-blue-500 focus:bg-white transition-colors"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
          />
       </div>

       {/* Content */}
       <div className="flex-1 relative">
          <iframe 
            src={tabs[activeIdx]} 
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
       </div>
    </div>
  );
};
