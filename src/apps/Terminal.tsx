'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { dolphinFiles, typeFile } from '@/data/filesystem';
import { escapeHtml } from '@/utils/utils';

// Helper for opening apps from terminal
// In Vue ref it used `openApp.call(this, ...)` which accessed the store/mixin.
// We can use the store hook.

const HELPS = [
  ["ls", "list files or folders"],
  ["cd <dir>", "change current directory to dir"],
  ["clear", "clear screen"],
  ["pwd", "print work directory"],
  ["xdg-open <file>", "open a file"],
  ["poweroff", "close manjaro"],
  ["reboot", "reboot manjaro"],
];

export const Terminal = () => {
  const { setPowerState, openApp } = useAppStore();
  const [history, setHistory] = useState<string[]>([]);
  const [cmds, setCmds] = useState<Array<[string, string, string?]>>([]); // [type, content, dirStr?]
  const [input, setInput] = useState("");
  const [dir, setDir] = useState<string[]>([]);
  const [hisIdx, setHisIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Computed equivalents
  const cmdLis = input.trim().split(/\s+/);
  const dirStr = dir.length ? dir.join("/") : "~";

  const getFilesNow = () => {
    const parent = dolphinFiles as typeFile[];
    // Traverse
    // Note: filesystem.ts export might need check.
    // Assuming dolphinFiles is array of roots.
    // If dir is empty, we are at root? Vue ref says:
    // while (idx < this.dir.length) { parent = parent.find... }
    // If dir is [], it returns dolphinFiles (root).
    
    let current = parent;
    for (const d of dir) {
        const found = current.find(v => v.isDir && v.name === d);
        if (found && found.sub) {
            current = found.sub;
        } else {
            return []; // Should not happen if logic is correct
        }
    }
    return current;
  };

  const filesNow = getFilesNow();
  const dirsNow = filesNow.filter(v => v.isDir);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [cmds]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const focusInput = () => inputRef.current?.focus();

  const pushCmd = (cmd: string) => {
    setCmds(prev => [...prev, ["cmd", cmd, dirStr]]);
  };

  const processCmd = () => {
    if (input.trim() !== "") {
      setHistory(prev => [...prev, input]);
    }
    setHisIdx(-1);

    const command = cmdLis[0];
    const args = cmdLis.slice(1);
    
    pushCmd(input);

    switch (command) {
      case "":
        break;
      case "help":
        setCmds(prev => [...prev, ["out", HELPS.map(v => `<p>${escapeHtml(v[0])}</p>${escapeHtml(v[1])}\n`).join("")]]);
        break;
      case "ls":
        setCmds(prev => [...prev, ["out", filesNow.map(v => v.isDir ? `<span class="text-[#44bbff]">${v.name}</span>` : v.name).join("\n")]]);
        break;
      case "poweroff":
        setPowerState('shutdown');
        break;
      case "reboot":
        setPowerState('reboot');
        break;
      case "cd":
        if (args.length > 1) {
            setCmds(prev => [...prev, ["out", 'command "cd" only take one argument']]);
        } else {
            const target = args[0];
             if (target && target.includes("/")) {
                setCmds(prev => [...prev, ["out", "No support for multiple dir currently"]]);
             } else {
                 switch (target) {
                     case undefined:
                     case "~":
                         setDir([]);
                         break;
                     case "..":
                         setDir(prev => prev.length > 0 ? prev.slice(0, -1) : prev);
                         break;
                     case ".":
                         break;
                     default:
                         if (dirsNow.find(v => v.name === target)) {
                             setDir(prev => [...prev, target]);
                         } else {
                             setCmds(prev => [...prev, ["out", "Unknown folder: " + target]]);
                         }
                         break;
                 }
             }
        }
        break;
      case "clear":
        setCmds([]);
        return; // Return early to avoid clearing being overwritten or weird state? No, setCmds([]) clears it.
        // Wait, pushCmd was called before switch. So the command "clear" is added, then cleared immediately. 
        // Logic in Vue: this.cmds = []; (clears everything).
        // React: setCmds([]) will clear.
        // But pushCmd uses callback... wait.
        // pushCmd calls setCmds(prev => ...).
        // setCmds([]) calls setCmds.
        // React batches. If I call setCmds twice, the second one might overwrite or they might conflict if I don't be careful.
        // Better to not pushCmd if clear? Or just clear.
        break;
      case "pwd":
        setCmds(prev => [...prev, ["out", dirStr]]);
        break;
      case "date":
        setCmds(prev => [...prev, ["out", new Date().toString()]]);
        break;
      case "whoami":
        setCmds(prev => [...prev, ["out", "user"]]);
        break;
      case "xdg-open":
        if (args.length !== 1) {
             setCmds(prev => [...prev, ["out", 'command "xdg-open" only take one argument']]);
        } else {
            const fileName = args[0];
            const file = filesNow.find(v => !v.isDir && v.name === fileName);
            if (file) {
                 // Logic to open app
                 // mime type check
                 // For now, simplify mapping
                 // Vue ref: text/markdown -> gedit, audio/mpeg -> music, image/* -> image viewer
                 // And passes filepath param.
                 const path = dir.concat([file.name]).join("/");
                 const mime = file.mime;
                 
                 if (mime === "text/markdown") {
                     openApp("gedit", { filepath: path });
                 } else if (mime === "audio/mpeg") {
                     openApp("music", { filepath: path });
                 } else if (mime.startsWith("image/")) {
                     openApp("image viewer", { filepath: path });
                 } else {
                     setCmds(prev => [...prev, ["out", `Cannot open file type: ${mime}`]]);
                 }
            } else {
                setCmds(prev => [...prev, ["out", 'No such file: "' + fileName + '"']]);
            }
        }
        break;
      default:
         setCmds(prev => [...prev, ["out", 'Unknown command: "' + input + '"']]);
         break;
    }
    
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        processCmd();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (hisIdx === -1) {
            if (history.length > 0) {
                setHisIdx(history.length - 1);
                setInput(history[history.length - 1]);
            }
        } else if (hisIdx > 0) {
            setHisIdx(prev => prev - 1);
            setInput(history[hisIdx - 1]);
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (hisIdx !== -1) {
             if (hisIdx < history.length - 1) {
                 setHisIdx(prev => prev + 1);
                 setInput(history[hisIdx + 1]);
             } else {
                 setHisIdx(-1);
                 setInput("");
             }
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        // Auto complete logic
        const command = cmdLis[0];
        if (!command) {
             // help hint
        } else if (command === 'cd') {
             const partial = cmdLis[1] || "";
             const matches = dirsNow.filter(d => d.name.startsWith(partial));
             if (matches.length === 1) {
                 setInput(`cd ${matches[0].name}`);
             } else if (matches.length > 1) {
                 // show options? 
                 // In Vue it appends to cmds.
                 pushCmd(input);
                 setCmds(prev => [...prev, ["out", matches.map(m => m.name).join("\t")]]);
             }
        }
        // ... more autocomplete logic could be added
    }
  };

  return (
    <div 
      className="w-full h-full bg-[#1e2229] text-white p-2 font-mono text-xs overflow-auto" 
      onClick={focusInput}
      ref={containerRef}
    >
      <p className="p-2 text-[0.8rem]">{'> Enjoy the fake terminal 😆. And there have an Easter Egg.'}</p>
      
      {cmds.map((item, idx) => (
        <div key={idx} className="flex flex-wrap items-center pt-1">
          {item[0] === 'cmd' && (
             <b className="whitespace-nowrap shrink-0 text-[#59a850] mr-1.5">
               [user@manjaro <span className="text-white">{item[2]}</span>]$
             </b>
          )}
          <span 
            className={`whitespace-pre-wrap break-all ${item[0] === 'cmd' ? 'text-[#13cba8]' : 'w-[calc(100%-1.2rem)] px-2'}`}
            dangerouslySetInnerHTML={{ __html: item[1] }} 
          />
        </div>
      ))}

      <div className="flex items-center pt-1">
        <b className="whitespace-nowrap shrink-0 text-[#59a850] mr-1.5">
           [user@manjaro <span className="text-white">{dirStr}</span>]$
        </b>
        <input
          ref={inputRef}
          className="bg-transparent grow outline-none border-none text-white font-mono text-xs"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
      </div>
    </div>
  );
};
