import { useState, useMemo } from 'react';
import { useDesktopStore } from '@/store/useDesktopStore';
import { Icon } from '@/components/Icon';
import clsx from 'clsx';

interface Category {
  name: string;
  icon: string;
  apps: string[];
}

const appCategories: Category[] = [
  {
    name: 'All Applications',
    icon: 'all-apps',
    apps: ['settings', 'about', 'chrome', 'dolphin', 'terminal', 'vscode', 'image-viewer', 'music', 'gedit']
  },
  {
    name: 'Development',
    icon: 'development',
    apps: ['vscode']
  },
  {
    name: 'Graphics',
    icon: 'graphics',
    apps: ['image-viewer']
  },
  {
    name: 'Internet',
    icon: 'internet',
    apps: ['chrome']
  },
  {
    name: 'Office',
    icon: 'office',
    apps: ['gedit']
  },
  {
    name: 'Settings',
    icon: 'settings',
    apps: ['settings']
  },
  {
    name: 'System',
    icon: 'system',
    apps: ['about', 'terminal', 'dolphin']
  }
];

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StartMenu = ({ isOpen, onClose }: StartMenuProps) => {
  const { apps, openApp } = useDesktopStore();
  const [activeCategory, setActiveCategory] = useState<Category>(appCategories[0]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'applications' | 'places'>('applications');

  const filteredApps = useMemo(() => {
    if (search.trim()) {
      return apps.filter(app => app.name.toLowerCase().includes(search.toLowerCase()));
    }
    return activeCategory.apps
      .map(id => apps.find(a => a.id === id))
      .filter((a): a is NonNullable<typeof a> => !!a);
  }, [search, activeCategory, apps]);

  const handleAppClick = (id: string) => {
    openApp(id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-12 left-0 w-[45rem] h-[30rem] bg-[#2b2e33] border border-[#323232] rounded-tr-md shadow-2xl flex flex-col overflow-hidden z-50 text-white font-sans">
      {/* Header */}
      <div className="h-[3.2rem] bg-[#303439] flex items-center">
        <div className="w-[40%] flex items-center px-2">
           <button className="p-1.5 mx-2 rounded-full hover:border-gray-500 border border-transparent transition-colors">
              <Icon name="user" size={26} />
           </button>
           <span className="font-bold text-base ml-2">hitu</span>
        </div>
        <div className="w-[60%] h-full border-l border-[#424242] flex items-center">
           <input 
             type="text" 
             placeholder="Search..." 
             value={search}
             onChange={e => setSearch(e.target.value)}
             className="w-full h-full bg-transparent px-4 outline-none text-white placeholder-gray-500"
             autoFocus
           />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex border-t border-[#545454] overflow-hidden">
        {/* Categories */}
        <div className="w-[40%] border-r border-[#424242] p-4 overflow-y-auto flex flex-col gap-1">
           {appCategories.map(cat => (
             <button
               key={cat.name}
               onMouseEnter={() => setActiveCategory(cat)}
               className={clsx(
                 "flex items-center px-2 py-2 rounded transition-colors text-sm",
                 activeCategory.name === cat.name 
                   ? "bg-[rgba(68,187,255,0.25)] border border-[#44bbff]" 
                   : "hover:bg-white/5 border border-transparent"
               )}
             >
               <Icon name={cat.icon} size={22} className="mr-4" />
               <span>{cat.name}</span>
               <Icon name="triangle" size={12} className="ml-auto opacity-60 -rotate-90" />
             </button>
           ))}
        </div>

        {/* App Grid */}
        <div className="w-[60%] p-4 flex flex-wrap content-start gap-2 overflow-y-auto">
           {filteredApps.map(app => (
             <button
               key={app.id}
               onClick={() => handleAppClick(app.id)}
               className="flex flex-col items-center justify-center w-[5.6rem] h-[5.6rem] rounded hover:bg-white/5 hover:border hover:border-[#44bbff]/50 transition-colors"
             >
                <Icon name={app.icon} size={48} className="mb-2" />
                <span className="text-xs text-center line-clamp-2 px-1">{app.name}</span>
             </button>
           ))}
        </div>
      </div>

      {/* Footer */}
      <div className="h-[3.2rem] bg-[#2a2e32] flex items-center text-sm">
        <div className="w-[40%] h-full flex relative">
           <button 
             className="flex-1 flex items-center justify-center hover:bg-white/5 transition-colors"
             onClick={() => setActiveTab('applications')}
           >
              <Icon name="applications" size={24} className="mr-2" />
              <span>Applications</span>
           </button>
           <button 
             className="flex-1 flex items-center justify-center hover:bg-white/5 transition-colors"
             onClick={() => setActiveTab('places')}
           >
              <Icon name="compass" size={24} className="mr-2" />
              <span>Places</span>
           </button>
           
           {/* Active Tab Indicator */}
           <div 
             className="absolute top-0 left-0 w-1/2 h-full bg-[rgba(255,255,255,0.02)] border-t-2 border-[#44bbff] pointer-events-none transition-transform duration-200"
             style={{ transform: activeTab === 'places' ? 'translateX(100%)' : 'translateX(0)' }}
           />
        </div>

        <div className="w-[60%] h-full border-l border-[#424242] flex items-center justify-end px-2">
           <button className="flex items-center px-2 py-1 mx-1 rounded hover:border-[#44bbff] border border-transparent transition-colors">
              <Icon name="system-suspend" size={20} className="mr-1.5" />
              <span>Sleep</span>
           </button>
           <button className="flex items-center px-2 py-1 mx-1 rounded hover:border-[#44bbff] border border-transparent transition-colors">
              <Icon name="system-reboot" size={20} className="mr-1.5" />
              <span>Restart</span>
           </button>
           <button className="flex items-center px-2 py-1 mx-1 rounded hover:border-[#44bbff] border border-transparent transition-colors">
              <Icon name="system-shutdown" size={20} className="mr-1.5" />
              <span>Shut Down</span>
           </button>
        </div>
      </div>
    </div>
  );
};
