import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { RefreshCw, Settings, FolderPlus, Trash2, ExternalLink, FileText, ChevronRight, Folder, Play, Film, Briefcase, Globe, User, Image as ImageIcon } from 'lucide-react';
import { ControlPanel } from '../apps/ControlPanel';
import { FileExplorer } from '../apps/FileExplorer';
import { Notepad } from '../apps/Notepad';
import { ImageViewer } from '../apps/ImageViewer';
import { PDFViewer } from '../apps/PDFViewer';
import { MusicPlayer } from '../apps/MusicPlayer';
import { VideoPlayer } from '../apps/VideoPlayer';
import { Browser } from '../apps/Browser';
import { AboutMe } from '../apps/AboutMe';
import { GamesExplorer } from '../apps/GamesExplorer';
import { Projects } from '../apps/Projects';
import curriculoPdf from '../../assets/curriculo.pdf';

export const ContextMenu = () => {
  const { contextMenu, closeContextMenu, openWindow, triggerRefresh, createItem, setRenamingId, fileSystem, selectItem } = useOSStore();
  const [showNewSubmenu, setShowNewSubmenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) closeContextMenu(); };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [closeContextMenu]);

  if (!contextMenu.isOpen) return null;

  const handleRefresh = () => { 
      selectItem(null); 
      triggerRefresh(); 
      closeContextMenu(); 
  };
  
  const handleCreate = (type, name) => { const parentId = contextMenu.type === 'desktop' ? 'desktop_folder' : contextMenu.contextId; if (parentId) createItem(parentId, type, name); closeContextMenu(); };
  const handlePersonalize = () => { openWindow('settings', 'Painel de Controle', <Settings size={16}/>, <ControlPanel />); closeContextMenu(); };
  const handleRename = () => { if (contextMenu.targetId) setRenamingId(contextMenu.targetId); closeContextMenu(); };
  const handleDelete = () => { alert("Simulação de Exclusão."); closeContextMenu(); };

  const handleOpen = () => {
    const item = fileSystem[contextMenu.targetId];
    if (item) {
        if (item.type === 'folder') openWindow(`folder-${item.id}`, item.name, <Folder size={16} className="text-yellow-500 fill-yellow-500"/>, <FileExplorer initialPath={item.id}/>);
        else if (item.type === 'txt') openWindow(`notepad-${item.id}`, item.name, <FileText size={16} className="text-blue-500"/>, <Notepad id={item.id} content={item.content} fileName={item.name} />);
        else if (item.type === 'img') openWindow(`img-${item.id}`, item.name, <ImageIcon size={16} className="text-yellow-500"/>, <ImageViewer src={item.src} fileName={item.name} />);
        else if (item.type === 'pdf') openWindow(`pdf-${item.id}`, item.name, <FileText size={16} className="text-red-500"/>, <PDFViewer src={item.id === 'cv' ? curriculoPdf : item.src} />);
        else if (item.type === 'app') {
            if(item.id === 'about') openWindow('about', 'Sobre Mim', <User size={16} className="text-blue-500"/>, <AboutMe />);
            if(item.id === 'browser') openWindow('browser', 'Internet Explorer', <Globe size={16} className="text-blue-500"/>, <Browser initialUrl="https://github.com" />);
            if(item.id === 'wmp') openWindow('wmp', 'Windows Media Player', <Play size={16} className="text-orange-500"/>, <MusicPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" title="Dream Scapes" artist="SoundHelix" />, '/', { isSkin: true });
            if(item.id === 'my_projects') openWindow('projects_app', 'Meus Projetos', <Briefcase size={16} className="text-blue-500"/>, <Projects />);
            if(item.id === 'settings') openWindow('settings', 'Painel de Controle', <Settings size={16}/>, <ControlPanel />);
        }
    } else {
        if (contextMenu.targetId === 'video_demo') openWindow('video-demo', 'Apresentação', <Film size={16} className="text-purple-500"/>, <VideoPlayer src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" title="Apresentação do Projeto" />, '/', { isSkin: true });
        if (contextMenu.targetId === 'games_folder') openWindow('games-explorer', 'Jogos', <Gamepad2 size={16} className="text-green-600"/>, <GamesExplorer />);
    }
    closeContextMenu();
  };

  // --- SUBMENU NOVO CORRIGIDO ---
  const NewSubmenu = () => (
      <div 
        className="absolute left-[98%] -top-1 w-48 bg-white border border-gray-400 shadow-[2px_2px_5px_rgba(0,0,0,0.4)] py-1 z-[100000]"
        onMouseEnter={() => setShowNewSubmenu(true)}
      >
          <div className="menu-item group" onClick={() => handleCreate('folder', 'Nova Pasta')}>
             {/* Ícone com cor fixa */}
             <span className="w-4 flex justify-center"><FolderPlus size={14} className="text-yellow-600 group-hover:text-white"/></span> 
             <span className="text-black group-hover:text-white">Pasta</span>
          </div>
          <div className="menu-item group" onClick={() => handleCreate('txt', 'Documento de Texto')}>
             <span className="w-4 flex justify-center"><FileText size={14} className="text-gray-500 group-hover:text-white"/></span> 
             <span className="text-black group-hover:text-white">Documento de Texto</span>
          </div>
      </div>
  );

  const renderOptions = () => {
    if (contextMenu.type === 'desktop' || contextMenu.type === 'folder-bg') {
      return (
        <>
          <div className="menu-item" onClick={handleRefresh}>
             <span className="w-4 flex justify-center"><RefreshCw size={14}/></span> Atualizar
          </div>
          <div className="h-[1px] bg-gray-300 my-1 mx-1"></div>
          
          <div 
            className="menu-item relative flex justify-between items-center" 
            onMouseEnter={() => setShowNewSubmenu(true)}
            onMouseLeave={() => setShowNewSubmenu(false)}
          >
             <div className="flex items-center gap-2">
                <span className="w-4 flex justify-center text-xs">✨</span> Novo 
             </div>
             <span className="text-[10px]"><ChevronRight size={10}/></span>
             
             {showNewSubmenu && <NewSubmenu />}
          </div>

          <div className="h-[1px] bg-gray-300 my-1 mx-1"></div>
          <div className="menu-item font-bold" onClick={handlePersonalize}>
             <span className="w-4 flex justify-center"><Settings size={14}/></span> Personalizar
          </div>
        </>
      );
    }

    if (contextMenu.type === 'file' || contextMenu.type === 'folder') {
      return (
        <>
          <div className="menu-item font-bold" onClick={handleOpen}>
             <span className="w-4 flex justify-center"><ExternalLink size={14}/></span> Abrir
          </div>
          <div className="h-[1px] bg-gray-300 my-1 mx-1"></div>
          <div className="menu-item" onClick={handleRename}>
             <span className="w-4"></span> Renomear
          </div>
          <div className="h-[1px] bg-gray-300 my-1 mx-1"></div>
          <div className="menu-item text-gray-500 cursor-not-allowed" onClick={handleDelete}>
             <span className="w-4 flex justify-center"><Trash2 size={14}/></span> Excluir
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div 
      ref={menuRef}
      className="fixed z-[99999] bg-white border border-gray-400 shadow-[2px_2px_5px_rgba(0,0,0,0.4)] py-1 w-56 rounded-[2px] text-[11px] text-black font-tahoma select-none"
      style={{ top: contextMenu.y, left: contextMenu.x }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col relative">
         {renderOptions()}
      </div>
      <style>{`
        .menu-item { display: flex; align-items: center; gap: 8px; padding: 3px 12px 3px 8px; cursor: default; }
        .menu-item:hover { background-color: #316ac5; color: white !important; }
        .menu-item:hover svg { stroke: white; }
      `}</style>
    </div>
  );
};