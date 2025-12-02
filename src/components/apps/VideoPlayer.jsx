import React, { useState, useRef, useEffect } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  X, Minimize2, ChevronLeft, Maximize, Square, Film 
} from 'lucide-react';

const VIDEO_PLAYLIST = [
  { title: "Apresentação do Projeto", duration: "0:00" },
  { title: "Sample Video 2", duration: "0:00" },
];

export const VideoPlayer = ({ src, title, onClose, onMinimize, onMaximize, isMaximized }) => {
  const { globalVolume, setGlobalVolume } = useOSStore();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => { if (videoRef.current) videoRef.current.volume = globalVolume; }, [globalVolume]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = globalVolume;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, []);

  const togglePlay = () => { if (isPlaying) videoRef.current.pause(); else videoRef.current.play(); setIsPlaying(!isPlaying); };
  const handleTimeUpdate = () => setCurrentTime(videoRef.current.currentTime);
  const handleLoadedMetadata = () => { setDuration(videoRef.current.duration); };
  
  const handleSeek = (e) => { const time = parseFloat(e.target.value); videoRef.current.currentTime = time; setCurrentTime(time); };
  const handleVolumeChange = (e) => { const vol = parseFloat(e.target.value); setGlobalVolume(vol); };
  const formatTime = (time) => { if (isNaN(time) || time === Infinity) return "0:00"; const m = Math.floor(time/60); const s = Math.floor(time%60); return `${m}:${s.toString().padStart(2,'0')}`; };

  const sidebarBtnStyle = "w-full text-left px-3 py-1.5 text-[11px] font-bold cursor-pointer border-b border-[#5d8bc6] hover:text-orange-300 transition-colors relative overflow-hidden";
  const controlBtnStyle = "rounded-full bg-gradient-to-b from-[#ffffff] to-[#dcdcdc] border border-[#808080] shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_2px_2px_rgba(0,0,0,0.3)] hover:brightness-110 active:scale-95 flex items-center justify-center active:shadow-inner";

  return (
    <div className="flex flex-col h-full font-tahoma select-none overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-tl-[15px] rounded-tr-[15px] rounded-b-[5px] pointer-events-auto"
         style={{ background: '#647b9e', border: '1px solid #3a5075' }}
    >
      <div className="window-header h-10 flex items-center justify-between px-2 bg-gradient-to-b from-[#dcecff] to-[#9ebcdb] border-b border-[#587395] rounded-t-[14px] cursor-move">
         <div className="flex items-center gap-2 ml-2 pointer-events-none">
             <div className="w-4 h-4 bg-orange-500 rounded-full border border-white shadow-sm flex items-center justify-center"><div className="w-1 h-1 bg-white rounded-full"></div></div>
             <span className="text-[#1d3b67] font-bold text-xs italic">Windows Media Player</span>
         </div>
         <div className="flex gap-1 pr-1 no-drag pointer-events-auto" onMouseDown={(e) => e.stopPropagation()}>
             <button onClick={onMinimize} className="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-[#fff] to-[#dcecff] hover:brightness-110 rounded border border-[#fff] shadow-sm cursor-pointer"><Minimize2 size={10} className="text-[#1d3b67]"/></button>
             <button onClick={onMaximize} className="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-[#fff] to-[#dcecff] hover:brightness-110 rounded border border-[#fff] shadow-sm cursor-pointer">{isMaximized ? <div className="relative w-3 h-3"><div className="absolute top-0 right-0 w-2 h-2 border border-[#1d3b67]"></div><div className="absolute bottom-0 left-0 w-2 h-2 border border-[#1d3b67] bg-[#dcecff] z-10"></div></div> : <Square size={10} className="text-[#1d3b67]" />}</button>
             <button onClick={onClose} className="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-[#ff9999] to-[#e05e5e] hover:brightness-110 rounded border border-[#ffbaba] shadow-sm group cursor-pointer"><X size={12} className="text-white group-hover:scale-110"/></button>
         </div>
      </div>

      {/* CORPO DO PLAYER (IDÊNTICO AO MUSIC PLAYER, APENAS O MIOLO MUDA) */}
      <div className="flex-1 flex relative bg-black border-l-[4px] border-r-[4px] border-[#647b9e] overflow-hidden">
          <div className="w-[110px] flex-shrink-0 flex flex-col bg-[#3b6ea5] border-r border-[#2a4a75] relative z-20">
              <div className={`${sidebarBtnStyle} bg-gradient-to-r from-[#ffffff] to-[#85a4d0] text-[#1d3b67] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2)] border-l-4 border-l-[#e59700]`}>Now Playing</div>
              {['Media Guide', 'Copy from CD'].map(i => <div key={i} className={`${sidebarBtnStyle} text-white`}>{i}</div>)}
              <div className="flex-1 bg-[#3b6ea5]"></div>
          </div>

          <div className="flex-1 flex flex-col bg-black relative z-10 min-w-0">
              <div className="h-8 bg-black text-white px-3 py-1 flex flex-col justify-center border-b border-[#333]">
                  <span className="text-xl font-bold leading-none text-white truncate">{title || "Video Player"}</span>
              </div>
              <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
                 <video ref={videoRef} src={src} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={() => setIsPlaying(false)} className="w-full h-full object-contain max-h-full" onClick={togglePlay} />
              </div>
          </div>

          <div className="w-[150px] flex-shrink-0 bg-[#5A5A85] flex flex-col border-l border-[#3b3b55] text-white text-[10px] relative z-20">
              <div className="h-6 bg-[#7070a0] flex items-center justify-between px-2 border-b border-[#4a4a6a] shadow-md"><span>Playlist</span></div>
              <div className="h-24 bg-gradient-to-b from-[#4a4a6a] to-[#3a3a55] flex flex-col items-center justify-center p-2 border-b border-[#4a4a6a]">
                  <div className="w-14 h-14 bg-white rounded-sm flex items-center justify-center border border-gray-400 shadow-lg mb-1"><Film size={24} className="text-black/50"/></div>
                  <span className="text-[9px] text-white/70 truncate w-full text-center">Video Media</span>
              </div>
              <div className="flex-1 overflow-y-auto bg-[#5A5A85] p-0.5 custom-scrollbar">
                  {VIDEO_PLAYLIST.map((track, index) => (
                      <div key={index} className={`flex items-center justify-between px-2 py-1 border border-transparent ${index === 0 ? 'bg-[#3d3d5c] border-[#7070a0] text-[#00ff00] font-bold' : 'text-white'}`}>
                          <span className="truncate flex-1">{index === 0 ? title : track.title}</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      <div className="h-[70px] flex-shrink-0 bg-gradient-to-b from-[#dcebfb] via-[#a9c5eb] to-[#86a3d6] border-t border-[#6d8cc3] flex flex-col relative z-30 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] border-l-[4px] border-r-[4px] border-b-[4px] border-[#647b9e] rounded-b-[5px]">
          <div className="absolute top-2 left-4 right-4 h-[4px] bg-[#566d8f] border-b border-white/50 rounded-full overflow-visible cursor-pointer group">
              <div className="h-full bg-[#00ff00] shadow-[0_0_3px_#00ff00]" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
              <input type="range" min="0" max={duration || 0} value={currentTime} onChange={handleSeek} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
          </div>
          <div className="flex-1 flex items-center justify-between px-4 mt-4">
              <div className="flex items-center gap-1">
                   <button onClick={togglePlay} className={`${controlBtnStyle} w-10 h-10 border-[#555]`}>{isPlaying ? <Pause fill="#1d3b67" size={16} className="text-[#1d3b67]"/> : <Play fill="#1d3b67" size={16} className="text-[#1d3b67] ml-0.5"/>}</button>
                   <button className={`${controlBtnStyle} w-7 h-7`} onClick={() => { videoRef.current.pause(); videoRef.current.currentTime = 0; setIsPlaying(false); }}><Square fill="#1d3b67" size={10} className="text-[#1d3b67]"/></button>
                   <button className={`${controlBtnStyle} w-7 h-7`}><SkipBack fill="#1d3b67" size={10} className="text-[#1d3b67]"/></button>
                   <button className={`${controlBtnStyle} w-7 h-7`}><SkipForward fill="#1d3b67" size={10} className="text-[#1d3b67]"/></button>
              </div>
              <div className="flex items-center gap-2 mr-2">
                  <button onClick={() => setGlobalVolume(globalVolume === 0 ? 0.5 : 0)}>{globalVolume === 0 ? <VolumeX size={16} className="text-[#1d3b67]"/> : <Volume2 size={16} className="text-[#1d3b67]"/>}</button>
                  <div className="w-16 h-3 bg-[#333] border border-gray-500 relative rounded-sm overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#006600] to-[#00ff00]" style={{ width: `${globalVolume * 100}%` }}></div>
                      <input type="range" min="0" max="1" step="0.01" value={globalVolume} onChange={handleVolumeChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};