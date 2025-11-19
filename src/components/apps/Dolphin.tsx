import { useState } from 'react';
import { Icon } from '@/components/Icon';
import clsx from 'clsx';
import { useDesktopStore } from '@/store/useDesktopStore';
import { dolphinFiles, typeFile } from '@/utils/filesystem';

export const Dolphin = () => {
  const [path, setPath] = useState<string[]>([]); // Empty = Home
  const { openApp, setAppParams } = useDesktopStore();

  // Helper to get files at current path
  const getFilesAtCurrentPath = (): typeFile[] => {
      let current = dolphinFiles;
      for (const p of path) {
          const found = current.find(f => f.name === p && f.isDir);
          if (found && found.sub) {
              current = found.sub;
          } else {
              return [];
          }
      }
      return current;
  };

  const files = getFilesAtCurrentPath();

  const handleDoubleClick = (file: typeFile) => {
      if (file.isDir) {
          setPath([...path, file.name]);
      } else {
          // Open file logic
          const filepath = [...path, file.name].join('/');
          const mime = file.mime;
          
          if (mime.startsWith('image/')) {
              setAppParams('image-viewer', { filepath });
              openApp('image-viewer');
          } else if (mime.startsWith('audio/')) {
              setAppParams('music', { filepath });
              openApp('music');
          } else if (mime === 'text/markdown') {
              setAppParams('gedit', { filepath });
              openApp('gedit');
          }
      }
  };

  const navigateUp = () => {
      if (path.length > 0) {
          setPath(path.slice(0, -1));
      }
  };

  return (
    <div className="w-full h-full flex flex-col text-white bg-[#2b2e33]">
       {/* Toolbar */}
       <div className="h-10 bg-[#31363b] border-b border-gray-600 flex items-center px-2">
          <div className="flex items-center gap-1 mr-4 text-gray-400">
             <button onClick={navigateUp} className="p-1 hover:text-white"><Icon name="arrow" size={14} className="rotate-90" /></button>
             <button className="p-1 hover:text-white"><Icon name="arrow" size={14} className="-rotate-90" /></button>
          </div>
          
          <div className="flex items-center text-sm bg-[#212121]/50 px-2 py-1 rounded flex-1">
             <Icon name="folder-home" size={14} className="mr-2" />
             <span className="text-gray-400">/ home / yunyuyuan / </span>
             <span className="ml-1">{path.join(' / ')}</span>
          </div>
       </div>

       <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-40 bg-[#31363b] flex flex-col p-2 gap-1 text-sm border-r border-gray-600">
             <span className="text-xs text-gray-500 font-bold px-2 mt-2 uppercase">Places</span>
             <SidebarItem icon="folder-home" label="Home" active={path.length === 0} onClick={() => setPath([])} />
             <SidebarItem icon="folder-desktop" label="Desktop" />
             <SidebarItem icon="folder-documents" label="Documents" />
             <SidebarItem icon="folder-download" label="Downloads" />
             <SidebarItem icon="folder-trash" label="Trash" />
          </div>

          {/* Content */}
          <div className="flex-1 p-2 flex flex-wrap content-start gap-2 bg-[#1e1e1e]">
             {files.map((file, i) => (
                 <div 
                   key={i}
                   onDoubleClick={() => handleDoubleClick(file)}
                   className="w-24 h-24 flex flex-col items-center justify-center rounded hover:bg-white/10 cursor-pointer border border-transparent hover:border-gray-600"
                 >
                    <Icon name={getIconForFile(file)} size={48} className="mb-2" />
                    <span className="text-xs text-center px-1 truncate w-full text-white">{file.name}</span>
                 </div>
             ))}
          </div>
       </div>
    </div>
  );
};

const getIconForFile = (file: typeFile) => {
    if (file.isDir) {
        // Simple mapping for known folders
        if (['images', 'musics'].includes(file.name)) return `folder-${file.name === 'images' ? 'image' : 'music'}`;
        return 'folder-home'; // Default folder icon
    }
    const mime = file.mime;
    if (mime.startsWith('image/')) return 'mime-image';
    if (mime.startsWith('audio/')) return 'mime-audio-mpeg';
    if (mime === 'text/markdown') return 'mime-text-markdown';
    return 'file'; // Default file icon (needs svg)
};

const SidebarItem = ({ icon, label, active, onClick }: any) => (
    <div 
      onClick={onClick}
      className={clsx(
        "flex items-center px-2 py-1.5 rounded cursor-pointer transition-colors",
        active ? "bg-[#44bbff]/20 text-[#44bbff]" : "hover:bg-white/5 text-gray-300"
      )}
    >
       <Icon name={icon} size={16} className="mr-3" />
       <span>{label}</span>
    </div>
);
