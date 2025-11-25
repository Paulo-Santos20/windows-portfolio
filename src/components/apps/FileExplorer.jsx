// ... imports (manter igual) ...
import React, { useState, useEffect, useRef } from 'react'; // ADICIONEI useRef
import { useOSStore } from '../../store/useOSStore';
import { 
    FileText, Image as ImageIcon, Folder, ArrowLeft, ArrowUp, Monitor, 
    FileType, ChevronRight, ChevronDown, HardDrive, Star, Download, 
    Film, Music, Play
} from 'lucide-react';
import { Notepad } from './Notepad';
import { ImageViewer } from './ImageViewer';
import { PDFViewer } from './PDFViewer';
import { MusicPlayer } from './MusicPlayer';
import { VideoPlayer } from './VideoPlayer';

// ... (Mantenha FavoriteLink e SidebarItem iguais) ...
const FavoriteLink = ({ id, icon: Icon, label, color = "text-blue-500", currentId, onClick, fileSystem }) => (<div onClick={() => onClick(fileSystem[id])} className={`pl-6 py-0.5 text-xs text-slate-700 hover:bg-[#e5f3fb] cursor-pointer flex items-center gap-2 border border-transparent ${currentId === id ? 'bg-[#dceafc] font-medium border-dashed border-[#7da2ce] border-l-0 border-r-0 border-t-0 border-b-0' : ''}`}><Icon size={14} className={color}/> {label}</div>);
const SidebarItem = ({ id, level = 0, currentId, expandedFolders, onToggle, onNavigate, fileSystem }) => { const item = fileSystem[id]; if (!item) return null; const hasChildren = item.children && item.children.some(childId => { const child = fileSystem[childId]; return child && ['folder', 'drive', 'root'].includes(child.type); }); const isExpanded = expandedFolders.includes(id); const isSelected = currentId === id; return ( <div> <div onClick={() => onNavigate(item)} className={`flex items-center gap-1 py-0.5 px-1 cursor-pointer select-none border border-transparent whitespace-nowrap group ${isSelected ? 'bg-[#dceafc] border-[#7da2ce]' : 'hover:bg-[#f0f5f9]'}`} style={{ paddingLeft: `${level * 12 + 4}px` }}> <div onClick={(e) => { e.stopPropagation(); if(hasChildren) onToggle(id); }} className={`w-4 h-4 flex items-center justify-center rounded z-10 ${hasChildren ? 'hover:bg-slate-200/50' : ''}`}> {hasChildren ? (isExpanded ? <ChevronDown size={10} className="text-slate-500"/> : <ChevronRight size={10} className="text-slate-500"/>) : <div className="w-4" />} </div> <div className="w-4 h-4 flex items-center justify-center"> {item.type === 'root' ? <Monitor size={14} className="text-slate-600" /> : item.type === 'drive' ? <HardDrive size={14} className="text-slate-600" /> : <Folder size={14} className="text-yellow-500 fill-yellow-500" />} </div> <span className={`text-xs truncate ${isSelected ? 'text-black font-medium' : 'text-slate-700'}`}>{item.name}</span> </div> {isExpanded && hasChildren && (<div>{item.children.filter(childId => { const child = fileSystem[childId]; return child && ['folder', 'drive', 'root'].includes(child.type); }).map(childId => (<SidebarItem key={childId} id={childId} level={level + 1} currentId={currentId} expandedFolders={expandedFolders} onToggle={onToggle} onNavigate={onNavigate} fileSystem={fileSystem} />))}</div>)} </div> ); };

// --- COMPONENTE ITEM DO GRID (Renomeável) ---
const GridItem = ({ item, selectedFileId, onDoubleClick, onClick, onContextMenu, isRenaming, onRename, getIcon }) => {
    const [tempName, setTempName] = useState(item.name);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isRenaming && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isRenaming]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') onRename(item.id, tempName);
        if (e.key === 'Escape') onRename(item.id, item.name);
    };

    return (
        <div 
            onDoubleClick={onDoubleClick}
            onClick={onClick}
            onContextMenu={onContextMenu}
            className={`flex flex-col items-center gap-1 p-2 border border-transparent rounded-[2px] cursor-pointer group transition-all ${
                selectedFileId === item.id ? 'bg-[#cce8ff] border-[#99d1ff]' : 'hover:bg-[#dceafc] hover:border-[#7da2ce]'
            }`}
        >
            <div className="h-14 flex items-center justify-center transition-transform group-hover:scale-105">
                {getIcon(item)}
            </div>
            {isRenaming ? (
                <input 
                    ref={inputRef}
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => onRename(item.id, tempName)}
                    onKeyDown={handleKeyDown}
                    className="text-black text-xs text-center w-full px-1 outline-none border border-blue-500 z-50"
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <span className="text-xs text-center text-slate-700 w-full truncate px-1 font-medium group-hover:text-black">{item.name}</span>
            )}
        </div>
    );
};

