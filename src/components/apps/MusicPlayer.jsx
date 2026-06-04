import React, { useState, useRef, useEffect } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  X, Minimize2, Maximize, Square 
} from 'lucide-react';

const SAMPLE_PLAYLIST = [
  { 
    title: "Beethoven - Symphony No. 6 (Proms 2012)", 
    artist: "Beethoven", 
    duration: "42:02", 
    src: "aW-7CqxhnAQ",
    type: 'youtube'
  },
  { title: "Symphony No. 9 (Scherzo)", artist: "Beethoven", duration: "1:15", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", type: 'mp3' },
  { title: "Sleep Away", artist: "Bob Acri", duration: "3:20", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", type: 'mp3' },
  { title: "Kalimba", artist: "Mr. Scruff", duration: "5:48", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", type: 'mp3' },
];

export const MusicPlayer = ({ onClose, onMinimize, onMaximize, isMaximized }) => {
  const { globalVolume, setGlobalVolume } = useOSStore();
  const audioRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const progressInterval = useRef(null);
  const prevVolumeRef = useRef(globalVolume || 0.5);

  const [playlist] = useState(SAMPLE_PLAYLIST);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isYoutubeReady, setIsYoutubeReady] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const currentTrack = playlist[currentIndex];
  const isYoutube = currentTrack.type === 'youtube';

  const stopProgressLoop = () => clearInterval(progressInterval.current);

  const startProgressLoop = () => {
    stopProgressLoop();
    progressInterval.current = setInterval(() => {
      if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) setCurrentTime(ytPlayerRef.current.getCurrentTime());
    }, 500);
  };

  const playNext = () => setCurrentIndex((prev) => (prev + 1) % playlist.length);

  const onPlayerReady = (event) => {
    setIsYoutubeReady(true);
    event.target.setVolume(globalVolume * 100);
    if (isYoutube && isPlaying) event.target.playVideo();
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      setDuration(ytPlayerRef.current.getDuration());
      startProgressLoop();
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
      stopProgressLoop();
    } else if (event.data === window.YT.PlayerState.ENDED) {
      playNext();
    }
  };

  const loadYoutubePlayer = () => {
    if (ytPlayerRef.current) return;
    ytPlayerRef.current = new window.YT.Player('youtube-player-frame', {
      height: '100%', width: '100%',
      videoId: currentTrack.type === 'youtube' ? currentTrack.src : '',
      playerVars: { 'playsinline': 1, 'controls': 0, 'showinfo': 0, 'rel': 0, 'modestbranding': 1 },
      events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange }
    });
  };

  // --- API YOUTUBE ---
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    window.onYouTubeIframeAPIReady = () => loadYoutubePlayer();
    if (window.YT && window.YT.Player) loadYoutubePlayer();
    return () => clearInterval(progressInterval.current);
  }, []);

  // --- CONTROLE DE MÍDIA ---
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsPlaying(true);
    setCurrentTime(0);
    if (isYoutube) {
      if (audioRef.current) audioRef.current.pause();
      if (ytPlayerRef.current && isYoutubeReady) { ytPlayerRef.current.loadVideoById(currentTrack.src); ytPlayerRef.current.playVideo(); }
    } else {
      if (ytPlayerRef.current && isYoutubeReady) ytPlayerRef.current.pauseVideo();
      if (audioRef.current) { audioRef.current.load(); audioRef.current.play().catch(() => console.log("Autoplay bloqueado")); }
    }
  }, [currentIndex, isYoutubeReady]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = globalVolume;
    if (ytPlayerRef.current && isYoutubeReady) ytPlayerRef.current.setVolume(globalVolume * 100);
  }, [globalVolume, isYoutubeReady]);

  const handleVolumeChange = (e) => setGlobalVolume(parseFloat(e.target.value));
  
  const togglePlay = () => {
    if (isYoutube) { if (ytPlayerRef.current) isPlaying ? ytPlayerRef.current.pauseVideo() : ytPlayerRef.current.playVideo(); } 
    else { if (audioRef.current) isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (isYoutube && ytPlayerRef.current) ytPlayerRef.current.seekTo(newTime, true);
    else if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  const handleMp3TimeUpdate = () => setCurrentTime(audioRef.current.currentTime);
  const handleMp3Loaded = () => setDuration(audioRef.current.duration);
  const playPrev = () => setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  const handleTrackClick = (index) => setCurrentIndex(index);

  const handleMuteToggle = () => {
    if (globalVolume === 0) {
      setGlobalVolume(prevVolumeRef.current);
    } else {
      prevVolumeRef.current = globalVolume;
      setGlobalVolume(0);
    }
  };

  const sidebarBtnStyle = "w-full text-left px-3 py-1.5 text-[11px] font-bold cursor-pointer border-b border-[#5d8bc6] hover:text-orange-300 transition-colors relative overflow-hidden";
  const controlBtnStyle = "rounded-full bg-gradient-to-b from-[#ffffff] to-[#dcdcdc] border border-[#808080] shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_2px_2px_rgba(0,0,0,0.3)] hover:brightness-110 active:scale-95 flex items-center justify-center active:shadow-inner cursor-pointer";

  return (
    <div className="flex flex-col h-full font-tahoma select-none overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-tl-[15px] rounded-tr-[15px] rounded-b-[5px] pointer-events-auto"
         style={{ background: '#2b4a6f', border: '1px solid #1a3050' }}
    >
      <style>{`
        /* Animação de Letreiro Digital (Marquee) */
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 15s linear infinite;
          padding-left: 100%; /* Começa fora da tela */
        }
      `}</style>

      <audio ref={audioRef} src={!isYoutube ? currentTrack.src : ''} onTimeUpdate={handleMp3TimeUpdate} onLoadedMetadata={handleMp3Loaded} onEnded={playNext}/>

      {/* HEADER WMP9 ORIGINAL XP */}
      <div className="window-header h-10 flex items-center justify-between px-2 bg-gradient-to-b from-[#3a6a9e] to-[#1a4a7a] border-b border-[#0f2a4a] rounded-t-[14px] cursor-move">
         <div className="flex items-center gap-2 ml-2 pointer-events-none">
             <div className="w-4 h-4 bg-orange-500 rounded-full border border-[#ffdf80] shadow-sm flex items-center justify-center"><div className="w-1 h-1 bg-white rounded-full"></div></div>
             <span className="text-white font-bold text-xs drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">Windows Media Player</span>
         </div>
         <div className="flex gap-1 pr-1 no-drag pointer-events-auto" onMouseDown={(e) => e.stopPropagation()}>
             <button onClick={onMinimize} className="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-[#e8eef5] to-[#b0c8e0] hover:brightness-110 rounded-sm border border-[#8aa8c8] shadow-sm cursor-pointer"><Minimize2 size={10} className="text-[#1a3050]"/></button>
             <button onClick={onMaximize} className="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-[#e8eef5] to-[#b0c8e0] hover:brightness-110 rounded-sm border border-[#8aa8c8] shadow-sm cursor-pointer">{isMaximized ? <div className="relative w-3 h-3"><div className="absolute top-0 right-0 w-2 h-2 border border-[#1a3050]"></div><div className="absolute bottom-0 left-0 w-2 h-2 border border-[#1a3050] bg-[#b0c8e0] z-10"></div></div> : <Square size={10} className="text-[#1a3050]" />}</button>
             <button onClick={onMinimize} className="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-[#e05e5e] to-[#a02020] hover:brightness-110 rounded-sm border border-[#c04040] shadow-sm group cursor-pointer"><X size={12} className="text-white group-hover:scale-110"/></button>
         </div>
      </div>

      {/* CORPO DO PLAYER */}
      <div className="flex-1 flex relative bg-black border-l-[4px] border-r-[4px] border-[#2b4a6f] overflow-hidden">
          
          {/* MENU LATERAL WMP9 ORIGINAL */}
          <div className={`${showSidebar ? 'flex' : 'hidden'} sm:flex w-[110px] flex-shrink-0 flex-col bg-[#2a4a7a] border-r border-[#1a3050] relative z-20`}>
              <div className="sm:hidden absolute -right-5 top-1 z-30">
                <button onClick={() => setShowSidebar(false)} className="w-5 h-5 flex items-center justify-center bg-[#2a4a7a] rounded-r cursor-pointer hover:brightness-110"><X size={12} className="text-white"/></button>
              </div>
              <div className={`${sidebarBtnStyle} bg-gradient-to-r from-[#e0e8f0] to-[#90a8c8] text-[#0a2040] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3)] border-l-4 border-l-[#ffa500]`}>Now Playing</div>
              {['Media Guide', 'Copy from CD', 'Media Library', 'Radio Tuner'].map(item => <div key={item} className={`${sidebarBtnStyle} text-white`}>{item}</div>)}
              <div className="flex-1 bg-[#2a4a7a]"></div>
          </div>

          {/* ÁREA CENTRAL */}
          <div className="flex-1 flex flex-col bg-black relative z-10 min-w-0">
               
               {/* TOGGLE SIDEBAR MOBILE */}
               <div className="absolute top-1 left-1 z-30 sm:hidden">
                 <button onClick={() => setShowSidebar(true)} className="w-6 h-6 flex items-center justify-center bg-[#3b6ea5]/80 rounded cursor-pointer hover:bg-[#3b6ea5]"><span className="text-white text-xs font-bold">☰</span></button>
               </div>

               {/* DISPLAY DE INFORMAÇÃO WMP9 */}
              <div className="h-10 bg-[#0a0a1a] text-white px-3 py-1 flex flex-col justify-center border-b border-[#1a3050] overflow-hidden">
                  <span className="text-[10px] font-bold leading-none truncate w-full opacity-60 mb-0.5 uppercase tracking-wider">{currentTrack.artist}</span>
                  
                  <div className="w-full relative overflow-hidden h-5">
                      <div className="absolute whitespace-nowrap animate-marquee">
                          <span className="text-base font-bold text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]">{currentTrack.title}</span>
                      </div>
                  </div>
              </div>
              
              {/* VISUALIZER / YOUTUBE */}
              <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
                   <div id="youtube-player-frame" className={`w-full h-full ${!isYoutube ? 'hidden' : 'block'}`} style={{ pointerEvents: 'none' }}></div>
                   {!isYoutube && (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-b from-[#002244] via-[#00152a] to-black"></div>
                            <div className="absolute inset-0 flex items-end justify-center gap-[3px] px-4 pb-12">
                              {[4,6,9,7,5,8,10,6,3,5,7,9,11,8,6,4].map((h, i) => (
                                <div key={i} className="w-[6px] bg-gradient-to-t from-[#00cc00] via-[#00ff00] to-[#80ff80] rounded-t-sm opacity-90 shadow-[0_0_4px_#00ff00] animate-pulse" style={{ height: `${h * 8}%`, animationDelay: `${i * 0.1}s`, animationDuration: `${0.8 + Math.random() * 0.5}s` }}></div>
                              ))}
                            </div>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-[#00ff00] font-mono opacity-60">Now Playing</div>
                        </>
                    )}
              </div>

              {/* STATUS BAR WMP9 */}
              <div className="h-6 bg-[#0a1520] border-t border-[#1a3050] flex items-center px-2 gap-2">
                  {isPlaying ? <div className="w-3 h-3 bg-[#00ff00] rounded-full shadow-[0_0_5px_#00ff00] animate-pulse"></div> : <div className="w-3 h-3 bg-[#ff3333] rounded-full"></div>}
                  <span className="text-[#00ff00] text-[10px] font-mono truncate">{isPlaying ? 'Playing' : 'Paused'}</span>
              </div>
          </div>

          {/* PLAYLIST LATERAL WMP9 */}
          <div className="w-[160px] flex-shrink-0 bg-[#1a2a4a] flex flex-col border-l border-[#0f1a30] text-white text-[10px] relative z-20 hidden md:flex">
              <div className="h-6 bg-[#2a4a6a] flex items-center justify-between px-2 border-b border-[#0f1a30] shadow-md"><span className="text-[#a0c0e0] font-bold text-[9px] uppercase">Playlist</span></div>
              <div className="flex-1 overflow-y-auto bg-[#1a2a4a] p-0.5 custom-scrollbar">
                  {playlist.map((track, index) => (
                      <div key={index} onClick={() => handleTrackClick(index)} className={`flex items-center justify-between px-2 py-1 cursor-pointer border border-transparent ${index === currentIndex ? 'bg-[#0a1a30] border-[#2a4a6a] text-[#00ff00] font-bold' : 'hover:bg-[#2a4a6a] hover:border-[#4a6a8a] text-white'}`}>
                          <div className="flex-1 min-w-0"><div className="truncate">{track.title}</div></div>
                          <span className="ml-1 text-[9px] flex-shrink-0">{track.duration}</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* FOOTER / CONTROLES WMP9 */}
      <div className="h-[70px] flex-shrink-0 bg-gradient-to-b from-[#d0dce8] via-[#90a8c0] to-[#6078a0] border-t border-[#4a6080] flex flex-col relative z-30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] border-l-[4px] border-r-[4px] border-b-[4px] border-[#2b4a6f] rounded-b-[5px]">
          <div className="absolute top-2 left-4 right-4 h-[4px] bg-[#1a2030] border-b border-[#4a6080]/30 rounded-full overflow-visible cursor-pointer group">
              <div className="h-full bg-[#00ff00] shadow-[0_0_6px_#00ff00]" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}></div>
              <input type="range" min="0" max={duration || 0} value={currentTime} onChange={handleSeek} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
          </div>
          <div className="flex-1 flex items-center justify-between px-4 mt-4">
              <div className="flex items-center gap-1">
                    <button onClick={togglePlay} className={`${controlBtnStyle} w-10 h-10 border-[#555]`}>{isPlaying ? <Pause fill="#1d3b67" size={16} className="text-[#1d3b67]"/> : <Play fill="#1d3b67" size={16} className="text-[#1d3b67] ml-0.5"/>}</button>
                    <button className={`${controlBtnStyle} w-7 h-7`} onClick={() => { setIsPlaying(false); if(isYoutube && ytPlayerRef.current) ytPlayerRef.current.pauseVideo(); if(audioRef.current) audioRef.current.pause(); }}><div className="w-2.5 h-2.5 bg-[#1d3b67]"></div></button>
                    <button onClick={playPrev} className={`${controlBtnStyle} w-7 h-7`}><SkipBack fill="#1d3b67" size={10} className="text-[#1d3b67]"/></button>
                    <button onClick={playNext} className={`${controlBtnStyle} w-7 h-7`}><SkipForward fill="#1d3b67" size={10} className="text-[#1d3b67]"/></button>
              </div>
              <div className="flex items-center gap-2 mr-2">
                  <button onClick={handleMuteToggle}>{globalVolume === 0 ? <VolumeX size={16} className="text-[#1a3050]"/> : <Volume2 size={16} className="text-[#1a3050]"/>}</button>
                  <div className="w-16 h-3 bg-[#1a1a2a] border border-[#4a6080] relative rounded-sm overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#006600] to-[#00ff00]" style={{ width: `${globalVolume * 100}%` }}></div>
                      <input type="range" min="0" max="1" step="0.01" value={globalVolume} onChange={handleVolumeChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};