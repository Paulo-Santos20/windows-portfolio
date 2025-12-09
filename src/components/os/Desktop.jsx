import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../../store/useOSStore';

// --- IMPORTAÇÃO DOS APPS ---
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

// --- ÍCONES LUCIDE E ASSETS GERAIS ---
import { Settings, Gamepad2, Play, Film, User, FileText, Globe, Briefcase, Calculator as CalcIcon, Terminal as TermIcon, Image as ImageIcon } from 'lucide-react';
import curriculoPdf from '../../assets/curriculo.pdf';

// --- IMPORTAÇÃO DOS ASSETS WEBP (Ícones do Sistema) ---
import folderWebp from '../../assets/icons/folder.ico';
import textWebp from '../../assets/icons/text.ico';
import ieWebp from '../../assets/icons/ie.ico';
import wmpWebp from '../../assets/icons/wmp.ico';
import videoWebp from '../../assets/icons/video.png';
import gamesWebp from '../../assets/icons/game.ico';
import settingsWebp from '../../assets/icons/config.ico';
import pdfWebp from '../../assets/icons/pdf.ico';
import userWebp from '../../assets/icons/user.png';
import imageWebp from '../../assets/icons/user.png'; 
import unknownWebp from '../../assets/icons/user.png';

// --- COMPONENTES DE ÍCONES VETORIAIS (SVG) ---

// 1. Ícone Meus Projetos
const XP_ProjectsIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-md">
    <defs>
      <linearGradient id="projBack" x1="24" y1="6" x2="24" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#FFD700"/><stop offset="1" stopColor="#DAA520"/></linearGradient>
      <linearGradient id="projFront" x1="24" y1="14" x2="24" y2="42" gradientUnits="userSpaceOnUse"><stop stopColor="#FFFACD"/><stop offset="1" stopColor="#F0E68C"/></linearGradient>
      <linearGradient id="blueprint" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#1E90FF"/><stop offset="1" stopColor="#00008B"/></linearGradient>
    </defs>
    <path d="M4 10C4 8.89 5.79 8 8 8H18L22 12H42C43.1 12 44 12.89 44 14V40C44 41.1 43.1 42 42 42H6C4.89 42 4 41.1 4 40V10Z" fill="url(#projBack)" stroke="#B8860B"/>
    <rect x="10" y="8" width="28" height="24" fill="#fff" stroke="#ccc" />
    <rect x="14" y="12" width="20" height="16" fill="url(#blueprint)" stroke="#00008B"/>
    <line x1="14" y1="16" x2="34" y2="16" stroke="white" strokeWidth="0.5" opacity="0.5"/>
    <line x1="14" y1="20" x2="34" y2="20" stroke="white" strokeWidth="0.5" opacity="0.5"/>
    <path d="M4 40C4 41.1 4.89 42 6 42H42C43.1 42 44 41.1 44 40V18H4V40Z" fill="url(#projFront)" stroke="#DAA520"/>
    <path d="M20 24 L24 34 L28 24" stroke="#B8860B" strokeWidth="2" fill="none" />
  </svg>
);

// 2. NOVO ÍCONE DA CALCULADORA (CORRIGIDO)
const XP_CalcIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-md">
    <defs>
      <linearGradient id="calcBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fcfcfc" />
        <stop offset="100%" stopColor="#d4d0c8" />
      </linearGradient>
      <linearGradient id="calcScreen" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0" stopColor="#e8f1fa"/>
         <stop offset="1" stopColor="#ffffff"/>
      </linearGradient>
    </defs>
    
    {/* Corpo */}
    <rect x="10" y="4" width="28" height="40" rx="2" fill="url(#calcBody)" stroke="#808080" strokeWidth="1" />
    <rect x="11" y="5" width="26" height="38" rx="1" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />

    {/* Visor */}
    <rect x="13" y="8" width="22" height="7" fill="url(#calcScreen)" stroke="#808080" strokeWidth="0.5" />

    {/* Botões Vermelhos */}
    <rect x="13" y="19" width="6" height="4" rx="1" fill="#e05e5e" stroke="#a03030" strokeWidth="0.5"/>
    <rect x="21" y="19" width="6" height="4" rx="1" fill="#e05e5e" stroke="#a03030" strokeWidth="0.5"/>
    <rect x="29" y="19" width="6" height="4" rx="1" fill="#e05e5e" stroke="#a03030" strokeWidth="0.5"/>

    {/* Botões Azuis (Grid) */}
    <rect x="13" y="25" width="6" height="4" rx="1" fill="#4a90e2" stroke="#205090" strokeWidth="0.5"/>
    <rect x="21" y="25" width="6" height="4" rx="1" fill="#4a90e2" stroke="#205090" strokeWidth="0.5"/>
    <rect x="29" y="25" width="6" height="4" rx="1" fill="#4a90e2" stroke="#205090" strokeWidth="0.5"/>

    <rect x="13" y="31" width="6" height="4" rx="1" fill="#4a90e2" stroke="#205090" strokeWidth="0.5"/>
    <rect x="21" y="31" width="6" height="4" rx="1" fill="#4a90e2" stroke="#205090" strokeWidth="0.5"/>
    <rect x="29" y="31" width="6" height="4" rx="1" fill="#4a90e2" stroke="#205090" strokeWidth="0.5"/>

    <rect x="13" y="37" width="6" height="4" rx="1" fill="#4a90e2" stroke="#205090" strokeWidth="0.5"/>
    <rect x="21" y="37" width="6" height="4" rx="1" fill="#4a90e2" stroke="#205090" strokeWidth="0.5"/>
    <rect x="29" y="37" width="6" height="4" rx="1" fill="#4a90e2" stroke="#205090" strokeWidth="0.5"/>
  </svg>
);

