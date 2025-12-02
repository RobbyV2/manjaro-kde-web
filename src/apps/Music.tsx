'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/Icon';
import Image from 'next/image';

interface MusicProps {
  filepath?: string; // e.g. "Musics/The-Ludlows.mp3"
}

export const Music = ({ filepath }: MusicProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentFile = filepath || "";

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error(e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentFile]);

  useEffect(() => {
      if (audioRef.current) {
          audioRef.current.volume = volume;
      }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Convert internal path to public URL
  // "Musics/The-Ludlows.mp3" -> "/dolphin-files/musics/The-Ludlows.mp3"
  // Need to handle mapping.
  // filesystem.ts data: public/dolphin-files/musics
  // filepath might be "Musics/The-Ludlows.mp3" if from dolphin logic
  // Let's assume standard paths.
  const getSrc = (path: string) => {
      // Very basic mapping for now
      if (path.includes("The-Ludlows.mp3")) return "/dolphin-files/musics/The-Ludlows.mp3";
      if (path.includes("夜空中最亮的星.mp3")) return "/dolphin-files/musics/夜空中最亮的星.mp3";
      if (path.includes("未闻花名口琴版.mp3")) return "/dolphin-files/musics/未闻花名口琴版.mp3";
      if (path.includes("失う.mp3")) return "/dolphin-files/musics/vip/失う.mp3";
      return "";
  };

  const src = getSrc(currentFile);
  const title = currentFile.split('/').pop() || "No Music";

  return (
    <div className="flex flex-col w-full h-full bg-[#262626] text-white">
      <audio 
         ref={audioRef} 
         src={src} 
         onTimeUpdate={handleTimeUpdate}
         onEnded={() => setIsPlaying(false)}
      />
      
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Visualizer placeholder or album art */}
        <div className="w-48 h-48 bg-gray-700 rounded-full flex items-center justify-center shadow-2xl animate-spin-slow" style={{animationDuration: '10s'}}>
            <Icon name="music" size={64} className="opacity-50" />
        </div>
      </div>

      <div className="h-32 bg-[#31363b] flex flex-col p-4">
         <div className="text-center mb-2 font-medium">{title}</div>
         
         <div className="flex items-center gap-4 px-8">
            <span className="text-xs text-gray-400">0:00</span>
            <div className="flex-1 h-1 bg-gray-600 rounded cursor-pointer relative group">
                <div className="absolute top-0 left-0 h-full bg-[#44bbff] rounded" style={{width: `${progress}%`}} />
                <div className="absolute top-1/2 -mt-1.5 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100" style={{left: `${progress}%`, marginLeft: '-6px'}} />
            </div>
            <span className="text-xs text-gray-400">3:45</span>
         </div>

         <div className="flex items-center justify-center gap-6 mt-4">
             <Icon name="media-play" size={24} className="transform rotate-180 cursor-pointer hover:scale-110 transition-transform" />
             <div 
               className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
               onClick={togglePlay}
             >
                 <Icon name={isPlaying ? "media-pause" : "media-play"} size={16} />
             </div>
             <Icon name="media-play" size={24} className="cursor-pointer hover:scale-110 transition-transform" />
         </div>
      </div>
    </div>
  );
};
