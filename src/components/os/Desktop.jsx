import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../../store/useOSStore';

// --- APPS E COMPONENTES ---
import { Browser } from '../apps/Browser';
import { MusicPlayer } from '../apps/MusicPlayer';
import { VideoPlayer } from '../apps/VideoPlayer';
import { PDFViewer } from '../apps/PDFViewer';
import { AboutMe } from '../apps/AboutMe';
import { GamesExplorer } from '../apps/GamesExplorer';
import { ControlPanel } from '../apps/ControlPanel';
import { Notepad } from '../apps/Notepad';
import { FileExplorer } from '../apps/FileExplorer';
import { Projects } from '../apps/Projects';
import { Calculator } from '../apps/Calculator';
import { Terminal } from '../apps/Terminal';
import { Paint } from '../apps/Paint';

// --- ASSETS ---
import curriculoPdf from '../../assets/Curriculo.pdf';
import folderIcon from '../../assets/icons/folder.ico';
import textIcon from '../../assets/icons/text.ico';
import userIcon from '../../assets/icons/user.png';
import ieIcon from '../../assets/icons/ie.ico';
import wmpIcon from '../../assets/icons/wmp.ico';
import videoIcon from '../../assets/icons/video.png';
import gameIcon from '../../assets/icons/game.ico';
import configIcon from '../../assets/icons/config.ico';
import pdfIcon from '../../assets/icons/pdf.ico';
import projectsIcon from '../../assets/icons/projects.png';

// --- ÍCONES SVG DO WINDOWS XP ---
import { XPCalcIcon, XPPaintIcon, XPCmdIcon } from './XPAppIcons';

// Componente para renderizar ícone do Windows XP
const XPIcon = ({ type, className = "" }) => {
  // Para calc, paint e cmd, usar ícones SVG autênticos
  if (type === 'calc') return <XPCalcIcon />;
  if (type === 'paint') return <XPPaintIcon />;
  if (type === 'cmd') return <XPCmdIcon />;
  
  const iconMap = {
    folder: folderIcon,
    txt: textIcon,
    user: userIcon,
    ie: ieIcon,
    wmp: wmpIcon,
    video: videoIcon,
    games: gameIcon,
    settings: configIcon,
    pdf: pdfIcon,
    projects: projectsIcon,
    globe: ieIcon,
    play: wmpIcon,
    gamepad: gameIcon,
    briefcase: projectsIcon,
  };
  
  const iconSrc = iconMap[type] || folderIcon;
  
  return (
    <img 
      src={iconSrc} 
      alt={type}
      className={`w-full h-full ${className}`}
    />
  );
};

