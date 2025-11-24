import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Volume2, Volume1, VolumeX, Battery, Power, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

// --- MENU INICIAR ---
const StartMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div 
      className="absolute bottom-10 left-0 w-[400px] h-[550px] rounded-t-lg flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)] z-50 overflow-hidden font-sans border border-[#536577]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex-1 flex bg-white/95 backdrop-blur-sm">
        <div className="w-[60%] bg-white p-2 flex flex-col gap-1 overflow-y-auto">
           <button className="flex items-center gap-2 p-2 hover:bg-[#dceafc] text-slate-700 font-bold text-sm group">
             <span>Todos os programas</span>
             <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
           </button>
        </div>
        <div className="w-[40%] bg-[#1b2531] text-white p-3 flex flex-col gap-2 shadow-[inset_10px_0_20px_-10px_rgba(0,0,0,0.5)] border-l border-[#536577]">
             <span className="text-sm hover:text-white text-[#cfd8e6] cursor-pointer">Painel de Controle</span>
             <span className="text-sm hover:text-white text-[#cfd8e6] cursor-pointer">Computador</span>
        </div>
      </div>
      <div className="h-12 bg-gradient-to-b from-[#2f4256] to-[#16212d] flex items-center justify-end px-4 border-t border-[#536577]">
          <button onClick={() => window.close()} className="flex items-center gap-1 text-white text-xs font-bold bg-[#7e5c5c] px-3 py-1 rounded border border-[#2e1a1a]">
             Desligar <Power size={12} />
          </button>
      </div>
    </div>
  );
};

