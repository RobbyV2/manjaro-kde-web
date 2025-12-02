'use client';

import React, { useState } from 'react';
import { dolphinFiles, typeFile } from '@/data/filesystem';
import { Icon } from '@/components/Icon';
import { useAppStore } from '@/store/useAppStore';

// Dolphin File Manager

const SIDEBAR_ITEMS = [
  { name: 'Home', icon: 'folder-home', path: [] },
  { name: 'Desktop', icon: 'folder-desktop', path: ['Desktop'] },
  { name: 'Documents', icon: 'folder-documents', path: ['Documents'] },
  { name: 'Downloads', icon: 'folder-download', path: ['Downloads'] },
  { name: 'Music', icon: 'folder-music', path: ['Music'] },
  { name: 'Pictures', icon: 'folder-image', path: ['Pictures'] },
  { name: 'Videos', icon: 'folder-video', path: ['Videos'] },
  { name: 'Trash', icon: 'folder-trash', path: [] }, // Trash usually separate logic
];

export const Dolphin = () => {
  const { openApp } = useAppStore();
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [history, setHistory] = useState<string[][]>([[]]);
  const [hisIdx, setHisIdx] = useState(0);

  // Helper to get files at current path
  const getFiles = (path: string[]): typeFile[] => {
    let current = dolphinFiles as typeFile[];
    for (const p of path) {
      const dir = current.find(f => f.isDir && f.name === p);
      if (dir && dir.sub) {
        current = dir.sub;
      } else {
        return [];
      }
    }
    return current;
  };

  const files = getFiles(currentPath);

  const navigate = (path: string[]) => {
     // If new path is different
     if (JSON.stringify(path) !== JSON.stringify(currentPath)) {
         const newHistory = history.slice(0, hisIdx + 1);
         newHistory.push(path);
         setHistory(newHistory);
         setHisIdx(newHistory.length - 1);
         setCurrentPath(path);
     }
  };

  const goBack = () => {
    if (hisIdx > 0) {
      setHisIdx(hisIdx - 1);
      setCurrentPath(history[hisIdx - 1]);
    }
  };

  const goForward = () => {
      if (hisIdx < history.length - 1) {
          setHisIdx(hisIdx + 1);
          setCurrentPath(history[hisIdx + 1]);
      }
  };
  
  const goUp = () => {
      if (currentPath.length > 0) {
          navigate(currentPath.slice(0, -1));
      }
  };

  const handleItemClick = (file: typeFile) => {
    if (file.isDir) {
      navigate([...currentPath, file.name]);
    } else {
      // Open file
      // Simplified mime check
      const pathStr = [...currentPath, file.name].join("/");
      if (file.mime === "text/markdown") {
          openApp("gedit", { filepath: pathStr });
      } else if (file.mime === "audio/mpeg") {
          openApp("music", { filepath: pathStr });
      } else if (file.mime.startsWith("image/")) {
          openApp("image viewer", { filepath: pathStr });
      }
    }
  };

  const getIconName = (file: typeFile) => {
      if (file.isDir) {
          // Try to map folder names to icons
          const map: {[key:string]: string} = {
              "Desktop": "folder-desktop",
              "Documents": "folder-documents",
              "Downloads": "folder-download",
              "Music": "folder-music",
              "Pictures": "folder-image",
              "Videos": "folder-video"
          };
          return map[file.name] || "folder-home"; // default folder
      }
      // File icons based on mime
      if (file.mime === "text/markdown") return "mime-text-markdown";
      if (file.mime === "audio/mpeg") return "mime-audio-mpeg";
      if (file.mime.startsWith("image/")) return "mime-image";
      return "file"; // generic
  };

  return (
    <div className="flex flex-col w-full h-full text-[#eff0f1] bg-[#262626]">
       {/* Toolbar */}
       <div className="flex items-center h-12 bg-[#31363b] border-b border-gray-600 px-2 gap-2">
         <button onClick={goBack} disabled={hisIdx <= 0} className="p-1 disabled:opacity-30 hover:bg-white/10 rounded">
             <Icon name="arrow" size={16} className="transform rotate-180 fill-white" />
         </button>
         <button onClick={goForward} disabled={hisIdx >= history.length - 1} className="p-1 disabled:opacity-30 hover:bg-white/10 rounded">
             <Icon name="arrow" size={16} className="fill-white" />
         </button>
         <button onClick={goUp} disabled={currentPath.length === 0} className="p-1 disabled:opacity-30 hover:bg-white/10 rounded ml-2">
             <Icon name="arrow" size={16} className="transform -rotate-90 fill-white" />
         </button>
         
         <div className="flex-1 bg-[#262626] border border-gray-500 rounded px-2 py-1 text-sm ml-4">
            /{currentPath.join("/")}
         </div>
         
         <div className="p-1 hover:bg-white/10 rounded ml-2">
             <Icon name="view-list-icons" size={20} />
         </div>
         <div className="p-1 hover:bg-white/10 rounded">
             <Icon name="view-list-details" size={20} />
         </div>
       </div>

       {/* Body */}
       <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 bg-[#31363b] border-r border-gray-600 flex flex-col py-2">
             <div className="px-2 text-gray-400 text-xs mb-1 uppercase font-semibold">Places</div>
             {SIDEBAR_ITEMS.map((item) => (
                 <div 
                   key={item.name} 
                   className="flex items-center px-4 py-1.5 hover:bg-[#3daee9]/30 cursor-pointer"
                   onClick={() => navigate(item.path)}
                 >
                    <Icon name={item.icon} size={20} className="mr-3" />
                    <span className="text-sm">{item.name}</span>
                 </div>
             ))}
          </div>

          {/* File Grid */}
          <div className="flex-1 bg-[#1b1e20] p-4 overflow-y-auto">
             <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
                {files.map((file) => (
                    <div 
                      key={file.name} 
                      className="flex flex-col items-center justify-start p-2 hover:bg-[#3daee9]/30 rounded cursor-pointer group"
                      onClick={() => handleItemClick(file)}
                    >
                       <Icon name={getIconName(file)} size={48} className="mb-2 drop-shadow-lg" />
                       <span className="text-xs text-center break-words w-full px-1 line-clamp-2">{file.name}</span>
                    </div>
                ))}
             </div>
             {files.length === 0 && (
                 <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                     Empty Folder
                 </div>
             )}
          </div>
       </div>
    </div>
  );
};