// --- ÍCONE UNITÁRIO ---
const DesktopIcon = ({ id, label, icon, onDoubleClick, onContextMenu, isRenaming, onRename, isMobile = false }) => {
    const [tempName, setTempName] = useState(label);
    const inputRef = useRef(null);

    useEffect(() => { setTempName(label); }, [label]);
    useEffect(() => { if (isRenaming && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); } }, [isRenaming]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); onRename(id, tempName); }
        if (e.key === 'Escape') { e.preventDefault(); onRename(id, label); }
    };

    // Tamanhos responsivos
    const iconSize = isMobile ? 'w-9 h-9' : 'w-11 h-11 md:w-[44px] md:h-[44px]';
    const containerSize = isMobile ? 'w-[70px] h-[80px]' : 'w-[86px] h-[98px]';
    const fontSize = isMobile ? 'text-[10px]' : 'text-[11px]';

    return (
        <div 
            onDoubleClick={onDoubleClick} 
            onContextMenu={onContextMenu} 
            className={`flex flex-col items-center justify-start gap-0.5 p-1 ${containerSize} hover:bg-[#316ac5]/50 border border-transparent hover:border-[#316ac5]/30 rounded-[3px] cursor-pointer group transition-none touch-manipulation`}
        >
            <div className={`${iconSize} flex-shrink-0 flex items-center justify-center drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]`}>
                {icon}
            </div>
            <div className="w-full flex items-start justify-center h-[38px] overflow-visible relative">
                {isRenaming ? (
                    <textarea ref={inputRef} value={tempName} onChange={(e) => setTempName(e.target.value)} onBlur={() => onRename(id, tempName)} onKeyDown={handleKeyDown} className="text-black text-[11px] text-center leading-tight w-[120%] -ml-[10%] px-1 py-0.5 outline-none border border-blue-500 bg-white h-auto min-h-[20px] font-tahoma shadow-lg z-50" rows={2} onClick={(e) => e.stopPropagation()} />
                ) : (
                    <span className={`text-white ${fontSize} font-normal text-center leading-tight select-none px-1 py-0.5 rounded-[2px] group-hover:bg-[#316ac5] group-hover:text-white`} style={{ fontFamily: 'Tahoma, sans-serif', wordBreak: 'break-word', textShadow: '-1px -1px 0 #000000, 1px -1px 0 #000000, -1px 1px 0 #000000, 1px 1px 0 #000000, 1px 1px 2px rgba(0,0,0,0.8)' }} title={label}>{label}</span>
                )}
            </div>
        </div>
    );
};