// --- CONTROLE DE VOLUME (CORRIGIDO) ---
const VolumeControl = ({ isOpen, volume, setVolume }) => {
    const trackRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    // 1. Lógica de Interação (Mouse/Touch)
    const handleInteraction = (e) => {
        if (!trackRef.current) return;
        
        const rect = trackRef.current.getBoundingClientRect();
        // No clientY, quanto menor o valor, mais alto na tela o mouse está (100% volume)
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        // Calculamos a distância do fundo da barra até o clique
        const heightFromBottom = rect.bottom - clientY;
        const totalHeight = rect.height;
        
        let percentage = (heightFromBottom / totalHeight) * 100;

        // Limites
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;

        setVolume(Math.round(percentage));
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        handleInteraction(e); // Atualiza imediatamente ao clicar
    };

    // 2. Hook de Eventos Globais (CORREÇÃO: Este hook deve existir SEMPRE, não dentro de um if)
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) handleInteraction(e);
        };
        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleMouseMove);
            window.addEventListener('touchend', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging]); // Dependência apenas de isDragging

    // 3. Renderização Condicional (O if vem SÓ AGORA no final)
    if (!isOpen) return null;

    return (
        <div 
            className="absolute bottom-10 right-0 mb-2 w-[100px] h-[300px] rounded-lg flex flex-col shadow-[0_0_15px_rgba(0,0,0,0.6)] z-50 select-none"
            onClick={(e) => e.stopPropagation()}
            style={{
                background: 'rgba(20, 30, 40, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
        >
            <div className="p-4 pb-2 flex flex-col items-center border-b border-white/10 mb-4">
                <Volume2 size={24} className="text-slate-300 mb-2 drop-shadow-md" />
                <span className="text-white text-xs font-medium drop-shadow">Alto-falantes</span>
            </div>

            <div className="flex-1 flex justify-center pb-4">
                {/* TRILHO */}
                <div 
                    ref={trackRef}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    className="relative w-[14px] h-[180px] bg-[#dcdcdc] rounded-full border border-[#888] shadow-inner cursor-pointer group"
                    style={{ boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.4)' }}
                >
                    {/* PREENCHIMENTO VERDE */}
                    <div 
                        className="absolute bottom-0 left-0 w-full rounded-b-full bg-gradient-to-t from-[#1e8e1e] to-[#55db55] border-t border-white/30 pointer-events-none"
                        style={{ height: `${volume}%`, borderRadius: volume >= 98 ? '999px' : '0 0 999px 999px' }}
                    ></div>

                    {/* BOTÃO (THUMB) */}
                    <div 
                        className="absolute left-1/2 -translate-x-1/2 w-[26px] h-[14px] rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.6)] transition-none pointer-events-none"
                        style={{ 
                            bottom: `calc(${volume}% - 7px)`, 
                            background: 'linear-gradient(to bottom, #f2f2f2 0%, #d4d4d4 50%, #bebebe 51%, #e0e0e0 100%)',
                            border: '1px solid #666'
                        }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-[2px] border-t border-b border-gray-400"></div>
                    </div>
                </div>
            </div>

            <div className="p-2 flex justify-center">
                 <button 
                    onClick={() => setVolume(volume === 0 ? 50 : 0)}
                    className="hover:bg-white/10 p-2 rounded transition-colors"
                 >
                    {volume === 0 ? <VolumeX size={20} className="text-red-400"/> : <Volume2 size={20} className="text-blue-200"/>}
                 </button>
            </div>
        </div>
    );
};

// --- COMPONENTE TASKBAR ---
export const Taskbar = () => {
  const { windows, activeWindowId, focusWindow, restoreWindow, minimizeWindow } = useOSStore();
  const [startOpen, setStartOpen] = useState(false);
  const [timeData, setTimeData] = useState({ time: '', date: '' });
  
  const [volume, setVolume] = useState(70);
  const [showVolume, setShowVolume] = useState(false);

  const getVolumeIcon = () => {
      if (volume === 0) return <VolumeX size={18} className="text-red-400"/>;
      if (volume < 50) return <Volume1 size={18}/>;
      return <Volume2 size={18}/>;
  };

  useEffect(() => {
    const handleClickOutside = () => setShowVolume(false);
    if (showVolume) window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showVolume]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeData({
        time: new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Recife', hour: '2-digit', minute: '2-digit' }).format(now),
        date: new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Recife', day: '2-digit', month: '2-digit', year: 'numeric' }).format(now)
      });
    };
    updateTime();
    const i = setInterval(updateTime, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <>
      {startOpen && <div className="fixed inset-0 z-40" onClick={() => setStartOpen(false)} />}
      
      <div className="fixed bottom-10 left-0 z-50">
         <StartMenu isOpen={startOpen} onClose={() => setStartOpen(false)} />
      </div>
      
      <div className="fixed bottom-0 w-full h-10 flex items-center justify-between z-[9999] px-1 select-none"
           style={{
             background: 'linear-gradient(to bottom, rgba(28, 55, 76, 0.9) 0%, rgba(20, 30, 48, 0.95) 50%, rgba(0, 0, 0, 0.95) 100%)',
             backdropFilter: 'blur(10px)',
             borderTop: '1px solid rgba(255,255,255,0.3)',
             boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
           }}
      >
        <div className="relative -top-[2px] z-50 ml-1">
           <button 
            onClick={() => setStartOpen(!startOpen)}
            className="w-10 h-10 rounded-full transition-all hover:brightness-110 active:scale-95 flex items-center justify-center group relative shadow-[0_0_10px_rgba(0,100,255,0.5)]"
            style={{
                background: 'radial-gradient(circle at center, #1f508a 0%, #153864 45%, #0d2138 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), 0 2px 5px rgba(0,0,0,0.8)'
            }}
           >
                <div className="grid grid-cols-2 gap-[2px] opacity-90 group-hover:opacity-100">
                    <div className="w-2 h-2 bg-[#f2552e] rounded-tl-[1px]"></div>
                    <div className="w-2 h-2 bg-[#8bc43d] rounded-tr-[1px]"></div>
                    <div className="w-2 h-2 bg-[#2d9fe6] rounded-bl-[1px]"></div>
                    <div className="w-2 h-2 bg-[#fdbd08] rounded-br-[1px]"></div>
                </div>
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-full pointer-events-none"></div>
           </button>
        </div>

        <div className="flex-1 flex items-center gap-1 px-3 pl-4 overflow-x-auto h-full scrollbar-hide">
          {windows.map((win) => (
             <button
               key={win.id}
               onClick={() => {
                 if (win.isMinimized) restoreWindow(win.id);
                 else if (activeWindowId === win.id) minimizeWindow(win.id);
                 else focusWindow(win.id);
               }}
               className={clsx(
                 "relative h-[34px] px-3 min-w-[140px] max-w-[180px] rounded-[3px] flex items-center gap-2 border border-transparent hover:shadow-[inset_0_0_5px_rgba(255,255,255,0.4)] hover:bg-white/10 transition-all text-shadow overflow-hidden",
                 activeWindowId === win.id && !win.isMinimized
                   ? "bg-gradient-to-b from-white/20 to-white/5 border-white/30 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]" 
                   : ""
               )}
             >
               <span className="drop-shadow-md flex-shrink-0">{win.icon}</span>
               <span className="text-xs text-white truncate drop-shadow-md font-sans">{win.title}</span>
             </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-[#0d161f]/50 rounded-lg border border-white/5 mx-2 shadow-inner h-[34px]">
           <div className="hidden sm:flex gap-1 text-white/80 mr-1">
               <div className="hover:bg-white/10 p-1 rounded cursor-pointer transition-colors" title="Acesso à Internet"><div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white/80 transform rotate-180 translate-y-[-2px]"></div></div>
               <div className="hover:bg-white/10 p-1 rounded cursor-pointer transition-colors" title="Energia"><Battery size={16} className="rotate-90" /></div>
           </div>

           <div className="relative">
               <button 
                  onClick={(e) => {
                      e.stopPropagation();
                      setShowVolume(!showVolume);
                  }}
                  className={clsx(
                      "hover:bg-white/10 p-1 rounded cursor-pointer text-white transition-colors flex items-center justify-center w-7 h-7",
                      showVolume && "bg-white/20 shadow-inner"
                  )}
                  title={`Alto-falantes: ${volume}%`}
               >
                  {getVolumeIcon()}
               </button>
               
               <div className="absolute bottom-8 right-0 cursor-default">
                 <VolumeControl 
                    isOpen={showVolume} 
                    volume={volume} 
                    setVolume={setVolume} 
                 />
               </div>
           </div>
           
           <div className="flex flex-col items-center justify-center text-white text-[11px] leading-tight w-[60px] cursor-default pl-2 border-l border-white/10">
               <span>{timeData.time}</span>
               <span>{timeData.date}</span>
           </div>
        </div>

        <div className="w-3 h-full border-l border-white/30 hover:bg-white/30 hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all cursor-pointer ml-1 flex items-center justify-center group" title="Mostrar Área de Trabalho">
        </div>
      </div>
    </>
  );
};