// Wrapper para ícones WebP/PNG
const WebPIcon = ({ src, alt = "icon" }) => (
    <img src={src} alt={alt} className="w-full h-full object-contain drop-shadow-md select-none pointer-events-none" draggable={false} />
);

// Ícones SVG Fallback
const XP_FolderIcon = () => ( <svg viewBox="0 0 48 48" fill="none" className="drop-shadow-md"><path d="M4 10C4 8.89 5.79 8 8 8H18L22 12H42C43.1 12 44 12.89 44 14V40C44 41.1 43.1 42 42 42H6C4.89 42 4 41.1 4 40V10Z" fill="#DAA520" stroke="#B8860B"/><rect x="8" y="10" width="32" height="20" fill="#fff" stroke="#D3D3D3"/><path d="M4 40C4 41.1 4.89 42 6 42H42C43.1 42 44 41.1 44 40V18H4V40Z" fill="#F0E68C" stroke="#DAA520"/></svg> );
const XP_TextFileIcon = () => ( <svg viewBox="0 0 48 48" fill="none" className="drop-shadow-md"><path d="M10 6H30L38 14V42H10V6Z" fill="#fff" stroke="#A9A9A9"/><path d="M30 6V14H38" fill="#E0E0E0" stroke="#A9A9A9"/><line x1="16" y1="20" x2="32" y2="20" stroke="#D3D3D3"/><line x1="16" y1="26" x2="32" y2="26" stroke="#D3D3D3"/><line x1="16" y1="32" x2="32" y2="32" stroke="#D3D3D3"/></svg> );

const XP_IEIcon = () => ( <WebPIcon src={ieWebp} /> ); 
const XP_WMPIcon = () => ( <WebPIcon src={wmpWebp} /> );
const XP_VideoNewIcon = () => ( <WebPIcon src={videoWebp} /> );
const XP_GamesIcon = () => ( <WebPIcon src={gamesWebp} /> );
const XP_ControlPanelIcon = () => ( <WebPIcon src={settingsWebp} /> );
const XP_PDFIcon = () => ( <WebPIcon src={pdfWebp} /> );
const XP_UserIcon = () => ( <WebPIcon src={userWebp} /> );

