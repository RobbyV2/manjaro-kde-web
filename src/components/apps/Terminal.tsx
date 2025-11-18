import { useState, useRef, useEffect } from 'react';

export const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [output, setOutput] = useState<{ type: 'cmd' | 'out', content: string, dir?: string }[]>([]);
  const [dir, setDir] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const dirStr = dir.length ? dir.join('/') : '~';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCmd();
    }
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
        newOutput.push({ type: 'out', content: 'ls - list files\ncd <dir> - change directory\nclear - clear screen\npwd - print working directory' });
        break;
      case 'ls':
        newOutput.push({ type: 'out', content: 'Fake file system not fully implemented in React version yet.' });
        break;
      case 'pwd':
        newOutput.push({ type: 'out', content: `/home/hitu/${dirStr === '~' ? '' : dirStr}` });
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
