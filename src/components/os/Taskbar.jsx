import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { 
  Volume2, Volume1, VolumeX, ChevronRight, LogOut, Power, 
  HardDrive, Atom, Database, Layout, Smartphone, Code2, Layers, Cpu, 
  FileCode, Github, GitBranch, Folder, Monitor, Settings, Printer,
  HelpCircle, Search, Minimize2, X
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
  const { setBootStatus, currentUser, theme, breakpoint, openWindow } = useOSStore();
  if (!isOpen) return null;

  const isWin7 = theme === 'win7';
  const isPhone = breakpoint === 'phone';

  const handleLogoff = () => { onClose(); onCloseComplete?.(); setTimeout(() => setBootStatus('login'), 500); };
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
    );
  }

  // XP Start Menu
  return (
    <div 
        className={`absolute bottom-0 left-0 rounded-tr-[8px] rounded-tl-[8px] overflow-hidden font-sans shadow-[4px_4px_12px_rgba(0,0,0,0.5)] z-50 flex flex-col animate-in slide-in-from-bottom-2 origin-bottom-left cursor-default ${isMobile ? 'w-[95vw] max-w-[400px] h-[80vh] max-h-[500px]' : 'w-[420px] h-[485px]'}`}
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
      if (globalVolume === 0) return <VolumeX size={iconSize}/>;
      if (globalVolume < 0.5) return <Volume1 size={iconSize}/>;
      return <Volume2 size={iconSize}/>;
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
            background: 'rgba(15, 15, 15, 0.92)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            fontFamily: '"Segoe UI", Tahoma, sans-serif',
          }}
        >
          {/* Start Orb */}
          <div className="relative start-menu-container z-50 h-full flex items-center">
            <button
              onClick={(e) => { e.stopPropagation(); setStartOpen(!startOpen); setIsStartActive(!startOpen); }}
              className="h-full px-1 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer touch-manipulation"
              style={{ width: startOrbSize + 16 }}
            >
              <svg width={startOrbSize} height={startOrbSize} viewBox="0 0 50 50">
                <defs>
                  <radialGradient id="orbGrad" cx="40%" cy="35%">
                    <stop offset="0%" stopColor="#8ce0ff"/>
                    <stop offset="50%" stopColor="#3ca0e0"/>
                    <stop offset="100%" stopColor="#1068b0"/>
                  </radialGradient>
                </defs>
                <circle cx="25" cy="25" r="23" fill="url(#orbGrad)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                <path d="M15 20 L25 10 L35 20 L25 15 Z" fill="rgba(255,255,255,0.6)" opacity="0.4"/>
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
                      background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div className="w-5 h-5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full opacity-80">
                      {win.icon}
                    </div>
                    {isActive && <div className="absolute bottom-0 left-1 right-1 h-[3px] bg-[#7bc5ff] rounded-full" />}
                  </button>
                  {jumpList?.winId === win.id && items && (
                    <div
                      className="jump-list absolute bottom-full left-0 mb-1 z-[99999] py-1 min-w-[180px]"
                      style={{
                        background: 'rgba(30, 30, 30, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        fontFamily: '"Segoe UI", Tahoma, sans-serif',
                      }}
                    >
                      <div className="px-3 py-1.5 text-white/50 text-[10px] font-semibold uppercase border-b border-white/10">
                        Recente
                      </div>
                      {items.map((item, i) => (
                        <button
                          key={i}
                          className="w-full px-3 py-1.5 text-white text-[12px] flex items-center gap-2 hover:bg-white/10 cursor-pointer text-left"
                          onClick={() => setJumpList(null)}
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
          <div className="flex items-center gap-1.5 px-3 h-full border-l border-white/10">
            <div className="flex items-center gap-1.5 relative volume-container">
              <button
                onClick={(e) => { e.stopPropagation(); setShowVolume(!showVolume); }}
                className="text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                {getVolumeIcon()}
              </button>
              <VolumeControl isOpen={showVolume} />
            </div>
            <button className="text-white/70 hover:text-white transition-colors cursor-pointer">
              <HardDrive size={iconSize - 2} />
            </button>
            <div className="text-white/80 text-[11px] px-1 cursor-default whitespace-nowrap" style={{ fontFamily: '"Segoe UI", Tahoma, sans-serif' }}>
              {time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>

          {/* Aero Peek */}
          <button className="w-[12px] h-full border-l border-white/10 hover:bg-white/10 cursor-pointer ml-0.5" title="Show desktop" />
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
                <div className="w-7 h-[26px] ml-0.5 italic font-bold text-white bg-gradient-to-b from-white/50 via-transparent to-transparent rounded-[12px] flex items-center justify-center border border-white/30 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                    <div className="grid grid-cols-2 gap-[1px] transform -rotate-12 scale-90">
                        <div className="w-2 h-2 bg-[#f2552e] rounded-tl-sm shadow-sm"></div>
                        <div className="w-2 h-2 bg-[#8bc43d] rounded-tr-sm shadow-sm"></div>
                        <div className="w-2 h-2 bg-[#2d9fe6] rounded-bl-sm shadow-sm"></div>
                        <div className="w-2 h-2 bg-[#fdbd08] rounded-br-sm shadow-sm"></div>
                    </div>
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
                             ? "bg-[#1e52b7] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)] text-white border border-[#103375] opacity-90" 
                             : "bg-[#3c81f0] hover:bg-[#5394f7] text-white border-t border-l border-[#6eb0f8] border-b border-r border-[#1941a5] shadow-[1px_1px_0_rgba(0,0,0,0.2)]"
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
                <VolumeControl isOpen={showVolume} />
                <HardDrive size={14} className="cursor-pointer hover:scale-110 transition-transform"/>
            </div>
            <div className="text-white text-[11px] font-sans px-2 py-1 cursor-default">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </div>
        <div className="w-2 h-full border-l border-black/20 hover:bg-white/10 cursor-pointer ml-0.5"></div>
      </div>
    </>
  );
};