// --- COMPONENTE DE ÍCONE UNITÁRIO ---
const DesktopIcon = ({ id, label, icon, onDoubleClick, onContextMenu, isRenaming, onRename }) => {
    const [tempName, setTempName] = useState(label);
    const inputRef = useRef(null);

    useEffect(() => { setTempName(label); }, [label]);
    
    useEffect(() => { 
        if (isRenaming && inputRef.current) { 
            inputRef.current.focus(); 
            inputRef.current.select(); 
        } 
    }, [isRenaming]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); onRename(id, tempName); }
        if (e.key === 'Escape') { e.preventDefault(); onRename(id, label); }
    };

    return (
        <div 
            onDoubleClick={onDoubleClick} 
            onContextMenu={onContextMenu} 
            className="flex flex-col items-center justify-start gap-1 p-1 w-[86px] h-[100px] hover:bg-[#316ac5]/50 border border-transparent hover:border-[#316ac5]/30 rounded-[3px] cursor-pointer group transition-none mb-2"
        >
            <div className="w-10 h-10 md:w-[48px] md:h-[48px] flex-shrink-0 flex items-center justify-center filter drop-shadow-[2px_2px_1px_rgba(0,0,0,0.3)]">
                {icon}
            </div>
            
            <div className="w-full flex items-start justify-center h-[42px] overflow-visible relative">
                {isRenaming ? (
                    <textarea 
                        ref={inputRef} 
                        value={tempName} 
                        onChange={(e) => setTempName(e.target.value)} 
                        onBlur={() => onRename(id, tempName)} 
                        onKeyDown={handleKeyDown} 
                        className="text-black text-[11px] text-center leading-tight w-[120%] -ml-[10%] px-1 py-0.5 outline-none border border-blue-500 bg-white h-auto min-h-[20px] font-tahoma shadow-lg z-50" 
                        rows={2} 
                        onClick={(e) => e.stopPropagation()} 
                    />
                ) : (
                    <span 
                        className="text-white text-[11px] font-medium text-center leading-tight select-none px-1 rounded-[2px] group-hover:bg-[#316ac5]" 
                        style={{ fontFamily: 'Tahoma, sans-serif', textShadow: '1px 1px 0px #000000', wordBreak: 'break-word' }} 
                        title={label}
                    >
                        {label}
                    </span>
                )}
            </div>
        </div>
    );
};

