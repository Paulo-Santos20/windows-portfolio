import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, List, Repeat, Shuffle } from 'lucide-react';

export const MusicPlayer = ({ src, title = "Unknown Track", artist = "Unknown Artist" }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);

  // Formatar tempo (00:00)
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Atualizar barra de progresso
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  // Carregar metadados
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
    audioRef.current.volume = volume;
    // Auto-play ao abrir
    audioRef.current.play().catch(() => console.log("Autoplay bloqueado"));
    setIsPlaying(true);
  };

  // Mudar posição da música
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Mudar Volume
  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    audioRef.current.volume = vol;
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#daeaf7] to-[#bfdbff] font-sans select-none">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Barra de Menu Superior WMP */}
      <div className="flex items-center gap-4 px-2 py-1 text-xs text-slate-600 border-b border-white/30 bg-white/20">
         <span className="hover:bg-white/40 px-2 rounded cursor-pointer">Organizar</span>
         <span className="hover:bg-white/40 px-2 rounded cursor-pointer">Transmistir</span>
         <span className="hover:bg-white/40 px-2 rounded cursor-pointer">Criar playlist</span>
      </div>

      {/* Área Central (Visualização) */}
      <div className="flex-1 flex relative overflow-hidden">
          
          {/* Capa do Álbum */}
          <div className="flex-1 flex flex-col items-center justify-center relative z-10">
              <div className="w-48 h-48 shadow-2xl border border-white/20 relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="Album Art" 
                    className="w-full h-full object-cover"
                  />
                  {/* Efeito de Brilho na Capa */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-white/20 pointer-events-none"></div>
              </div>
              
              {/* Reflexo da Capa (Efeito clássico do WMP) */}
              <div className="w-48 h-48 mt-1 opacity-30 transform scale-y-[-1] mask-image-gradient">
                  <img 
                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="Reflection" 
                    className="w-full h-full object-cover"
                    style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))' }}
                  />
              </div>

              {/* Info da Faixa */}
              <div className="absolute bottom-20 text-center drop-shadow-md">
                  <h2 className="text-xl font-bold text-[#1e3e5c]">{title}</h2>
                  <p className="text-sm text-slate-600">{artist}</p>
              </div>
          </div>

          {/* Lista de Reprodução Lateral (Fake) */}
          <div className="w-48 bg-white/40 border-l border-white/30 p-2 text-xs hidden sm:block">
              <div className="font-bold text-slate-600 mb-2 border-b border-slate-400/30 pb-1">Reproduzindo</div>
              <div className="flex items-center gap-2 p-1 bg-blue-200/50 rounded border border-blue-300/50">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="truncate font-medium">{title}</span>
              </div>
              <div className="p-1 text-slate-500">Neon Lights</div>
              <div className="p-1 text-slate-500">Cyberpunk City</div>
          </div>
      </div>

      {/* Controles Inferiores (Estilo Glass WMP) */}
      <div className="h-20 bg-[#daeaf7] border-t border-white/50 relative flex flex-col justify-end pb-2">
          
          {/* Barra de Progresso */}
          <div className="absolute top-[-1px] left-0 w-full h-1 bg-slate-300 cursor-pointer group">
              <div 
                className="h-full bg-blue-600 relative" 
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 shadow-sm"></div>
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

          {/* Botões de Controle */}
          <div className="flex items-center justify-between px-4 md:px-8">
              
              {/* Lado Esquerdo (Fake buttons) */}
              <div className="flex gap-4 text-[#5c7a94]">
                  <Shuffle size={16} className="cursor-pointer hover:text-blue-600"/>
                  <Repeat size={16} className="cursor-pointer hover:text-blue-600"/>
              </div>

              {/* Centro (Play Principal) */}
              <div className="flex items-center gap-4">
                  <button className="p-2 rounded-full hover:bg-blue-100/50 text-[#1e3e5c] transition-colors">
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

                  <button className="p-2 rounded-full hover:bg-blue-100/50 text-[#1e3e5c] transition-colors">
                      <SkipForward fill="#1e3e5c" size={20} />
                  </button>
              </div>

              {/* Lado Direito (Volume) */}
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

          {/* Tempo */}
          <div className="absolute bottom-1 right-4 text-[10px] text-slate-500">
              {formatTime(currentTime)} / {formatTime(duration)}
          </div>
      </div>
    </div>
  );
};