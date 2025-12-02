'use client';

import { useAppStore } from '@/store/useAppStore';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const WORDS = [
  "This is a fake manjaro.",
  "What can I do...",
  "This is a fake manjaro.",
  "What can I do...",
  "This is a fake manjaro.",
  "What can I do...",
  "This is a fake manjaro.",
  "What can I do...",
  "This is a fake manjaro.",
  "What can I do...",
  "This is a fake manjaro.",
  "What can I do...",
];

export const CmdMsg = () => {
  const { powerState, setPowerState, setLocked } = useAppStore();
  const [lines, setLines] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (!powerState) return;

    setLines(0);
    setIsGameOver(false);

    let interval: NodeJS.Timeout;
    let count = 0;

    const start = () => {
      interval = setInterval(() => {
        count++;
        setLines(count);
        if (count > WORDS.length) {
          clearInterval(interval);
          if (powerState === 'shutdown') {
            setIsGameOver(true);
          } else if (powerState === 'reboot') {
            // Reboot logic
            setTimeout(() => {
              // Reset
               // Simulate rebooting... actually we should probably clear logic and restart.
               // For now just loop back to lock screen.
               setPowerState('');
               setLocked(true);
            }, 500);
          }
        }
      }, 40);
    };

    start();

    return () => clearInterval(interval);
  }, [powerState, setPowerState, setLocked]);

  const handleRestart = () => {
    if (isGameOver) {
      setPowerState('');
      setLocked(true);
      setIsGameOver(false);
    }
  };

  if (!powerState) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full bg-black text-white font-mono flex flex-col z-[200] overflow-hidden p-4 cursor-pointer"
      onClick={handleRestart}
    >
      {isGameOver ? (
        <div className="flex items-center justify-center h-full w-full">
           <Image src="/images/gameover.png" alt="Game Over" width={200} height={100} className="object-contain" />
        </div>
      ) : (
        WORDS.map((word, idx) => (
          <div key={idx} className={`flex items-center mb-1 text-sm ${idx < lines ? 'flex' : 'hidden'}`}>
            <span className="mr-2">[<span className="text-green-500 mx-1">OK</span>]</span>
            <p>{word}</p>
          </div>
        ))
      )}
    </div>
  );
};