// --- COMPONENTE DESKTOP PRINCIPAL ---
export const Desktop = () => {
    const { openWindow, openContextMenu, fileSystem, refreshKey, desktopSort, renameItem, renamingId } = useOSStore();
    
    // Estado para efeito de piscar ao atualizar
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (refreshKey > 0) {
            setIsVisible(false); // Esconde
            const timer = setTimeout(() => setIsVisible(true), 100); // Mostra após 100ms
            return () => clearTimeout(timer);
        }
    }, [refreshKey]);

    // Carrega itens da pasta 'desktop_folder'
    let desktopItems = fileSystem['desktop_folder']?.children.map(id => fileSystem[id]).filter(Boolean) || [];
    
    // Ordenação
    if (desktopSort === 'name') desktopItems.sort((a, b) => a.name.localeCompare(b.name));
    else if (desktopSort === 'type') desktopItems.sort((a, b) => a.type.localeCompare(b.type));

    // Define qual ícone usar para cada item
    const getIcon = (item) => {
        if (item.type === 'folder') return <XP_FolderIcon />;
        if (item.type === 'txt') return <XP_TextFileIcon />;
        if (item.type === 'img') return <WebPIcon src={imageWebp} />;
        
        // ÍCONES ESPECIAIS
        if (item.id === 'calc') return <XP_CalcIcon />; // AGORA USA O ÍCONE VETORIAL CORRETO
        if (item.id === 'cmd') return <div className="w-10 h-10 bg-black border border-gray-500 rounded-sm flex items-center justify-center shadow-md"><TermIcon className="text-gray-200" size={24}/></div>;

        return <WebPIcon src={unknownWebp} />;
    };

    // Ação ao clicar duas vezes
    const handleOpenItem = (item) => {
        if (item.type === 'folder') {
            openWindow(`folder-${item.id}`, item.name, <XP_FolderIcon />, <FileExplorer initialPath={item.id} />);
        } 
        else if (item.type === 'txt') {
            openWindow(`notepad-${item.id}`, item.name, <FileText size={16} />, <Notepad id={item.id} content={item.content} fileName={item.name} />);
        }
        else if (item.id === 'calc') {
            openWindow('calc', 'Calculadora', <CalcIcon size={16} className="text-blue-500"/>, <Calculator />);
        }
        else if (item.id === 'cmd') {
            openWindow('cmd', 'Prompt de Comando', <TermIcon size={16} className="text-gray-200"/>, <Terminal />);
        }
    };

    const getName = (id, defaultName) => fileSystem[id]?.name || defaultName;
    const musicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

    return (
        <div 
            className="absolute inset-0 p-2 flex flex-col flex-wrap content-start items-start gap-y-1 gap-x-2 z-0 pt-4 pl-2 pb-12 overflow-hidden" 
            onContextMenu={(e) => openContextMenu(e, 'desktop')}
        >
            {isVisible && (
                <div className="contents">
                    
                    {/* --- ÍCONES FIXOS --- */}
                    <DesktopIcon 
                        id="cv" label={getName('cv', "Meu Currículo")} icon={<XP_PDFIcon />} 
                        isRenaming={renamingId === 'cv'} onRename={renameItem} 
                        onDoubleClick={() => openWindow('cv', 'Meu Currículo.pdf', <FileText size={16} className="text-red-500" />, <PDFViewer src={curriculoPdf} />)} 
                        onContextMenu={(e) => openContextMenu(e, 'file', 'cv')} 
                    />
                    
                    <DesktopIcon 
                        id="about" label={getName('about', "Sobre Mim")} icon={<XP_UserIcon />} 
                        isRenaming={renamingId === 'about'} onRename={renameItem} 
                        onDoubleClick={() => openWindow('about', 'Sobre Mim', <User size={16} className="text-blue-500" />, <AboutMe />)} 
                        onContextMenu={(e) => openContextMenu(e, 'file', 'about')} 
                    />
                    
                    <DesktopIcon 
                        id="my_projects" label={getName('my_projects', "Meus Projetos")} icon={<XP_ProjectsIcon />} 
                        isRenaming={renamingId === 'my_projects'} onRename={renameItem} 
                        onDoubleClick={() => openWindow('projects_app', 'Meus Projetos', <Briefcase size={16} className="text-blue-500" />, <Projects />)} 
                        onContextMenu={(e) => openContextMenu(e, 'file', 'my_projects')} 
                    />
                    
                    <DesktopIcon 
                        id="browser" label={getName('browser', "Internet Explorer")} icon={<XP_IEIcon />} 
                        isRenaming={renamingId === 'browser'} onRename={renameItem} 
                        onDoubleClick={() => openWindow('browser', 'Internet Explorer', <Globe size={16} className="text-blue-500" />, <Browser initialUrl="https://github.com" />)} 
                        onContextMenu={(e) => openContextMenu(e, 'file', 'browser')} 
                    />
                    
                    <DesktopIcon 
                        id="wmp" label={getName('wmp', "Media Player")} icon={<XP_WMPIcon />} 
                        isRenaming={renamingId === 'wmp'} onRename={renameItem} 
                        onDoubleClick={() => openWindow('wmp', 'Windows Media Player', <Play size={16} className="text-orange-500" />, <MusicPlayer src={musicUrl} title="Dream Scapes" artist="SoundHelix" />, '/', { isSkin: true })} 
                        onContextMenu={(e) => openContextMenu(e, 'file', 'wmp')} 
                    />
                    
                    <DesktopIcon 
                        id="video_demo" label={getName('video_demo', "Vídeo Demo")} icon={<XP_VideoNewIcon />} 
                        isRenaming={renamingId === 'video_demo'} onRename={renameItem} 
                        onDoubleClick={() => openWindow('video-demo', 'Apresentação', <Film size={16} className="text-purple-500" />, <VideoPlayer src={videoUrl} title="Apresentação do Projeto" />, '/', { isSkin: true })} 
                        onContextMenu={(e) => openContextMenu(e, 'file', 'video_demo')} 
                    />
                    
                    <DesktopIcon 
                        id="games_folder" label={getName('games_folder', "Jogos")} icon={<XP_GamesIcon />} 
                        isRenaming={renamingId === 'games_folder'} onRename={renameItem} 
                        onDoubleClick={() => openWindow('games-explorer', 'Jogos', <Gamepad2 size={16} className="text-green-600" />, <GamesExplorer />)} 
                        onContextMenu={(e) => openContextMenu(e, 'folder', 'games_folder')} 
                    />
                    
                    <DesktopIcon 
                        id="settings" label={getName('settings', "Personalizar")} icon={<XP_ControlPanelIcon />} 
                        isRenaming={renamingId === 'settings'} onRename={renameItem} 
                        onDoubleClick={() => openWindow('settings', 'Painel de Controle', <Settings size={16} />, <ControlPanel />)} 
                        onContextMenu={(e) => openContextMenu(e, 'file', 'settings')} 
                    />

                    {/* --- ÍCONES DINÂMICOS (Calculadora, CMD, Pastas criadas) --- */}
                    {desktopItems.map(item => (
                        <DesktopIcon 
                            key={item.id} id={item.id} label={item.name} icon={getIcon(item)} 
                            isRenaming={renamingId === item.id} onRename={renameItem} 
                            onDoubleClick={() => handleOpenItem(item)} 
                            onContextMenu={(e) => openContextMenu(e, item.type === 'folder' ? 'folder' : 'file', item.id)} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};