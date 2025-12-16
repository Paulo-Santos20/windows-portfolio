import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { 
  Volume2, Volume1, VolumeX, ChevronRight, LogOut, Power, 
  HardDrive, Atom, Database, Layout, Smartphone, Code2, Layers, Cpu, 
  FileCode, Github, GitBranch 
} from 'lucide-react';
import { clsx } from 'clsx';

// --- CONTROLE DE VOLUME ---
const VolumeControl = ({ isOpen }) => {
    const { globalVolume, setGlobalVolume } = useOSStore();
    const trackRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleInteraction = (e) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const heightFromBottom = rect.bottom - clientY;
        const totalHeight = rect.height;
        let percentage = (heightFromBottom / totalHeight) * 1;
        if (percentage < 0) percentage = 0;
        if (percentage > 1) percentage = 1;
        setGlobalVolume(percentage);
    };

    const handleMouseDown = (e) => { setIsDragging(true); handleInteraction(e); };

    useEffect(() => {
        const handleMouseMove = (e) => { if (isDragging) handleInteraction(e); };
        const handleMouseUp = () => { setIsDragging(false); };
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    if (!isOpen) return null;

    return (
        <div 
            className="absolute bottom-8 right-0 mb-1 w-[80px] h-[200px] bg-[#ece9d8] border border-[#aca899] shadow-[2px_2px_5px_rgba(0,0,0,0.5)] z-[100] select-none flex flex-col items-center pt-2 pb-2 rounded-t-md cursor-default"
            onClick={(e) => e.stopPropagation()}
        >
            <span className="text-[10px] text-black mb-2 font-tahoma">Volume</span>
            <div className="flex-1 flex justify-center py-2">
                <div ref={trackRef} onMouseDown={handleMouseDown} className="relative w-[4px] h-full bg-[#dcdcdc] border border-[#808080] shadow-[inset_1px_1px_0_#fff] cursor-pointer">
                    <div 
                        className="absolute left-1/2 -translate-x-1/2 w-[20px] h-[10px] bg-[#ece9d8] border-t border-l border-white border-b border-r border-[#aca899] shadow-sm pointer-events-none"
                        style={{ bottom: `calc(${globalVolume * 100}% - 5px)` }}
                    >
                        <div className="w-full h-full border border-[#aca899] opacity-50"></div>
                    </div>
                </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
                <div className="w-3 h-3 border border-[#1c5180] bg-white flex items-center justify-center cursor-pointer" onClick={() => setGlobalVolume(globalVolume === 0 ? 0.5 : 0)}>
                    {globalVolume === 0 && <div className="w-2 h-2 bg-black"></div>}
                </div>
                <span className="text-[9px] text-black">Mute</span>
            </div>
        </div>
    );
};

// --- MENU INICIAR ---
const StartMenu = ({ isOpen, onClose }) => {
  const { setBootStatus, currentUser } = useOSStore();
  if (!isOpen) return null;

  const handleLogoff = () => { onClose(); setTimeout(() => setBootStatus('login'), 500); };
  const handleShutdown = () => window.location.reload();

  // Componente para a coluna esquerda (Tech Stack Principal)
  const TechItem = ({ icon, label, subLabel }) => (
    <div className="flex items-center gap-2 p-2 hover:bg-[#316ac5] hover:text-white text-slate-800 rounded-[3px] cursor-default group transition-colors mb-1">
        <div className={`flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center border border-gray-300 shadow-sm bg-white`}>
            {icon}
        </div>
        <div className="flex flex-col leading-tight">
            <span className="text-xs font-bold">{label}</span>
            <span className="text-[9px] text-slate-500 group-hover:text-blue-100">{subLabel}</span>
        </div>
    </div>
  );

  // Componente para a coluna direita (Conceitos/Ferramentas)
  const ConceptItem = ({ icon, label }) => (
    <div className="flex items-center gap-2 p-1.5 hover:bg-[#316ac5] hover:text-white rounded-[3px] cursor-default group transition-colors text-[#1e395b]">
        <div className="opacity-80 group-hover:opacity-100 group-hover:text-white text-[#1e395b]">{icon}</div>
        <span className="text-xs group-hover:text-white">{label}</span>
    </div>
  );

  return (
    <div 
        className="absolute bottom-0 left-0 w-[380px] h-[450px] rounded-tr-lg rounded-tl-lg overflow-hidden font-sans shadow-[4px_4px_10px_rgba(0,0,0,0.5)] z-50 flex flex-col animate-in slide-in-from-bottom-2 origin-bottom-left cursor-default" 
        onClick={(e) => e.stopPropagation()} 
        style={{ border: '2px solid #003399', borderBottom: 'none', fontFamily: 'Tahoma, sans-serif' }}
    >
      {/* HEADER: Usuário */}
      <div className="h-16 bg-gradient-to-b from-[#1c5eb8] to-[#2470d6] flex items-center px-3 gap-3 border-b border-[#003399] shadow-md relative z-20">
          <div className="w-12 h-12 rounded-[4px] border-2 border-white bg-[#d3e5fa] overflow-hidden shadow-sm p-0.5 relative">
             <img src={currentUser?.avatar || "https://i.pravatar.cc/150"} alt="" className="w-full h-full object-cover rounded-[2px]"/>
          </div>
          <span className="text-white font-bold text-xl drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">{currentUser?.name || "Visitante"}</span>
      </div>

      {/* CORPO DO MENU */}
      <div className="flex-1 flex relative bg-white">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#e59700] z-10"></div>
          
          {/* COLUNA ESQUERDA: STACK PRINCIPAL */}
          <div className="w-[60%] p-2 flex flex-col border-r border-[#95bdee]">
              <span className="text-[10px] font-bold text-gray-400 mb-2 pl-1">CORE STACK</span>
              
              <TechItem 
                icon={<Atom size={20} className="text-[#61DAFB]"/>} 
                label="React" 
                subLabel="Frontend Library" 
              />
              <TechItem 
                icon={<Code2 size={20} className="text-[#F7DF1E]"/>} 
                label="JavaScript" 
                subLabel="ES6+ Development" 
              />
              <TechItem 
                icon={<FileCode size={20} className="text-[#3776AB]"/>} 
                label="Python" 
                subLabel="Backend & Scripting" 
              />
              <TechItem 
                icon={<Database size={20} className="text-[#00758F]"/>} 
                label="SQL" 
                subLabel="Database Management" 
              />
              
              <div className="h-[1px] bg-gray-200 w-[95%] self-center my-2"></div>
          </div>

          {/* COLUNA DIREITA: ARQUITETURA E FERRAMENTAS */}
          <div className="w-[40%] bg-[#d3e5fa] p-2 flex flex-col gap-1 border-l border-white/50 pt-3">
              <span className="text-[10px] font-bold text-[#1e395b]/50 mb-1 pl-1">ARCHITECTURE</span>
              
              <ConceptItem icon={<Layout size={16}/>} label="Responsive Design" />
              <ConceptItem icon={<Layers size={16}/>} label="Scalable Arch." />
              <ConceptItem icon={<Smartphone size={16}/>} label="Mobile First" />
              <ConceptItem icon={<Cpu size={16}/>} label="Performance" />
              
              <div className="h-[1px] bg-[#aebdd1] my-2 shadow-[0_1px_0_white]"></div>
              
              <span className="text-[10px] font-bold text-[#1e395b]/50 mb-1 pl-1">TOOLS</span>
              <ConceptItem icon={<Github size={16}/>} label="GitHub" />
              <ConceptItem icon={<GitBranch size={16}/>} label="Git / Versioning" />
          </div>
      </div>

      {/* FOOTER: AÇÕES */}
      <div className="h-12 bg-gradient-to-b from-[#1c5eb8] to-[#2470d6] flex items-center justify-end px-4 gap-4 border-t border-[#003399] shadow-[inset_0_2px_2px_rgba(255,255,255,0.2)]">
          <button onClick={handleLogoff} className="flex items-center gap-1 text-white text-[11px] hover:brightness-110 transition-all group cursor-pointer">
              <div className="bg-[#e6a020] p-1 rounded-[3px] border border-white/30 shadow-sm group-hover:shadow-md">
                  <LogOut size={14} className="text-white" strokeWidth={2.5}/>
              </div>
              <span>Log Off</span>
          </button>
          
          <button onClick={handleShutdown} className="flex items-center gap-1 text-white text-[11px] hover:brightness-110 transition-all group cursor-pointer">
              <div className="bg-[#e0422e] p-1 rounded-[3px] border border-white/30 shadow-sm group-hover:shadow-md">
                  <Power size={14} className="text-white" strokeWidth={2.5}/>
              </div>
              <span>Turn Off Computer</span>
          </button>
      </div>
    </div>
  );
};

// --- BARRA DE TAREFAS PRINCIPAL ---
export const Taskbar = () => {
  const { windows, activeWindowId, focusWindow, restoreWindow, minimizeWindow, globalVolume, themeMode } = useOSStore();
  const [startOpen, setStartOpen] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [time, setTime] = useState(new Date());

  const getVolumeIcon = () => {
      if (globalVolume === 0) return <VolumeX size={14}/>;
      if (globalVolume < 0.5) return <Volume1 size={14}/>;
      return <Volume2 size={14}/>;
  };

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  useEffect(() => {
    const handleClick = (e) => {
        if (startOpen && !e.target.closest('.start-menu-container')) setStartOpen(false);
        if (showVolume && !e.target.closest('.volume-container')) setShowVolume(false);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [startOpen, showVolume]);

  const isDark = themeMode === 'dark';

  return (
    <>
      <div className="fixed bottom-[30px] left-0 z-[100] start-menu-container">
          <StartMenu isOpen={startOpen} onClose={() => setStartOpen(false)} />
      </div>
      
      <div 
        className="fixed bottom-0 w-full h-[30px] flex items-center justify-between z-[9999] select-none" 
        style={{ 
            background: isDark ? 'linear-gradient(to bottom, #333 0%, #111 100%)' : 'linear-gradient(to bottom, #245db5 0%, #3d78d6 5%, #3d78d6 80%, #1941a5 100%)', 
            borderTop: isDark ? '1px solid #444' : '1px solid #649cec', 
            fontFamily: 'Tahoma, sans-serif' 
        }}
      >
        {/* Botão Iniciar */}
        <div className="relative start-menu-container z-50">
           <button 
                onClick={(e) => { e.stopPropagation(); setStartOpen(!startOpen); }} 
                className="h-[30px] w-auto pr-3 pl-0 rounded-r-[14px] flex items-center gap-1 transition-all hover:brightness-110 active:brightness-90 overflow-visible relative cursor-pointer" 
                style={{ 
                    background: 'linear-gradient(to bottom, #3c8e2f 0%, #4fba32 8%, #4fba32 80%, #2d6921 100%)', 
                    boxShadow: '2px 2px 2px rgba(0,0,0,0.4)', 
                    border: '1px solid #2b5c22', 
                    borderLeft: 'none', 
                    borderTopRightRadius: '14px', 
                    borderBottomRightRadius: '14px' 
                }}
            >
                <div className="w-6 h-6 ml-1 italic font-bold text-white bg-gradient-to-br from-white/40 to-transparent rounded-full flex items-center justify-center border border-white/30 shadow-sm">
                    <div className="grid grid-cols-2 gap-[1px] transform -rotate-12 scale-75">
                        <div className="w-2 h-2 bg-[#f2552e] rounded-tl-sm"></div>
                        <div className="w-2 h-2 bg-[#8bc43d] rounded-tr-sm"></div>
                        <div className="w-2 h-2 bg-[#2d9fe6] rounded-bl-sm"></div>
                        <div className="w-2 h-2 bg-[#fdbd08] rounded-br-sm"></div>
                    </div>
                </div>
                <span className="text-white font-bold italic text-lg drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)] pr-1" style={{fontFamily: 'Trebuchet MS, sans-serif'}}>start</span>
           </button>
        </div>

        {/* Lista de Janelas */}
        <div className="flex-1 flex items-center gap-1 px-1 overflow-x-auto h-full">
          {windows.map((win) => {
             const isActive = activeWindowId === win.id && !win.isMinimized;
             return (
                 <button 
                    key={win.id} 
                    onClick={() => { if (win.isMinimized) restoreWindow(win.id); else if (isActive) minimizeWindow(win.id); else focusWindow(win.id); }} 
                    className={clsx(
                        "relative h-[24px] px-2 min-w-[150px] w-[160px] rounded-[2px] flex items-center justify-start gap-2 text-shadow overflow-hidden transition-colors font-sans cursor-pointer",
                        isActive 
                            ? "bg-[#1e52b7] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)] text-white border border-[#103375] opacity-90" 
                            : "bg-[#3c81f0] hover:bg-[#5394f7] text-white border-t border-l border-[#6eb0f8] border-b border-r border-[#1941a5] shadow-[1px_1px_0_rgba(0,0,0,0.2)]"
                    )}
                 >
                   <div className="w-4 h-4 min-w-[16px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full drop-shadow-md">
                       {win.icon}
                   </div>
                   <span className="text-[11px] truncate">{win.title}</span>
                 </button>
             );
          })}
        </div>

        {/* Bandeja do Sistema */}
        <div className="flex items-center gap-2 px-3 h-[30px] bg-[#1293e8] border-l border-[#103375] shadow-[inset_2px_0_5px_rgba(0,0,0,0.2)] relative volume-container" style={{ background: isDark ? '#222' : '#1293e8' }}>
           <div className="w-4 h-4 bg-[#1c5eb8] rounded-full flex items-center justify-center shadow-sm border border-white/30 cursor-pointer hover:brightness-110"><ChevronRight size={10} className="text-white transform rotate-180"/></div>
           <div className="flex gap-2 text-white drop-shadow-md mx-1 items-center relative">
               <div onClick={(e) => { e.stopPropagation(); setShowVolume(!showVolume); }} className="cursor-pointer hover:text-slate-200">{getVolumeIcon()}</div>
               <VolumeControl isOpen={showVolume} />
               <HardDrive size={14} className="cursor-pointer hover:text-slate-200 animate-pulse"/>
               <div className="w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm cursor-pointer" title="Status"></div>
           </div>
           <div className="text-white text-[11px] font-sans px-1 cursor-default">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </div>
        <div className="w-3 h-full border-l border-white/30 hover:bg-white/30 cursor-pointer ml-1"></div>
      </div>
    </>
  );
};