import { useState, useRef, useEffect } from 'react';
import { dolphinFiles, typeFile } from '@/utils/filesystem';
import { useDesktopStore } from '@/store/useDesktopStore';

export const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [output, setOutput] = useState<{ type: 'cmd' | 'out', content: string, dir?: string }[]>([]);
  const [dir, setDir] = useState<string[]>([]); // Empty = Home
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { openApp, setAppParams } = useDesktopStore();

  const dirStr = dir.length ? dir.join('/') : '~';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCmd();
    }
  };

  const getFilesAtCurrentPath = (): typeFile[] => {
      let current = dolphinFiles;
      for (const p of dir) {
          const found = current.find(f => f.name === p && f.isDir);
          if (found && found.sub) {
              current = found.sub;
          } else {
              return [];
          }
      }
      return current;
  };

  const processCmd = () => {
    if (!input.trim()) {
        setOutput([...output, { type: 'cmd', content: '', dir: dirStr }]);
        setInput('');
        return;
    }

    const cmd = input.trim();
    const parts = cmd.split(/\s+/);
    const newOutput: { type: 'cmd' | 'out', content: string, dir?: string }[] = [...output, { type: 'cmd', content: cmd, dir: dirStr }];

    switch (parts[0]) {
      case 'help':
        newOutput.push({ type: 'out', content: 'ls - list files\ncd <dir> - change directory\nclear - clear screen\npwd - print working directory\nxdg-open <file> - open file' });
        break;
      case 'ls':
        const files = getFilesAtCurrentPath();
        newOutput.push({ type: 'out', content: files.map(f => f.isDir ? f.name + '/' : f.name).join('  ') });
        break;
      case 'pwd':
        newOutput.push({ type: 'out', content: `/home/hitu/${dirStr === '~' ? '' : dirStr}` });
        break;
      case 'cd':
        if (!parts[1] || parts[1] === '~') {
            setDir([]);
        } else if (parts[1] === '..') {
            setDir(dir.slice(0, -1));
        } else {
            const target = parts[1];
            const currentFiles = getFilesAtCurrentPath();
            const found = currentFiles.find(f => f.name === target && f.isDir);
            if (found) {
                setDir([...dir, target]);
            } else {
                newOutput.push({ type: 'out', content: `cd: ${target}: No such directory` });
            }
        }
        break;
      case 'xdg-open':
        if (!parts[1]) {
            newOutput.push({ type: 'out', content: 'xdg-open: missing file operand' });
        } else {
            const target = parts[1];
            const currentFiles = getFilesAtCurrentPath();
            const file = currentFiles.find(f => f.name === target && !f.isDir);
            if (file) {
                const filepath = [...dir, file.name].join('/');
                if (file.mime.startsWith('image/')) {
                    setAppParams('image-viewer', { filepath });
                    openApp('image-viewer');
                } else if (file.mime.startsWith('audio/')) {
                    setAppParams('music', { filepath });
                    openApp('music');
                } else if (file.mime === 'text/markdown') {
                    setAppParams('gedit', { filepath });
                    openApp('gedit');
                } else {
                     newOutput.push({ type: 'out', content: `xdg-open: no application for ${file.mime}` });
                }
            } else {
                newOutput.push({ type: 'out', content: `xdg-open: ${target}: No such file` });
            }
        }
        break;
      case 'clear':
        setOutput([]);
        setInput('');
        return;
      default:
        newOutput.push({ type: 'out', content: `Unknown command: ${parts[0]}` });
    }

    setOutput(newOutput);
    setHistory([...history, cmd]);
    setInput('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  return (
    <div className="w-full h-full bg-[#1e2229] text-white p-2 font-mono text-xs overflow-auto" onClick={() => inputRef.current?.focus()}>
      <p className="mb-2 text-gray-400">{`> Enjoy the fake terminal 😆.`}</p>
      
      {output.map((line, i) => (
        <div key={i} className="mb-1">
          {line.type === 'cmd' && (
            <span className="text-[#59a850] mr-2">[hitu@manjaro <span className="text-white">{line.dir}</span>]$</span>
          )}
          <span className={line.type === 'cmd' ? 'text-[#13cba8]' : 'text-[#44bbff] whitespace-pre-wrap'}>{line.content}</span>
        </div>
      ))}

      <div className="flex items-center">
         <span className="text-[#59a850] mr-2 flex-shrink-0">[hitu@manjaro <span className="text-white">{dirStr}</span>]$</span>
         <input 
           ref={inputRef}
           value={input}
           onChange={e => setInput(e.target.value)}
           onKeyDown={handleKeyDown}
           className="bg-transparent outline-none border-none flex-grow text-white"
           autoFocus
         />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