// --- DESKTOP PRINCIPAL ---
export const Desktop = ({ isMobile = false }) => {
    const { openWindow, openContextMenu, fileSystem, refreshKey, desktopSort, renameItem, renamingId } = useOSStore();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (refreshKey > 0) {
            setIsVisible(false);
            const timer = setTimeout(() => setIsVisible(true), 100);
            return () => clearTimeout(timer);
        }
    }, [refreshKey]);

    let desktopItems = fileSystem['desktop_folder']?.children.map(id => fileSystem[id]).filter(Boolean) || [];
    if (desktopSort === 'name') desktopItems.sort((a, b) => a.name.localeCompare(b.name));
    else if (desktopSort === 'type') desktopItems.sort((a, b) => a.type.localeCompare(b.type));

    // Helper para Ícones
    const getIcon = (item) => {
        if (item.type === 'folder') return <XPIcon type="folder" />;
        if (item.type === 'txt') return <XPIcon type="txt" />;
        if (item.type === 'img') return <XPIcon type="user" />;
        
        // --- ÍCONES ESPECIAIS (CALC, CMD, PAINT) ---
        if (item.id === 'calc') return <XPIcon type="calc" />;
        if (item.id === 'paint') return <XPIcon type="paint" />;
        if (item.id === 'cmd') return <XPIcon type="cmd" />;

        return <XPIcon type="txt" />;
    };

    // Helper para Abrir Itens
    const handleOpenItem = (item) => {
        if (item.type === 'folder') openWindow(`folder-${item.id}`, item.name, <XPIcon type="folder" />, <FileExplorer initialPath={item.id} />);
        else if (item.type === 'txt') openWindow(`notepad-${item.id}`, item.name, <XPIcon type="txt" />, <Notepad id={item.id} content={item.content} fileName={item.name} />);
        
        // Apps
        else if (item.id === 'calc') openWindow('calc', 'Calculadora', <XPIcon type="calc" />, <Calculator />);
        else if (item.id === 'cmd') openWindow('cmd', 'Prompt de Comando', <XPIcon type="cmd" />, <Terminal />);
        else if (item.id === 'paint') openWindow('paint', 'Untitled - Paint', <XPIcon type="paint" />, <Paint />);
    };

    const getName = (id, defaultName) => fileSystem[id]?.name || defaultName;
    const musicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

    return (
        <div className={`absolute inset-0 p-2 flex flex-col flex-wrap content-start items-start gap-y-0 gap-x-1 z-0 ${isMobile ? 'pt-2 pb-12' : 'pt-3 pl-2 pb-14'} overflow-hidden`} onContextMenu={(e) => openContextMenu(e, 'desktop')}>
            {isVisible && (
                <div className="contents">
                    {/* ÍCONES FIXOS */}
                    <DesktopIcon id="cv" label={getName('cv', "Meu Currículo")} icon={<XPIcon type="pdf" />} isRenaming={renamingId === 'cv'} onRename={renameItem} onDoubleClick={() => openWindow('cv', 'Meu Currículo.pdf', <XPIcon type="pdf" />, <PDFViewer src={curriculoPdf} />)} onContextMenu={(e) => openContextMenu(e, 'file', 'cv')} isMobile={isMobile} />
                    <DesktopIcon id="about" label={getName('about', "Sobre Mim")} icon={<XPIcon type="user" />} isRenaming={renamingId === 'about'} onRename={renameItem} onDoubleClick={() => openWindow('about', 'Sobre Mim', <XPIcon type="user" />, <AboutMe />)} onContextMenu={(e) => openContextMenu(e, 'file', 'about')} isMobile={isMobile} />
                    <DesktopIcon id="my_projects" label={getName('my_projects', "Meus Projetos")} icon={<XPIcon type="projects" />} isRenaming={renamingId === 'my_projects'} onRename={renameItem} onDoubleClick={() => openWindow('projects_app', 'Meus Projetos', <XPIcon type="briefcase" />, <Projects />)} onContextMenu={(e) => openContextMenu(e, 'file', 'my_projects')} isMobile={isMobile} />
                    <DesktopIcon id="browser" label={getName('browser', "Internet Explorer")} icon={<XPIcon type="ie" />} isRenaming={renamingId === 'browser'} onRename={renameItem} onDoubleClick={() => openWindow('browser', 'Internet Explorer', <XPIcon type="globe" />, <Browser initialUrl="https://github.com" />)} onContextMenu={(e) => openContextMenu(e, 'file', 'browser')} isMobile={isMobile} />
                    <DesktopIcon id="wmp" label={getName('wmp', "Media Player")} icon={<XPIcon type="wmp" />} isRenaming={renamingId === 'wmp'} onRename={renameItem} onDoubleClick={() => openWindow('wmp', 'Windows Media Player', <XPIcon type="play" />, <MusicPlayer src={musicUrl} title="Dream Scapes" artist="SoundHelix" />, '/', { isSkin: true })} onContextMenu={(e) => openContextMenu(e, 'file', 'wmp')} isMobile={isMobile} />
                    <DesktopIcon id="games_folder" label={getName('games_folder', "Jogos")} icon={<XPIcon type="games" />} isRenaming={renamingId === 'games_folder'} onRename={renameItem} onDoubleClick={() => openWindow('games-explorer', 'Jogos', <XPIcon type="gamepad" />, <GamesExplorer />)} onContextMenu={(e) => openContextMenu(e, 'folder', 'games_folder')} isMobile={isMobile} />
                    <DesktopIcon id="settings" label={getName('settings', "Personalizar")} icon={<XPIcon type="settings" />} isRenaming={renamingId === 'settings'} onRename={renameItem} onDoubleClick={() => openWindow('settings', 'Painel de Controle', <XPIcon type="settings" />, <ControlPanel />)} onContextMenu={(e) => openContextMenu(e, 'file', 'settings')} isMobile={isMobile} />

                    {/* ÍCONES DINÂMICOS (Calc, CMD, Paint) */}
                    {desktopItems.map(item => (
                        <DesktopIcon key={item.id} id={item.id} label={item.name} icon={getIcon(item)} isRenaming={renamingId === item.id} onRename={renameItem} onDoubleClick={() => handleOpenItem(item)} onContextMenu={(e) => openContextMenu(e, item.type === 'folder' ? 'folder' : 'file', item.id)} isMobile={isMobile} />
                    ))}
                </div>
            )}
        </div>
    );
};