export const FileExplorer = ({ initialPath = 'c_drive' }) => {
  const { openWindow, openContextMenu, fileSystem, refreshKey, renamingId, renameItem } = useOSStore();
  const [currentId, setCurrentId] = useState(initialPath);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [history, setHistory] = useState([initialPath]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [expandedFolders, setExpandedFolders] = useState(['root', 'c_drive', 'users', 'paulo', 'musics', 'videos']);
  const [opacity, setOpacity] = useState(100);

  const currentFolder = fileSystem[currentId] || fileSystem['c_drive'];

  useEffect(() => {
      if (refreshKey > 0) {
          setOpacity(0);
          setTimeout(() => setOpacity(100), 150);
      }
  }, [refreshKey]);

  // ... (handleOpen, handleBack, handleUp, toggleExpand e getIcon iguais) ...
  // Para economizar espaço, estou assumindo que você já tem essas funções. 
  // Se não, use as do passo anterior, elas não mudaram.
  
  const handleOpen = (item) => {
      if (!item) return;
      if (['folder', 'root', 'drive'].includes(item.type)) {
          const newHistory = history.slice(0, historyIndex + 1);
          newHistory.push(item.id);
          setHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);
          setCurrentId(item.id);
          setSelectedFileId(null);
          if (!expandedFolders.includes(item.id)) setExpandedFolders(prev => [...prev, item.id]);
          return;
      }
      
      if (item.type === 'txt') openWindow(`notepad-${item.id}`, item.name, <FileText size={16} className="text-blue-500"/>, <Notepad id={item.id} content={item.content} fileName={item.name} />);
      else if (item.type === 'img') openWindow(`img-${item.id}`, item.name, <ImageIcon size={16} className="text-yellow-500"/>, <ImageViewer src={item.src} fileName={item.name} />);
      else if (item.type === 'pdf') openWindow(`pdf-${item.id}`, item.name, <FileType size={16} className="text-red-500"/>, <PDFViewer src={item.src} />);
      else if (item.type === 'mp3') openWindow(`player-${item.id}`, 'Windows Media Player', <div className="w-4 h-4 bg-orange-500 rounded-full border border-white flex items-center justify-center"><Play size={8} fill="white" color="white"/></div>, <MusicPlayer src={item.src} title={item.title} artist={item.artist} />);
      else if (item.type === 'video') openWindow(`video-${item.id}`, 'Windows Media Player', <div className="w-4 h-4 bg-orange-500 rounded-full border border-white flex items-center justify-center"><Film size={8} fill="white" color="white"/></div>, <VideoPlayer src={item.src} title={item.name} />);
      else if (item.type === 'exe') alert("Programa simulado.");
  };

  const handleBack = () => { if (historyIndex > 0) { const newIndex = historyIndex - 1; setHistoryIndex(newIndex); setCurrentId(history[newIndex]); } };
  const handleUp = () => { if (currentFolder.parent) handleOpen(fileSystem[currentFolder.parent]); };
  const toggleExpand = (id) => { setExpandedFolders(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]); };

  const getIcon = (item, size = 48) => {
    if (item.type === 'drive') return <HardDrive className="text-slate-500" size={size} />;
    if (item.type === 'folder' || item.type === 'root') return <Folder className="text-yellow-500 fill-yellow-500" size={size} />;
    if (item.type === 'img') return <div className="w-10 h-10 bg-white p-0.5 border shadow-sm"><img src={item.src} className="w-full h-full object-cover" alt=""/></div>;
    if (item.type === 'pdf') return <FileType className="text-red-500" size={size} />;
    if (item.type === 'exe') return <div className="w-10 h-10 bg-slate-200 border border-slate-400 rounded flex items-center justify-center font-bold text-xs">EXE</div>;
    if (item.type === 'video') return (<div className="flex flex-col items-center justify-center w-12 h-12 bg-white border border-slate-300 shadow-sm relative overflow-hidden"><div className="absolute inset-0 bg-black flex items-center justify-center"><Film className="text-white opacity-50" size={24}/></div><div className="absolute inset-0 flex items-center justify-center"><Play size={20} className="text-white drop-shadow-md fill-white" /></div></div>);
    if (item.type === 'mp3') return (<div className="flex flex-col items-center justify-center w-12 h-12 bg-white border border-slate-300 shadow-sm"><Music size={24} className="text-blue-500" /><span className="text-[8px] font-bold text-blue-500 mt-1">MP3</span></div>);
    return <FileText className="text-slate-500" size={size} />;
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      <div className="bg-[#f0f5f9] border-b border-slate-300 p-2 flex items-center gap-2 flex-shrink-0">
          <button onClick={handleBack} disabled={historyIndex === 0} className="disabled:opacity-30 hover:bg-blue-100 p-1 rounded-full"><ArrowLeft size={16} color="#444" /></button>
          <button onClick={handleUp} disabled={!currentFolder.parent} className="disabled:opacity-30 hover:bg-blue-100 p-1 rounded-full"><ArrowUp size={16} color="#444" /></button>
          <div className="flex-1 bg-white border border-slate-300 rounded-[2px] px-2 py-1 text-sm flex items-center gap-2 shadow-inner h-7">
              <Monitor size={14} className="text-slate-500" />
              <ChevronRight size={12} className="text-slate-400" />
              <span className="text-slate-700 font-medium">{currentFolder.name}</span>
          </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
          <div className="w-[220px] bg-[#f1f5fb] border-r border-[#dae5f0] h-full overflow-y-auto pt-2 pb-4 flex-shrink-0">
              <div className="mb-2">
                  <div className="flex items-center gap-1 px-1 py-0.5 text-slate-500 cursor-default mb-1 group">
                      <Star size={12} className="text-yellow-500 fill-yellow-500 ml-1"/>
                      <span className="text-xs font-bold uppercase tracking-wide">Favoritos</span>
                  </div>
                  <FavoriteLink id="desktop_folder" icon={Monitor} label="Área de Trabalho" currentId={currentId} onClick={handleOpen} fileSystem={fileSystem} />
                  <FavoriteLink id="downloads" icon={Download} label="Downloads" currentId={currentId} onClick={handleOpen} fileSystem={fileSystem} />
                  <FavoriteLink id="docs" icon={FileText} label="Documentos" color="text-yellow-600" currentId={currentId} onClick={handleOpen} fileSystem={fileSystem} />
                  <FavoriteLink id="imgs" icon={ImageIcon} label="Imagens" color="text-yellow-600" currentId={currentId} onClick={handleOpen} fileSystem={fileSystem} />
                  <FavoriteLink id="musics" icon={Music} label="Músicas" color="text-blue-600" currentId={currentId} onClick={handleOpen} fileSystem={fileSystem} />
                  <FavoriteLink id="videos" icon={Film} label="Vídeos" color="text-purple-500" currentId={currentId} onClick={handleOpen} fileSystem={fileSystem} />
              </div>
              <div className="h-[1px] bg-slate-200 mx-2 my-2"></div>
              <div className="mt-1">
                  <SidebarItem id="root" currentId={currentId} expandedFolders={expandedFolders} onToggle={toggleExpand} onNavigate={handleOpen} fileSystem={fileSystem} />
              </div>
          </div>

          <div 
            className={`flex-1 bg-white p-4 overflow-y-auto transition-opacity duration-100 ${opacity === 0 ? 'opacity-0' : 'opacity-100'}`}
            onClick={() => setSelectedFileId(null)}
            onContextMenu={(e) => openContextMenu(e, 'folder-bg', null, currentId)}
          >
            {currentFolder.children && currentFolder.children.length > 0 ? (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 items-start">
                    {currentFolder.children.map(childId => {
                        const child = fileSystem[childId];
                        if (!child) return null;
                        return (
                            <GridItem 
                                key={childId}
                                item={child}
                                selectedFileId={selectedFileId}
                                isRenaming={renamingId === childId}
                                onRename={renameItem}
                                onDoubleClick={(e) => { e.stopPropagation(); handleOpen(child); }}
                                onClick={(e) => { e.stopPropagation(); setSelectedFileId(childId); }}
                                onContextMenu={(e) => openContextMenu(e, child.type === 'folder' ? 'folder' : 'file', childId)}
                                getIcon={getIcon}
                            />
                        )
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2"><span className="text-sm">Esta pasta está vazia.</span></div>
            )}
          </div>
      </div>
      <div className="bg-[#f0f5f9] border-t border-slate-300 px-4 h-8 flex items-center gap-4 text-xs text-slate-600 flex-shrink-0">
          <span>{currentFolder.children ? currentFolder.children.length : 0} itens</span>
          <span className="border-l border-slate-300 pl-4">Local: {currentFolder.name}</span>
      </div>
    </div>
  );
};