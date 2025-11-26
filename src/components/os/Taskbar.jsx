import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { GamesExplorer } from '../apps/GamesExplorer';
import { 
  Volume2, Volume1, VolumeX, Battery, Power, 
  ChevronRight, LogOut, Search, Gamepad2, Monitor, Folder, Settings, Globe, Play, FileText, Image as ImageIcon, Music, HardDrive 
} from 'lucide-react';
import { clsx } from 'clsx';

const VolumeControl = ({ isOpen }) => {
    // Conectado ao Volume Global
    const { globalVolume, setGlobalVolume } = useOSStore();
    const trackRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleInteraction = (e) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const heightFromBottom = rect.bottom - clientY;
        const totalHeight = rect.height;
        let percentage = (heightFromBottom / totalHeight) * 1; // Normalizado 0-1
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
            className="absolute bottom-8 right-0 mb-1 w-[80px] h-[200px] bg-[#ece9d8] border border-[#aca899] shadow-[2px_2px_5px_rgba(0,0,0,0.5)] z-[100] select-none flex flex-col items-center pt-2 pb-2 rounded-t-md"
            onClick={(e) => e.stopPropagation()}
        >
            <span className="text-[10px] text-black mb-2 font-tahoma">Volume</span>
            <div className="flex-1 flex justify-center py-2">
                <div ref={trackRef} onMouseDown={handleMouseDown} className="relative w-[4px] h-full bg-[#dcdcdc] border border-[#808080] shadow-[inset_1px_1px_0_#fff] cursor-pointer">
                    <div 
                        className="absolute left-1/2 -translate-x-1/2 w-[20px] h-[10px] bg-[#ece9d8] border-t border-l border-white border-b border-r border-[#aca899] shadow-sm"
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

const StartMenu = ({ isOpen, onClose }) => {
  const { setBootStatus, openWindow, currentUser } = useOSStore();
  if (!isOpen) return null;

  const handleLogoff = () => { onClose(); setTimeout(() => setBootStatus('login'), 500); };
  const handleShutdown = () => window.location.reload();
  const handleOpenGames = () => { onClose(); openWindow('games-explorer', 'Jogos', <Gamepad2 size={16} className="text-green-600"/>, <GamesExplorer />); };

  const MenuItem = ({ icon, label, subLabel, bold, onClick }) => (
    <div onClick={onClick} className="flex items-center gap-2 p-1.5 hover:bg-[#316ac5] hover:text-white text-slate-800 rounded-[3px] cursor-pointer group transition-colors">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex flex-col leading-tight">
            <span className={`text-xs ${bold ? 'font-bold' : ''}`}>{label}</span>
            {subLabel && <span className="text-[9px] text-slate-500 group-hover:text-blue-100">{subLabel}</span>}
        </div>
    </div>
  );
  const SystemItem = ({ icon, label, bold, onClick }) => (
    <div onClick={onClick} className="flex items-center gap-2 p-1.5 hover:bg-[#316ac5] hover:text-white rounded-[3px] cursor-pointer group transition-colors">
        <div className="opacity-80 group-hover:opacity-100">{icon}</div>
        <span className={`${bold ? 'font-bold' : ''} leading-none`}>{label}</span>
    </div>
  );

  return (
    <div className="absolute bottom-0 left-0 w-[380px] h-[480px] rounded-tr-lg rounded-tl-lg overflow-hidden font-sans shadow-[4px_4px_10px_rgba(0,0,0,0.5)] z-50 flex flex-col animate-in slide-in-from-bottom-2 origin-bottom-left" onClick={(e) => e.stopPropagation()} style={{ border: '2px solid #003399', borderBottom: 'none', fontFamily: 'Tahoma, sans-serif' }}>
      <div className="h-16 bg-gradient-to-b from-[#1c5eb8] to-[#2470d6] flex items-center px-3 gap-3 border-b border-[#003399] shadow-md relative z-20">
          <div className="w-12 h-12 rounded-[4px] border-2 border-white bg-[#d3e5fa] overflow-hidden shadow-sm p-0.5"><img src={currentUser?.avatar || "https://i.pravatar.cc/150"} alt="" className="w-full h-full object-cover rounded-[2px]"/></div>
          <span className="text-white font-bold text-xl drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">{currentUser?.name || "Administrador"}</span>
      </div>
      <div className="flex-1 flex relative bg-white">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#e59700] z-10"></div>
          <div className="w-1/2 p-2 flex flex-col gap-1 border-r border-[#95bdee]">
              <div className="flex flex-col gap-1 pb-2">
                  <MenuItem icon={<div className="w-8 h-8 bg-blue-100 rounded-full border border-blue-500 flex items-center justify-center text-blue-700 font-bold text-lg">e</div>} label="Internet Explorer" subLabel="Internet" bold />
                  <MenuItem icon={<div className="w-8 h-8 bg-slate-700 rounded-sm text-white flex items-center justify-center font-serif font-bold text-xs border border-slate-500">cmd</div>} label="Prompt de Comando" subLabel="Sistema" bold />
              </div>
              <div className="h-[1px] bg-gray-200 w-[90%] self-center my-1"></div>
              <div className="flex flex-col gap-1">
                  <MenuItem icon={<FileText size={24} className="text-blue-600"/>} label="Notepad" />
                  <MenuItem icon={<div className="w-6 h-6 bg-orange-500 rounded-full border border-white shadow-sm flex items-center justify-center"><Play size={12} className="text-white fill-white ml-0.5"/></div>} label="Windows Media Player" />
                  <MenuItem icon={<Gamepad2 size={24} className="text-green-600"/>} label="Jogos" onClick={handleOpenGames} />
              </div>
              <div className="flex-1"></div>
              <div className="h-[1px] bg-gray-200 w-full my-1"></div>
              <div className="flex items-center justify-center p-2 hover:bg-[#2f71cd] hover:text-white cursor-pointer gap-2 text-xs font-bold text-slate-700 bg-blue-50"><span>All Programs</span><div className="bg-[#2f8935] text-white rounded-full p-0.5 group-hover:bg-white group-hover:text-[#2f71cd]"><ChevronRight size={10} strokeWidth={4}/></div></div>
          </div>
          <div className="w-1/2 bg-[#d3e5fa] p-2 flex flex-col gap-1 text-[#1e395b] text-xs border-l border-white/50">
              <SystemItem icon={<Folder size={16} className="text-yellow-500 fill-yellow-500"/>} label="My Documents" bold />
              <SystemItem icon={<ImageIcon size={16} className="text-blue-500"/>} label="My Pictures" bold />
              <SystemItem icon={<Music size={16} className="text-orange-500"/>} label="My Music" bold />
              <SystemItem icon={<Monitor size={16} className="text-slate-600"/>} label="My Computer" bold />
              <div className="h-[1px] bg-[#aebdd1] my-1 shadow-[0_1px_0_white]"></div>
              <SystemItem icon={<Settings size={16} className="text-slate-600"/>} label="Control Panel" />
              <SystemItem icon={<Globe size={16} className="text-blue-600"/>} label="Network Connect..." />
              <div className="h-[1px] bg-[#aebdd1] my-1 shadow-[0_1px_0_white]"></div>
              <SystemItem icon={<Search size={16} className="text-slate-600"/>} label="Search" />
              <SystemItem icon={<div className="w-4 h-4 border border-slate-500 bg-white text-[8px] flex items-center justify-center font-mono">R</div>} label="Run..." />
          </div>
      </div>
      <div className="h-12 bg-gradient-to-b from-[#1c5eb8] to-[#2470d6] flex items-center justify-end px-4 gap-4 border-t border-[#003399] shadow-[inset_0_2px_2px_rgba(255,255,255,0.2)]">
          <button onClick={handleLogoff} className="flex items-center gap-1 text-white text-[11px] hover:brightness-110 transition-all group"><div className="bg-[#e6a020] p-1 rounded-[3px] border border-white/30 shadow-sm group-hover:shadow-md"><LogOut size={14} className="text-white" strokeWidth={2.5}/></div><span>Log Off</span></button>
          <button onClick={handleShutdown} className="flex items-center gap-1 text-white text-[11px] hover:brightness-110 transition-all group"><div className="bg-[#e0422e] p-1 rounded-[3px] border border-white/30 shadow-sm group-hover:shadow-md"><Power size={14} className="text-white" strokeWidth={2.5}/></div><span>Turn Off Computer</span></button>
      </div>
    </div>
  );
};

export const Taskbar = () => {
  const { windows, activeWindowId, focusWindow, restoreWindow, minimizeWindow, globalVolume } = useOSStore();
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

  return (
    <>
      <div className="fixed bottom-[30px] left-0 z-[100] start-menu-container"><StartMenu isOpen={startOpen} onClose={() => setStartOpen(false)} /></div>
      <div className="fixed bottom-0 w-full h-[30px] flex items-center justify-between z-[9999] select-none" style={{ background: 'linear-gradient(to bottom, #245db5 0%, #3d78d6 5%, #3d78d6 80%, #1941a5 100%)', borderTop: '1px solid #649cec', fontFamily: 'Tahoma, sans-serif' }}>
        <div className="relative start-menu-container z-50">
           <button onClick={(e) => { e.stopPropagation(); setStartOpen(!startOpen); }} className="h-[30px] w-auto pr-3 pl-0 rounded-r-[14px] flex items-center gap-1 transition-all hover:brightness-110 active:brightness-90 overflow-visible relative" style={{ background: 'linear-gradient(to bottom, #3c8e2f 0%, #4fba32 8%, #4fba32 80%, #2d6921 100%)', boxShadow: '2px 2px 2px rgba(0,0,0,0.4)', border: '1px solid #2b5c22', borderLeft: 'none', borderTopRightRadius: '14px', borderBottomRightRadius: '14px' }}>
                <div className="w-6 h-6 ml-1 italic font-bold text-white bg-gradient-to-br from-white/40 to-transparent rounded-full flex items-center justify-center border border-white/30 shadow-sm"><div className="grid grid-cols-2 gap-[1px] transform -rotate-12 scale-75"><div className="w-2 h-2 bg-[#f2552e] rounded-tl-sm"></div><div className="w-2 h-2 bg-[#8bc43d] rounded-tr-sm"></div><div className="w-2 h-2 bg-[#2d9fe6] rounded-bl-sm"></div><div className="w-2 h-2 bg-[#fdbd08] rounded-br-sm"></div></div></div>
                <span className="text-white font-bold italic text-lg drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)] pr-1" style={{fontFamily: 'Trebuchet MS, sans-serif'}}>start</span>
           </button>
        </div>
        <div className="flex-1 flex items-center gap-1 px-1 overflow-x-auto h-full">
          {windows.map((win) => {
             const isActive = activeWindowId === win.id && !win.isMinimized;
             return (<button key={win.id} onClick={() => { if (win.isMinimized) restoreWindow(win.id); else if (isActive) minimizeWindow(win.id); else focusWindow(win.id); }} className={clsx("relative h-[24px] px-2 w-40 rounded-[2px] flex items-center gap-2 text-shadow overflow-hidden transition-colors", isActive ? "bg-[#1e52b7] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] text-white border border-[#103375]" : "bg-[#3c81f0] hover:bg-[#5394f7] text-white border-t border-l border-[#6eb0f8] border-b border-r border-[#1941a5] shadow-[1px_1px_0_rgba(0,0,0,0.2)]")}><span className="drop-shadow-md flex-shrink-0 scale-75">{win.icon}</span><span className="text-[11px] truncate font-sans">{win.title}</span></button>);
          })}
        </div>
        <div className="flex items-center gap-2 px-3 h-[30px] bg-[#1293e8] border-l border-[#103375] shadow-[inset_2px_0_5px_rgba(0,0,0,0.2)] relative volume-container">
           <div className="w-4 h-4 bg-[#1c5eb8] rounded-full flex items-center justify-center shadow-sm border border-white/30 cursor-pointer hover:brightness-110"><ChevronRight size={10} className="text-white transform rotate-180"/></div>
           <div className="flex gap-2 text-white drop-shadow-md mx-1 items-center relative">
               <div onClick={(e) => { e.stopPropagation(); setShowVolume(!showVolume); }} className="cursor-pointer hover:text-slate-200">{getVolumeIcon()}</div>
               <VolumeControl isOpen={showVolume} volume={globalVolume * 100} setVolume={(v) => { const { setGlobalVolume } = useOSStore.getState(); setGlobalVolume(v / 100); }} />
               <HardDrive size={14} className="cursor-pointer hover:text-slate-200 animate-pulse"/>
               <div className="w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm"></div>
           </div>
           <div className="text-white text-[11px] font-sans px-1 cursor-default">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </div>
        <div className="w-3 h-full border-l border-white/30 hover:bg-white/30 cursor-pointer ml-1"></div>
      </div>
    </>
  );
};