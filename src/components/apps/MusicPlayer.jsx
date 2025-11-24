import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, List, Repeat, Shuffle } from 'lucide-react';

// --- PLAYLIST DE AMOSTRA (Estilo Windows 7) ---
const SAMPLE_PLAYLIST = [
  {
    title: "Dream Scapes",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Tech House Vibes",
    artist: "Demo Artist",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Classic Piano",
    artist: "Mozart Fake",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
];

export const MusicPlayer = ({ src: initialSrc, title: initialTitle, artist: initialArtist }) => {
  const audioRef = useRef(null);
  
  // Estado da Playlist
  // Se vier uma música do FileExplorer, ela é a primeira. Se não, usa a playlist padrão.
  const [playlist, setPlaylist] = useState(() => {
      if (initialSrc) {
          return [{ 
              title: initialTitle || "Faixa Selecionada", 
              artist: initialArtist || "Desconhecido", 
              src: initialSrc, 
              cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
          }, ...SAMPLE_PLAYLIST];
      }
      return SAMPLE_PLAYLIST;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const currentTrack = playlist[currentIndex];

  // --- CONTROLES DE FAIXA ---
  
  const playNext = () => {
      setCurrentIndex((prev) => (prev + 1) % playlist.length);
      setIsPlaying(true); // Força play ao trocar
  };

  const playPrev = () => {
      setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
      setIsPlaying(true);
  };

  // Efeito para carregar a nova música quando o índice muda
  useEffect(() => {
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.load(); // Recarrega o source
          if (isPlaying) {
              audioRef.current.play().catch(e => console.log("Autoplay prevent:", e));
          }
      }
  }, [currentIndex]);

  // --- UTILITÁRIOS ---

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if(audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if(audioRef.current) {
        setDuration(audioRef.current.duration);
        audioRef.current.volume = volume;
        if(isPlaying) audioRef.current.play();
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    audioRef.current.volume = vol;
  };

  // Selecionar música da lista lateral
  const selectTrack = (index) => {
      setCurrentIndex(index);
      setIsPlaying(true);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#daeaf7] to-[#bfdbff] font-sans select-none">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={playNext} // Toca a próxima automaticamente ao acabar
      />

      {/* Menu Superior */}
      <div className="flex items-center gap-4 px-2 py-1 text-xs text-slate-600 border-b border-white/30 bg-white/20">
         <span className="hover:bg-white/40 px-2 rounded cursor-pointer">Reproduzir</span>
         <span className="hover:bg-white/40 px-2 rounded cursor-pointer">Biblioteca</span>
         <span className="hover:bg-white/40 px-2 rounded cursor-pointer">Ajuda</span>
      </div>

      {/* Área Central */}
      <div className="flex-1 flex relative overflow-hidden">
          
          {/* Visualização (Capa) */}
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-4">
              <div className="w-48 h-48 shadow-2xl border border-white/20 relative group transition-all duration-500 key={currentIndex}">
                  <img 
                    src={currentTrack.cover} 
                    alt="Album Art" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-white/20 pointer-events-none"></div>
              </div>
              
              {/* Reflexo */}
              <div className="w-48 h-48 mt-1 opacity-30 transform scale-y-[-1]">
                  <img 
                    src={currentTrack.cover} 
                    alt="Reflection" 
                    className="w-full h-full object-cover"
                    style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))' }}
                  />
              </div>

              {/* Info da Faixa */}
              <div className="absolute bottom-10 text-center drop-shadow-md">
                  <h2 className="text-xl font-bold text-[#1e3e5c]">{currentTrack.title}</h2>
                  <p className="text-sm text-slate-600">{currentTrack.artist}</p>
              </div>
          </div>

          {/* Lista de Reprodução (Sidebar Direita) */}
          <div className="w-48 bg-white/40 border-l border-white/30 p-2 text-xs hidden sm:flex flex-col overflow-y-auto">
              <div className="font-bold text-slate-600 mb-2 border-b border-slate-400/30 pb-1">A Seguir</div>
              
              {playlist.map((track, idx) => (
                  <div 
                    key={idx}
                    onClick={() => selectTrack(idx)}
                    className={`
                        flex items-center gap-2 p-1.5 rounded cursor-pointer mb-1
                        ${idx === currentIndex ? 'bg-blue-200/60 border border-blue-300/50 shadow-sm' : 'hover:bg-white/30'}
                    `}
                  >
                      {idx === currentIndex && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>}
                      <div className="truncate">
                          <div className="font-medium truncate">{track.title}</div>
                          <div className="text-slate-500 text-[10px] truncate">{track.artist}</div>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* Controles Inferiores */}
      <div className="h-20 bg-[#daeaf7] border-t border-white/50 relative flex flex-col justify-end pb-2">
          
          {/* Barra de Progresso */}
          <div className="absolute top-[-1px] left-0 w-full h-1 bg-slate-300 cursor-pointer group">
              <div 
                className="h-full bg-blue-600 relative" 
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 shadow-sm transition-opacity"></div>
              </div>
              <input 
                type="range" 
                min="0" 
                max={duration || 0} 
                value={currentTime} 
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
          </div>

          {/* Botões */}
          <div className="flex items-center justify-between px-4 md:px-8">
              
              <div className="flex gap-4 text-[#5c7a94]">
                  <Shuffle size={16} className="cursor-pointer hover:text-blue-600"/>
                  <Repeat size={16} className="cursor-pointer hover:text-blue-600"/>
              </div>

              <div className="flex items-center gap-4">
                  {/* BOTÃO ANTERIOR (FUNCIONAL) */}
                  <button 
                    onClick={playPrev}
                    className="p-2 rounded-full hover:bg-blue-100/50 text-[#1e3e5c] transition-colors active:scale-95"
                  >
                      <SkipBack fill="#1e3e5c" size={20} />
                  </button>
                  
                  <button 
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-gradient-to-b from-[#ebf4fc] to-[#cce5ff] border border-[#a3c8e6] shadow-[0_2px_5px_rgba(0,0,0,0.1)] flex items-center justify-center hover:brightness-105 active:scale-95 transition-all"
                  >
                      {isPlaying ? (
                          <Pause fill="#1e3e5c" className="text-[#1e3e5c]" size={24} />
                      ) : (
                          <Play fill="#1e3e5c" className="text-[#1e3e5c] ml-1" size={24} />
                      )}
                  </button>

                  {/* BOTÃO PRÓXIMO (FUNCIONAL) */}
                  <button 
                    onClick={playNext}
                    className="p-2 rounded-full hover:bg-blue-100/50 text-[#1e3e5c] transition-colors active:scale-95"
                  >
                      <SkipForward fill="#1e3e5c" size={20} />
                  </button>
              </div>

              <div className="flex items-center gap-2 w-32">
                  <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)} className="text-[#5c7a94]">
                      {volume === 0 ? <VolumeX size={18}/> : <Volume2 size={18}/>}
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
              </div>
          </div>

          <div className="absolute bottom-1 right-4 text-[10px] text-slate-500">
              {formatTime(currentTime)} / {formatTime(duration)}
          </div>
      </div>
    </div>
  );
};