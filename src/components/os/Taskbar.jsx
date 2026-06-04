import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Browser } from '../apps/Browser';
import { 
  Volume2, Volume1, VolumeX, ChevronRight, LogOut, Power, 
  HardDrive, Atom, Database, Layout, Smartphone, Code2, Layers, Cpu, 
  FileCode, Github, GitBranch, Folder, Monitor, Settings, Printer,
  HelpCircle, Search, Minimize2, X
} from 'lucide-react';
import { clsx } from 'clsx';

// --- VOLUME SPEAKER SVG (XP STYLE) ---
const XPSpeakerIcon = ({ size = 14, volume = 0.5 }) => {
  const w = size;
  const h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="3" height="6" fill="currentColor"/>
      <polygon points="6,6 12,3 12,15 6,12" fill="currentColor"/>
      {volume > 0 && (
        <>
          <path d="M13 7 Q16 9 13 11" stroke="currentColor" strokeWidth="1.2" fill="none"/>
          <path d="M14 5 Q18 9 14 13" stroke="currentColor" strokeWidth="1.2" fill="none"/>
        </>
      )}
    </svg>
  );
};

// --- CONTROLE DE VOLUME XP ---
const VolumeControl = ({ isOpen, isWin7 }) => {
    const { globalVolume, setGlobalVolume } = useOSStore();
    const trackRef = useRef(null);
    const prevVolumeRef = useRef(globalVolume || 0.5);
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

    const handleMuteToggle = () => {
        if (globalVolume === 0) {
            setGlobalVolume(prevVolumeRef.current);
        } else {
            prevVolumeRef.current = globalVolume;
            setGlobalVolume(0);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="absolute bottom-8 right-0 mb-1 w-[96px] h-[200px] bg-[#ece9d8] border border-[#aca899] shadow-[2px_2px_5px_rgba(0,0,0,0.5)] z-[100] select-none flex flex-col items-center pt-2 pb-2 cursor-default"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center gap-1 mb-2">
                <XPSpeakerIcon size={12} volume={globalVolume} />
                <span className="text-[10px] text-black font-tahoma">Volume</span>
            </div>
            <div className="flex-1 flex justify-center py-2">
                <div ref={trackRef} onMouseDown={handleMouseDown} className="relative w-[12px] h-full bg-[#d4d0c8] border-t border-l border-[#666] border-b border-r border-white shadow-[inset_1px_1px_0_#999,inset_-1px_-1px_0_#fff] cursor-pointer">
                    <div 
                        className="absolute left-1/2 -translate-x-1/2 w-[22px] h-[14px] bg-[#ece9d8] border-t border-l border-white border-b border-r border-[#666] shadow-[1px_1px_0_rgba(0,0,0,0.3)] pointer-events-none"
                        style={{ bottom: `calc(${globalVolume * 100}% - 7px)` }}
                    >
                        <div className="w-full h-full border border-[#aca899]/60"></div>
                    </div>
                </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
                <div className="relative w-[13px] h-[13px] bg-white border border-[#666] shadow-[inset_1px_1px_0_#fff] flex items-center justify-center cursor-pointer" onClick={handleMuteToggle}>
                    {globalVolume === 0 && (
                        <svg viewBox="0 0 10 10" className="w-[10px] h-[10px]" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round">
                            <path d="M2 2 L8 8 M8 2 L2 8"/>
                        </svg>
                    )}
                </div>
                <span className="text-[11px] text-black font-tahoma">Mudo</span>
            </div>
        </div>
    );
};

// --- ITENS DO MENU INICIAR (Declarados fora para evitar recriação) ---
const TechItem = ({ icon, label, subLabel, isMobile = false }) => (
  <div className={`flex items-center gap-2 hover:bg-[#316ac5] hover:text-white text-slate-800 rounded-[2px] cursor-default group transition-colors ${isMobile ? 'p-2' : 'p-1.5'}`}>
      <div className={`flex-shrink-0 rounded-[3px] flex items-center justify-center border border-[#808080] shadow-[inset_1px_1px_0_#fff] bg-white ${isMobile ? 'w-9 h-9' : 'w-8 h-8'}`}>
          {icon}
      </div>
      <div className="flex flex-col leading-tight">
          <span className={`font-bold ${isMobile ? 'text-xs' : 'text-[11px]'}`}>{label}</span>
          <span className={`text-slate-500 group-hover:text-blue-100 ${isMobile ? 'text-[9px]' : 'text-[9px]'}`}>{subLabel}</span>
      </div>
  </div>
);

const ConceptItem = ({ icon, label, isMobile = false }) => (
  <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#316ac5] hover:text-white rounded-[2px] cursor-default group transition-colors text-[#1e395b]">
      <div className="opacity-80 group-hover:opacity-100 group-hover:text-white text-[#1e395b]">{icon}</div>
      <span className={`group-hover:text-white ${isMobile ? 'text-xs' : 'text-[11px]'}`}>{label}</span>
  </div>
);

// --- MENU INICIAR ---
const StartMenu = ({ isOpen, onClose, onCloseComplete, isMobile = false }) => {
  const { setBootStatus, currentUser, theme, breakpoint, openWindow, clearWindows } = useOSStore();
  const [logoffConfirm, setLogoffConfirm] = useState(false);
  if (!isOpen) return null;

  const isWin7 = theme === 'win7';
  const isPhone = breakpoint === 'phone';

  const handleLogoff = () => { setLogoffConfirm(true); };
  const confirmLogoff = () => { setLogoffConfirm(false); onClose(); onCloseComplete?.(); clearWindows(); setTimeout(() => setBootStatus('login'), 500); };
  const cancelLogoff = () => { setLogoffConfirm(false); };
  const handleShutdown = () => { onClose(); onCloseComplete?.(); setTimeout(() => window.location.reload(), 500); };

  const handleOpen = (id, title, icon, component) => {
    onClose();
    setTimeout(() => openWindow(id, title, icon, component), 100);
  };

  const recentPrograms = [
    { id: 'browser', label: 'Internet Explorer', icon: 'ie' },
    { id: 'wmp', label: 'Windows Media Player', icon: 'wmp' },
    { id: 'msg-main', label: 'Windows Live Messenger', icon: 'msn' },
    { id: 'paint', label: 'Paint', icon: 'paint' },
    { id: 'cmd', label: 'Prompt de Comando', icon: 'cmd' },
    { id: 'calc', label: 'Calculadora', icon: 'calc' },
  ];

  const systemLinks = [
    { label: 'Documentos', action: () => handleOpen('folder-docs', 'Documentos', null, null), icon: 'Shell32.dll/shell32_23.ico' },
    { label: 'Imagens', action: () => handleOpen('folder-imgs', 'Imagens', null, null), icon: 'Shell32.dll/shell32_24.ico' },
    { label: 'Música', action: () => handleOpen('folder-musics', 'Música', null, null), icon: 'Shell32.dll/shell32_25.ico' },
    { label: 'Computador', action: () => handleOpen('file-c', 'Computador', null, null), icon: 'Shell32.dll/explorer_ICO_MYCOMPUTER.ico' },
    { label: 'Painel de Controle', action: () => handleOpen('settings', 'Painel de Controle', null, null), icon: 'Control%20Panel/imageres_27.ico' },
    { label: 'Dispositivos', action: () => {}, icon: 'Shell32.dll/shell32_7.ico' },
    { label: 'Ajuda e Suporte', action: () => {}, icon: 'Shell32.dll/shell32_5.ico' },
  ];

  if (isWin7) {
    return (
      <>
        <div
          className={`absolute bottom-0 left-0 overflow-hidden z-50 flex flex-col cursor-default ${isPhone ? 'fixed inset-0 !w-full !h-full rounded-none' : (isMobile ? 'w-[95vw] max-w-[500px] h-[80vh] max-h-[560px]' : 'w-[400px] h-[480px]')}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(245, 245, 245, 0.97)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          borderRadius: isPhone ? 0 : '4px 4px 0 0',
          fontFamily: '"Segoe UI", Tahoma, sans-serif',
        }}
      >
        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left - Recent programs */}
          <div className="flex-1 p-2 overflow-y-auto border-r border-[#D0D0D0]">
            <div className="text-[10px] font-bold text-[#0078D7] uppercase px-2 mb-1">Programas</div>
            {recentPrograms.map((p, i) => {
              const iconMap = {
                ie: 'Internet%20Explorer/iexplore_7.ico',
                wmp: 'Windows%20Media%20Player/wmplayer_120.ico',
                msn: 'Default%20Programs/notepad_2.ico',
                paint: 'Default%20Programs/mspaint_2.ico',
                cmd: 'Default%20Programs/cmd_IDI_APPICON.ico',
                calc: 'Control%20Panel/imageres_27.ico',
              };
              const iconUrl = `https://cdn.jsdelivr.net/gh/Visnalize/resources@main/icons/win7/${iconMap[p.icon] || 'Default%20Programs/notepad_2.ico'}`;
              return (
              <div
                key={i}
                onClick={() => {
                  onClose();
                  setTimeout(() => openWindow(p.id, p.label, null, null), 100);
                }}
                className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-[#316ac5] hover:text-white rounded-[2px] cursor-default text-[11px]"
              >
                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center opacity-80">
                  <img src={iconUrl} alt="" className="w-full h-full" draggable={false} />
                </div>
                <span>{p.label}</span>
              </div>
              );
            })}
            <div className="border-t border-[#D0D0D0] mt-2 pt-1">
              <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#316ac5] hover:text-white rounded-[2px] cursor-default text-[11px] font-semibold">
                <span>Todos os Programas</span>
                <span className="text-[8px]">▸</span>
              </div>
            </div>
          </div>

          {/* Right - System links */}
          <div className="w-[180px] bg-[#E8ECF0] p-2 overflow-y-auto">
            <div className="text-[10px] font-bold text-gray-500 uppercase mb-1 px-1">Sistema</div>
            {systemLinks.map((item, i) => (
              <div
                key={i}
                onClick={item.action}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#316ac5] hover:text-white rounded-[2px] cursor-default text-[11px]"
              >
                <div className="w-4 h-4 flex-shrink-0 opacity-70">
                  <img src={`https://cdn.jsdelivr.net/gh/Visnalize/resources@main/icons/win7/${item.icon}`} alt="" className="w-full h-full" draggable={false} />
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search + Shutdown */}
        <div className="flex items-center gap-2 px-3 py-2 border-t border-[#D0D0D0]" style={{ background: '#E8ECF0' }}>
          <div className="flex-1 flex items-center bg-white border border-[#C0C0C0] rounded-sm px-2 py-1 gap-1">
            <Search size={12} className="text-gray-400" />
            <input
              placeholder="Pesquisar programas e arquivos"
              className="text-[11px] outline-none bg-transparent w-full text-gray-600"
              readOnly
            />
          </div>
          <button onClick={handleShutdown} className="flex items-center gap-1 px-3 py-1 text-[11px] hover:bg-[#D0D0D0] rounded cursor-pointer text-[#333]">
            <Power size={14} />
           </button>
         </div>
        </div>
       {logoffConfirm && (
        <div className="fixed inset-0 bg-black/40 z-[99999] flex items-center justify-center" onClick={cancelLogoff}>
          <div className="bg-[#ece9d8] border-2 border-[#003399] rounded-lg shadow-2xl p-6 w-80" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[#003399] font-bold text-sm mb-3">Log Off</h3>
            <p className="text-[11px] text-gray-700 mb-4">Deseja realmente fazer log off?</p>
            <div className="flex justify-end gap-2">
              <button onClick={confirmLogoff} className="px-4 py-1.5 text-[11px] bg-gradient-to-b from-[#87b3ff] to-[#1647b3] text-white border border-[#003399] rounded-[3px] cursor-pointer hover:brightness-110">Sim</button>
              <button onClick={cancelLogoff} className="px-4 py-1.5 text-[11px] bg-gradient-to-b from-[#fff] to-[#ccc] text-black border border-[#808080] rounded-[3px] cursor-pointer hover:brightness-110">Não</button>
            </div>
          </div>
        </div>
      )}
      </>
    );
  }

  // XP Start Menu
  return (
    <>
    <div 
        className={`absolute bottom-0 left-0 overflow-hidden font-sans shadow-[4px_4px_12px_rgba(0,0,0,0.5)] z-50 flex flex-col animate-in slide-in-from-bottom-2 origin-bottom-left cursor-default ${isPhone ? 'fixed inset-0 !w-full !h-full rounded-none' : `${isMobile ? 'w-[95vw] max-w-[400px] h-[80vh] max-h-[500px] rounded-tr-[8px] rounded-tl-[8px]' : 'w-[420px] h-[485px] rounded-tr-[8px] rounded-tl-[8px]'}`}`}
        onClick={(e) => e.stopPropagation()} 
        style={{ border: '2px solid #003399', borderBottom: 'none', fontFamily: 'Tahoma, sans-serif' }}
    >
      <div className={`bg-gradient-to-b from-[#1c5eb8] to-[#2470d6] flex items-center px-3 gap-3 border-b border-[#003399] shadow-md relative z-20 ${isMobile ? 'h-16' : 'h-[72px]'}`}>
          <div className={`rounded-[3px] border-2 border-white bg-[#d3e5fa] overflow-hidden shadow-sm p-[1px] ${isMobile ? 'w-10 h-10' : 'w-11 h-11'}`}>
             <img src={currentUser?.avatar || "https://i.pravatar.cc/150"} alt="" className="w-full h-full object-cover rounded-[2px]"/>
          </div>
          <span className="text-white font-bold drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]" style={{ fontSize: isMobile ? '14px' : '16px' }}>{currentUser?.name || "Visitante"}</span>
      </div>

      <div className="flex-1 flex relative bg-white">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#e59700] z-10"></div>
          <div className="w-[60%] p-2 flex flex-col border-r border-[#95bdee]">
              <span className="text-[10px] font-bold text-gray-500 mb-1 pl-1 uppercase tracking-wide">Desenvolvedor</span>
              <TechItem icon={<Atom size={18} className="text-[#61DAFB]"/>} label="React" subLabel="Frontend Library" isMobile={isMobile} />
              <TechItem icon={<Code2 size={18} className="text-[#F7DF1E]"/>} label="JavaScript" subLabel="ES6+ Development" isMobile={isMobile} />
              <TechItem icon={<FileCode size={18} className="text-[#3776AB]"/>} label="Python" subLabel="Backend & Scripting" isMobile={isMobile} />
              <TechItem icon={<Database size={18} className="text-[#00758F]"/>} label="SQL" subLabel="Database Management" isMobile={isMobile} />
              <div className="h-[1px] bg-gray-200 w-[95%] self-center my-2"></div>
          </div>
          <div className="w-[40%] bg-[#d3e5fa] p-2 flex flex-col gap-0.5 border-l border-white/50 pt-3">
              <span className="text-[10px] font-bold text-[#1e395b]/60 mb-0.5 pl-1 uppercase tracking-wide">Conceitos</span>
              <ConceptItem icon={<Layout size={14}/>} label="Responsive Design" isMobile={isMobile} />
              <ConceptItem icon={<Layers size={14}/>} label="Scalable Arch." isMobile={isMobile} />
              <ConceptItem icon={<Smartphone size={14}/>} label="Mobile First" isMobile={isMobile} />
              <ConceptItem icon={<Cpu size={14}/>} label="Performance" isMobile={isMobile} />
              <div className="h-[1px] bg-[#aebdd1] my-1.5 shadow-[0_1px_0_white]"></div>
              <span className="text-[10px] font-bold text-[#1e395b]/60 mb-0.5 pl-1 uppercase tracking-wide">Ferramentas</span>
              <ConceptItem icon={<Github size={14}/>} label="GitHub" isMobile={isMobile} />
              <ConceptItem icon={<GitBranch size={14}/>} label="Git / Versioning" isMobile={isMobile} />
          </div>
      </div>

      <div className="h-11 bg-gradient-to-b from-[#1c5eb8] to-[#2470d6] flex items-center justify-end px-3 gap-2 border-t border-[#003399] shadow-[inset_0_2px_2px_rgba(255,255,255,0.2)]">
          <button onClick={handleLogoff} className="flex items-center gap-1.5 text-white text-[11px] hover:brightness-110 transition-all group cursor-pointer h-8 px-2 rounded-[3px] hover:bg-white/10">
              <div className="bg-[#e6a020] p-1 rounded-[2px] border border-white/20 shadow-sm">
                  <LogOut size={12} className="text-white" strokeWidth={2.5}/>
              </div>
              <span>Log Off</span>
          </button>
          <button onClick={handleShutdown} className="flex items-center gap-1.5 text-white text-[11px] hover:brightness-110 transition-all group cursor-pointer h-8 px-2 rounded-[3px] hover:bg-white/10">
              <div className="bg-[#e0422e] p-1 rounded-[2px] border border-white/20 shadow-sm">
                  <Power size={12} className="text-white" strokeWidth={2.5}/>
              </div>
               <span>Turn Off Computer</span>
           </button>
       </div>
       </div>
       {logoffConfirm && (
         <div className="fixed inset-0 bg-black/40 z-[99999] flex items-center justify-center" onClick={cancelLogoff}>
           <div className="bg-[#ece9d8] border-2 border-[#003399] rounded-lg shadow-2xl p-6 w-80" onClick={(e) => e.stopPropagation()}>
             <h3 className="text-[#003399] font-bold text-sm mb-3">Log Off</h3>
             <p className="text-[11px] text-gray-700 mb-4">Deseja realmente fazer log off?</p>
             <div className="flex justify-end gap-2">
               <button onClick={confirmLogoff} className="px-4 py-1.5 text-[11px] bg-gradient-to-b from-[#87b3ff] to-[#1647b3] text-white border border-[#003399] rounded-[3px] cursor-pointer hover:brightness-110">Sim</button>
               <button onClick={cancelLogoff} className="px-4 py-1.5 text-[11px] bg-gradient-to-b from-[#fff] to-[#ccc] text-black border border-[#808080] rounded-[3px] cursor-pointer hover:brightness-110">Não</button>
             </div>
           </div>
         </div>
       )}
    </>
  );
};

// --- BARRA DE TAREFAS PRINCIPAL ---
export const Taskbar = ({ isMobile = false }) => {
  const { windows, activeWindowId, focusWindow, restoreWindow, minimizeWindow, globalVolume, themeMode, theme, breakpoint } = useOSStore();
  const [startOpen, setStartOpen] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isStartActive, setIsStartActive] = useState(false);
  const [jumpList, setJumpList] = useState(null); // { winId, x, y }

  const isWin7 = theme === 'win7';
  const isPhone = breakpoint === 'phone';

  const JUMP_ITEMS = {
    browser: [
      { label: 'GitHub', icon: '🌐', onClick: 'https://github.com' },
      { label: 'Histórico Recente', icon: '📋', onClick: null },
    ],
    wmp: [
      { label: 'Dream Scapes', icon: '🎵', onClick: null },
      { label: 'Playlists', icon: '📃', onClick: null },
    ],
    about: [
      { label: 'Ver Currículo', icon: '📄', onClick: null },
    ],
    msg: [
      { label: 'Conversar com Fsociety', icon: '💬', onClick: null },
    ],
  };

  const taskbarHeight = isPhone ? 'h-[48px]' : (isMobile ? 'h-[40px]' : (isWin7 ? 'h-[40px]' : 'h-[30px]'));
  const iconSize = isMobile ? 18 : (isWin7 ? 20 : 14);
  const startOrbSize = isPhone ? 40 : (isWin7 ? 34 : 28);

  const getVolumeIcon = () => {
      if (isWin7) {
          if (globalVolume === 0) return <VolumeX size={iconSize}/>;
          if (globalVolume < 0.5) return <Volume1 size={iconSize}/>;
          return <Volume2 size={iconSize}/>;
      }
      return <XPSpeakerIcon size={iconSize} volume={globalVolume} />;
  };

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  useEffect(() => {
    const handleClick = (e) => {
        if (startOpen && !e.target.closest('.start-menu-container')) { setStartOpen(false); setIsStartActive(false); }
        if (showVolume && !e.target.closest('.volume-container')) setShowVolume(false);
        if (jumpList && !e.target.closest('.jump-list')) setJumpList(null);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [startOpen, showVolume, jumpList]);

  const isDark = themeMode === 'dark';

  // --- Win7 Taskbar ---
  if (isWin7) {
    return (
      <>
        <div className={`fixed ${taskbarHeight} left-0 z-[100] start-menu-container`} style={{ bottom: isPhone ? '48px' : '40px' }}>
          <StartMenu isOpen={startOpen} onClose={() => setStartOpen(false)} onCloseComplete={() => setIsStartActive(false)} isMobile={isMobile} />
        </div>

        <div
          className={`fixed bottom-0 w-full ${taskbarHeight} flex items-center justify-between z-[9999] select-none`}
          style={{
            background: 'linear-gradient(to bottom, rgba(200,210,230,0.75) 0%, rgba(180,192,215,0.85) 3%, rgba(160,172,195,0.9) 97%, rgba(140,152,175,0.95) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255,255,255,0.3)',
            fontFamily: '"Segoe UI", Tahoma, sans-serif',
          }}
        >
          {/* Start Orb */}
          <div className="relative start-menu-container z-50 h-full flex items-center">
            <button
              onClick={(e) => { e.stopPropagation(); setStartOpen(!startOpen); setIsStartActive(!startOpen); }}
              className="h-full flex items-center justify-center hover:brightness-110 transition-all cursor-pointer touch-manipulation"
              style={{ width: startOrbSize + 16 }}
            >
              <svg width={startOrbSize} height={startOrbSize} viewBox="0 0 50 50">
                <defs>
                  <radialGradient id="orbGrad" cx="35%" cy="30%">
                    <stop offset="0%" stopColor="#a0e8ff"/>
                    <stop offset="40%" stopColor="#50b8f0"/>
                    <stop offset="80%" stopColor="#2080c8"/>
                    <stop offset="100%" stopColor="#0f5090"/>
                  </radialGradient>
                </defs>
                <circle cx="25" cy="25" r="23" fill="url(#orbGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                <path d="M17 20 L25 8 L33 20 L25 14 Z" fill="rgba(255,255,255,0.7)"/>
              </svg>
            </button>
          </div>

          {/* Window buttons (Superbar style) */}
          <div className="flex-1 flex items-center gap-0.5 px-0.5 overflow-x-auto h-full relative">
            {windows.map((win) => {
              const isActive = activeWindowId === win.id && !win.isMinimized;
              const items = JUMP_ITEMS[win.id];
              return (
                <div key={win.id} className="relative h-full">
                  <button
                    onClick={() => { if (win.isMinimized) restoreWindow(win.id); else if (isActive) minimizeWindow(win.id); else focusWindow(win.id); }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      const rect = e.currentTarget.getBoundingClientRect();
                      setJumpList(jumpList?.winId === win.id ? null : { winId: win.id, x: rect.left, y: rect.top - 10 });
                    }}
                    className="relative h-full flex items-center justify-center transition-colors cursor-pointer"
                    style={{
                      width: isPhone ? '48px' : '52px',
                      minWidth: isPhone ? '48px' : '52px',
                      background: isActive ? 'rgba(255,255,255,0.3)' : 'transparent',
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div className="w-5 h-5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full">
                      {win.icon}
                    </div>
                    {isActive && <div className="absolute bottom-0 left-1 right-1 h-[3px] bg-[#7bc5ff] rounded-full shadow-[0_0_4px_rgba(123,197,255,0.6)]" />}
                  </button>
                  {jumpList?.winId === win.id && items && (
                    <div
                      className="jump-list absolute bottom-full left-0 mb-1 z-[99999] py-1 min-w-[180px]"
                      style={{
                        background: 'rgba(240,240,245,0.97)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0,0,0,0.15)',
                        borderRadius: '6px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        fontFamily: '"Segoe UI", Tahoma, sans-serif',
                      }}
                    >
                      <div className="px-3 py-1.5 text-gray-500 text-[10px] font-semibold uppercase border-b border-gray-200">
                        Recente
                      </div>
                      {items.map((item, i) => (
                        <button
                          key={i}
                          className="w-full px-3 py-1.5 text-gray-700 text-[12px] flex items-center gap-2 hover:bg-[#316ac5] hover:text-white cursor-pointer text-left"
                          onClick={() => {
                            setJumpList(null);
                            if (typeof item.onClick === 'string' && item.onClick.startsWith('http')) {
                              openWindow('browser', 'Internet Explorer', null, <Browser initialUrl={item.onClick} />);
                            }
                          }}
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* System Tray */}
          <div className="flex items-center gap-1.5 px-3 h-full" style={{ borderLeft: '1px solid rgba(0,0,0,0.1)' }}>
            <div className="flex items-center gap-1.5 relative volume-container">
              <button
                onClick={(e) => { e.stopPropagation(); setShowVolume(!showVolume); }}
                className="text-gray-700 hover:text-black transition-colors cursor-pointer"
              >
                {getVolumeIcon()}
              </button>
              <VolumeControl isOpen={showVolume} isWin7={isWin7} />
            </div>
            <button className="text-gray-700 hover:text-black transition-colors cursor-pointer">
              <HardDrive size={iconSize - 2} />
            </button>
            <div className="text-gray-800 text-[11px] px-1 cursor-default whitespace-nowrap drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]" style={{ fontFamily: '"Segoe UI", Tahoma, sans-serif' }}>
              {time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>

          {/* Aero Peek */}
          <button className="w-[12px] h-full hover:bg-white/20 cursor-pointer ml-0.5" style={{ borderLeft: '1px solid rgba(0,0,0,0.1)' }} title="Show desktop" />
        </div>
      </>
    );
  }

  // --- XP Taskbar ---
  return (
    <>
      <div className={`fixed bottom-0 left-0 z-[100] start-menu-container`} style={{ bottom: isMobile ? '40px' : '30px' }}>
          <StartMenu isOpen={startOpen} onClose={() => setStartOpen(false)} onCloseComplete={() => setIsStartActive(false)} isMobile={isMobile} />
      </div>
      
      <div 
        className={`fixed bottom-0 w-full ${isMobile ? 'h-[40px]' : 'h-[30px]'} flex items-center justify-between z-[9999] select-none`} 
        style={{ 
            background: isDark ? 'linear-gradient(to bottom, #333 0%, #111 100%)' : 'linear-gradient(to bottom, #245db5 0%, #3d78d6 5%, #3d78d6 80%, #1941a5 100%)', 
            borderTop: isDark ? '1px solid #444' : '1px solid #649cec', 
            fontFamily: 'Tahoma, sans-serif' 
        }}
      >
        {/* Botão Iniciar */}
        <div className="relative start-menu-container z-50">
           <button 
                onClick={(e) => { e.stopPropagation(); setStartOpen(!startOpen); setIsStartActive(!startOpen); }} 
                className={`${isMobile ? 'h-[36px]' : 'h-[30px]'} w-auto pr-3 pl-1 rounded-r-[16px] flex items-center gap-1.5 transition-all hover:brightness-110 active:brightness-90 overflow-visible relative cursor-pointer touch-manipulation`}
                style={{ 
                    background: isStartActive 
                        ? 'linear-gradient(to bottom, #3078d6 0%, #4d9de0 8%, #4d9de0 40%, #2f6bb8 100%)' 
                        : 'linear-gradient(to bottom, #368829 0%, #4fba32 5%, #4fba32 40%, #347320 100%)',
                    boxShadow: isStartActive 
                        ? 'inset 1px 1px 2px rgba(255,255,255,0.5), inset -1px -1px 2px rgba(0,0,0,0.3), 1px 1px 2px rgba(0,0,0,0.4)' 
                        : 'inset 1px 1px 1px rgba(255,255,255,0.4), inset -1px -1px 1px rgba(0,0,0,0.2), 2px 2px 2px rgba(0,0,0,0.4)',
                    border: '1px solid #2b5c22', 
                    borderLeft: 'none', 
                    borderTopRightRadius: '16px', 
                    borderBottomRightRadius: '16px'
                }}
            >
                <div className="w-7 h-[26px] ml-0.5 italic font-bold text-white bg-gradient-to-b from-white/50 via-transparent to-transparent rounded-[10px] flex items-center justify-center border border-white/30 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                    <svg viewBox="0 0 20 20" className="w-4 h-4 transform -rotate-12">
                        <rect x="1" y="1" width="8" height="8" rx="1" fill="#f2552e"/>
                        <rect x="11" y="1" width="8" height="8" rx="1" fill="#8bc43d"/>
                        <rect x="1" y="11" width="8" height="8" rx="1" fill="#2d9fe6"/>
                        <rect x="11" y="11" width="8" height="8" rx="1" fill="#fdbd08"/>
                    </svg>
                </div>
                <span className="text-white font-bold italic text-[13px] drop-shadow-[1px_1px_1px_rgba(0,0,0,0.6)] pr-1" style={{fontFamily: "'Trebuchet MS', sans-serif"}}>start</span>
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
                          "relative h-[24px] px-2 min-w-[140px] w-[150px] rounded-[3px] flex items-center justify-start gap-1.5 text-shadow overflow-hidden transition-all font-sans cursor-pointer",
                          isActive 
                              ? "bg-[#1e52b7] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)] text-white border border-[#103375]" 
                              : "bg-[#3c81f0] hover:bg-[#4a8ef5] text-white border-t border-l border-[#6eb0f8] border-b border-r border-[#1941a5] shadow-[1px_1px_0_rgba(0,0,0,0.2)]"
                      )}
                  >
                    <div className="w-4 h-4 min-w-[16px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full drop-shadow-md">
                        {win.icon}
                    </div>
                    <span className="text-[11px] truncate font-normal">{win.title}</span>
                  </button>
              );
          })}
        </div>

        {/* Bandeja do Sistema */}
        <div className="flex items-center gap-1 px-2 border-l border-white/30 relative" style={{ height: isMobile ? '40px' : '30px', background: isDark ? 'linear-gradient(to bottom, #222 0%, #111 100%)' : 'linear-gradient(to bottom, #2478d6 0%, #1073c9 50%, #0b5fa3 100%)' }}>
           <div className="w-5 h-[26px] bg-[#1c5eb8] rounded-sm flex items-center justify-center shadow-sm border border-white/20 cursor-pointer hover:bg-[#2369c9]">
               <ChevronRight size={11} className="text-white transform -rotate-180"/>
           </div>
            <div className="flex gap-1.5 text-white drop-shadow-md mx-1 items-center relative">
                <div onClick={(e) => { e.stopPropagation(); setShowVolume(!showVolume); }} className="cursor-pointer hover:scale-110 transition-transform">{getVolumeIcon()}</div>
                <VolumeControl isOpen={showVolume} isWin7={isWin7} />
                <HardDrive size={14} className="cursor-pointer hover:scale-110 transition-transform"/>
            </div>
            <div className="text-white text-[11px] font-sans px-2 py-1 cursor-default">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </div>
        <div className="w-2 h-full border-l border-black/20 hover:bg-white/10 cursor-pointer ml-0.5"></div>
      </div>
    </>
  );
};