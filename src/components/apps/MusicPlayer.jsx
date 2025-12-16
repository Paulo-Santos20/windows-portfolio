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

  const [playlist] = useState(SAMPLE_PLAYLIST);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isYoutubeReady, setIsYoutubeReady] = useState(false);

  const currentTrack = playlist[currentIndex];
  const isYoutube = currentTrack.type === 'youtube';

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

  const loadYoutubePlayer = () => {
    if (ytPlayerRef.current) return;
    ytPlayerRef.current = new window.YT.Player('youtube-player-frame', {
      height: '100%', width: '100%',
      videoId: currentTrack.type === 'youtube' ? currentTrack.src : '',
      playerVars: { 'playsinline': 1, 'controls': 0, 'showinfo': 0, 'rel': 0, 'modestbranding': 1 },
      events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange }
    });
  };

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

  const startProgressLoop = () => {
    stopProgressLoop();
    progressInterval.current = setInterval(() => {
      if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) setCurrentTime(ytPlayerRef.current.getCurrentTime());
    }, 500);
  };
  const stopProgressLoop = () => clearInterval(progressInterval.current);

  // --- CONTROLE DE MÍDIA ---
  useEffect(() => {
    setIsPlaying(true);
    setCurrentTime(0);
    if (isYoutube) {
      if (audioRef.current) audioRef.current.pause();
      if (ytPlayerRef.current && isYoutubeReady) { ytPlayerRef.current.loadVideoById(currentTrack.src); ytPlayerRef.current.playVideo(); }
    } else {
      if (ytPlayerRef.current && isYoutubeReady) ytPlayerRef.current.pauseVideo();
      if (audioRef.current) { audioRef.current.load(); audioRef.current.play().catch(e => console.log("Autoplay bloqueado")); }
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
  const playNext = () => setCurrentIndex((prev) => (prev + 1) % playlist.length);
  const playPrev = () => setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  const handleTrackClick = (index) => setCurrentIndex(index);

  const sidebarBtnStyle = "w-full text-left px-3 py-1.5 text-[11px] font-bold cursor-pointer border-b border-[#5d8bc6] hover:text-orange-300 transition-colors relative overflow-hidden";
  const controlBtnStyle = "rounded-full bg-gradient-to-b from-[#ffffff] to-[#dcdcdc] border border-[#808080] shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_2px_2px_rgba(0,0,0,0.3)] hover:brightness-110 active:scale-95 flex items-center justify-center active:shadow-inner cursor-pointer";

  return (
    <div className="flex flex-col h-full font-tahoma select-none overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-tl-[15px] rounded-tr-[15px] rounded-b-[5px] pointer-events-auto"
         style={{ background: '#647b9e', border: '1px solid #3a5075' }}
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

      {/* HEADER WMP9 (Arrastável e com Controles de Janela) */}
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

      {/* CORPO DO PLAYER */}
      <div className="flex-1 flex relative bg-black border-l-[4px] border-r-[4px] border-[#647b9e] overflow-hidden">
          
          {/* MENU LATERAL */}
          <div className="w-[110px] flex-shrink-0 flex flex-col bg-[#3b6ea5] border-r border-[#2a4a75] relative z-20 hidden sm:flex">
              <div className={`${sidebarBtnStyle} bg-gradient-to-r from-[#ffffff] to-[#85a4d0] text-[#1d3b67] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2)] border-l-4 border-l-[#e59700]`}>Now Playing</div>
              {['Media Guide', 'Copy from CD', 'Media Library', 'Radio Tuner'].map(item => <div key={item} className={`${sidebarBtnStyle} text-white`}>{item}</div>)}
              <div className="flex-1 bg-[#3b6ea5]"></div>
          </div>

          {/* ÁREA CENTRAL */}
          <div className="flex-1 flex flex-col bg-black relative z-10 min-w-0">
              
              {/* DISPLAY DE INFORMAÇÃO COM SCROLLING TEXT */}
              <div className="h-10 bg-black text-white px-3 py-1 flex flex-col justify-center border-b border-[#333] overflow-hidden">
                  <span className="text-xs font-bold leading-none truncate w-full opacity-70 mb-0.5">{currentTrack.artist}</span>
                  
                  {/* Container que esconde o excesso */}
                  <div className="w-full relative overflow-hidden h-5">
                      {/* O Texto em si, que anima se for longo */}
                      <div className="absolute whitespace-nowrap animate-marquee">
                          <span className="text-lg font-bold text-white">{currentTrack.title}</span>
                      </div>
                  </div>
              </div>
              
              {/* VISUALIZER / YOUTUBE */}
              <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
                   <div id="youtube-player-frame" className={`w-full h-full ${!isYoutube ? 'hidden' : 'block'}`} style={{ pointerEvents: 'none' }}></div>
                   {!isYoutube && (
                       <>
                           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ff3399] via-[#440044] to-black opacity-90"></div>
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] bg-[conic-gradient(from_0deg,transparent_0deg,#00ff00_40deg,transparent_80deg)] animate-[spin_8s_linear_infinite] opacity-50 mix-blend-screen"></div>
                       </>
                   )}
              </div>

              {/* STATUS BAR */}
              <div className="h-6 bg-[#1a1a1a] border-t border-[#333] flex items-center px-2 gap-2">
                  {isPlaying ? <div className="w-3 h-3 bg-[#00ff00] rounded-full shadow-[0_0_5px_#00ff00] animate-pulse"></div> : <div className="w-3 h-3 bg-red-500 rounded-full"></div>}
                  <span className="text-[#00ff00] text-[10px] font-mono truncate">Source: {isYoutube ? 'YouTube' : 'Audio'}</span>
              </div>
          </div>

          {/* PLAYLIST LATERAL */}
          <div className="w-[160px] flex-shrink-0 bg-[#5A5A85] flex flex-col border-l border-[#3b3b55] text-white text-[10px] relative z-20 hidden md:flex">
              <div className="h-6 bg-[#7070a0] flex items-center justify-between px-2 border-b border-[#4a4a6a] shadow-md"><span>Playlist</span></div>
              <div className="flex-1 overflow-y-auto bg-[#5A5A85] p-0.5 custom-scrollbar">
                  {playlist.map((track, index) => (
                      <div key={index} onClick={() => handleTrackClick(index)} className={`flex items-center justify-between px-2 py-1 cursor-pointer border border-transparent ${index === currentIndex ? 'bg-[#3d3d5c] border-[#7070a0] text-[#00ff00] font-bold' : 'hover:bg-[#6a6a8a] hover:border-[#7070a0] text-white'}`}>
                          <div className="flex-1 min-w-0"><div className="truncate">{track.title}</div></div>
                          <span className="ml-1 text-[9px] flex-shrink-0">{track.duration}</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* FOOTER / CONTROLES */}
      <div className="h-[70px] flex-shrink-0 bg-gradient-to-b from-[#dcebfb] via-[#a9c5eb] to-[#86a3d6] border-t border-[#6d8cc3] flex flex-col relative z-30 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] border-l-[4px] border-r-[4px] border-b-[4px] border-[#647b9e] rounded-b-[5px]">
          <div className="absolute top-2 left-4 right-4 h-[4px] bg-[#566d8f] border-b border-white/50 rounded-full overflow-visible cursor-pointer group">
              <div className="h-full bg-[#00ff00] shadow-[0_0_3px_#00ff00]" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}></div>
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