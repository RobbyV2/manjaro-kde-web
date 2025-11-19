import { useDesktopStore } from '@/store/useDesktopStore';
import { findMimeFiles } from '@/utils/utils';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import clsx from 'clsx';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { getPublicUrl } from '@/utils/publicUrl';

dayjs.extend(duration);

export const Music = () => {
  const { apps } = useDesktopStore();
  const app = apps.find(a => a.id === 'music');
  
  const [activeIdx, setActiveIdx] = useState(-1);
  const [paused, setPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationTime, setDurationTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);

  const audioFiles = findMimeFiles(/^audio\//);

  // Handle opening from file parameter
  useEffect(() => {
    const filepath = app?.params?.filepath;
    if (filepath) {
      const idx = audioFiles.indexOf(filepath);
      if (idx >= 0) {
        setActiveIdx(idx);
      }
    }
  }, [app?.params?.filepath]);

  // Auto-play when track changes
  useEffect(() => {
      if (activeIdx >= 0 && audioRef.current) {
          audioRef.current.src = getPublicUrl(`/dolphin-files/${audioFiles[activeIdx]}`);
          audioRef.current.load();
          audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
          setPaused(false);
      }
  }, [activeIdx]);

  useEffect(() => {
      if (audioRef.current) {
          audioRef.current.volume = volume;
      }
  }, [volume]);

  const handleTimeUpdate = () => {
      if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
      }
  };

  const handleLoadedData = () => {
      if (audioRef.current) {
          setDurationTime(audioRef.current.duration);
      }
  };

  const togglePlay = () => {
      if (audioRef.current) {
          if (paused) {
              audioRef.current.play();
          } else {
              audioRef.current.pause();
          }
          setPaused(!paused);
      }
  };

  const playNext = () => {
      if (audioFiles.length === 0) return;
      setActiveIdx((prev) => (prev + 1) % audioFiles.length);
  };

  const playPrev = () => {
      if (audioFiles.length === 0) return;
      setActiveIdx((prev) => (prev - 1 + audioFiles.length) % audioFiles.length);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">
       {/* Playlist */}
       <div className="flex-1 overflow-y-auto bg-white">
          {audioFiles.map((file, idx) => (
              <div 
                key={file}
                onClick={() => setActiveIdx(idx)}
                className={clsx(
                    "p-3 border-b border-gray-200 cursor-pointer hover:bg-[#44bbff]/20 transition-colors border-l-[5px]",
                    activeIdx === idx ? "border-l-[#ff6300] bg-[#44bbff]/20" : "border-l-transparent"
                )}
              >
                 <span className="text-sm text-gray-800">{file.split('/').pop()}</span>
              </div>
          ))}
       </div>

       {/* Player Controls */}
       <div className="h-16 bg-[#2a2a2a] text-white flex items-center px-4 shadow-[0_0_1rem_rgb(44,122,146)] z-10">
          <div className="flex items-center gap-4 mr-4">
             <button onClick={playPrev} className="w-8 h-8 rounded-full bg-[#00ffcf] hover:bg-[#1eecff] flex items-center justify-center text-black transition-colors">
                <Icon name="triangle" size={14} className="rotate-180" />
             </button>
             <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-[#00ffcf] hover:bg-[#1eecff] flex items-center justify-center text-black transition-colors">
                <Icon name={paused ? "media-play" : "media-pause"} size={20} />
             </button>
             <button onClick={playNext} className="w-8 h-8 rounded-full bg-[#00ffcf] hover:bg-[#1eecff] flex items-center justify-center text-black transition-colors">
                <Icon name="triangle" size={14} />
             </button>
          </div>

          <div className="flex-1 flex items-center gap-4">
             <input 
               type="range" 
               min="0" 
               max={durationTime || 100} 
               value={currentTime} 
               onChange={(e) => {
                   const val = Number(e.target.value);
                   setCurrentTime(val);
                   if (audioRef.current) audioRef.current.currentTime = val;
               }}
               className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#00ffcf] [&::-webkit-slider-thumb]:rounded-full"
             />
             <span className="text-xs font-mono w-12 text-right">
                 {dayjs.duration(currentTime * 1000).format('mm:ss')}
             </span>
          </div>

          <div className="ml-4 flex items-center gap-2 group relative">
             <Icon name="audio-volume-high" size={24} className="cursor-pointer text-white hover:text-[#00d0ff]" />
             <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-8 h-24 bg-[#1f1f1f] rounded shadow-lg hidden group-hover:flex items-center justify-center pb-2">
                 <input 
                   type="range" 
                   min="0" 
                   max="1" 
                   step="0.01"
                   value={volume} 
                   onChange={(e) => setVolume(Number(e.target.value))}
                   className="h-20 -rotate-90 appearance-none bg-gray-600 rounded w-1 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#00ffcf] [&::-webkit-slider-thumb]:rounded-full"
                 />
             </div>
          </div>
       </div>
       
       <audio 
         ref={audioRef} 
         onTimeUpdate={handleTimeUpdate} 
         onLoadedData={handleLoadedData}
         onEnded={playNext}
       />
    </div>
  );
};
