import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Browser } from '../apps/Browser';
import { FileExplorer } from '../apps/FileExplorer';
import { ControlPanel } from '../apps/ControlPanel';
import { Notepad } from '../apps/Notepad';
import { Trash2, Monitor, Settings, FileText, Image as ImageIcon, Folder } from 'lucide-react';

const ComputerIcon = () => (<svg viewBox="0 0 24 24" fill="none" className="w-full h-full"><rect x="2" y="4" width="20" height="14" rx="2" fill="#3b82f6" stroke="#1d4ed8"/><rect x="4" y="6" width="16" height="10" fill="#eff6ff"/><path d="M8 22H16" stroke="#64748b" strokeWidth="2"/><path d="M12 18V22" stroke="#64748b" strokeWidth="2"/><rect x="2" y="18" width="20" height="2" fill="#1e40af"/></svg>);
const FolderIcon = () => (<svg viewBox="0 0 24 24" fill="none" className="w-full h-full"><path d="M2 6C2 4.89543 2.89543 4 4 4H10L12 6H20C21.1046 6 22 6.89543 22 8V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V6Z" fill="#eab308" stroke="#ca8a04" strokeWidth="0.5"/><path d="M2 9C2 7.89543 2.89543 7 4 7H20C21.1046 7 22 7.89543 22 9V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V9Z" fill="url(#folderGradient)" stroke="#ca8a04" strokeWidth="0.5" opacity="0.95"/><defs><linearGradient id="folderGradient" x1="2" y1="7" x2="22" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#fde047" /><stop offset="1" stopColor="#d97706" /></linearGradient></defs></svg>);

// COMPONENTE ÍCONE COM INPUT DE RENOMEAR
const DesktopIcon = ({ id, label, icon, onDoubleClick, onContextMenu, isRenaming, onRename }) => {
  const [tempName, setTempName] = useState(label);
  const inputRef = useRef(null);

  useEffect(() => {
      if (isRenaming && inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
      }
  }, [isRenaming]);

  const handleKeyDown = (e) => {
      if (e.key === 'Enter') onRename(id, tempName);
      if (e.key === 'Escape') onRename(id, label); // Cancela
  };

  return (
    <div 
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      className="flex flex-col items-center gap-1 p-2 w-[84px] hover:bg-white/10 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)] rounded border border-transparent cursor-pointer group transition-all active:scale-95"
    >
      <div className="relative w-12 h-12 flex items-center justify-center filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)] transition-transform group-hover:-translate-y-1">
          {icon}
      </div>
      
      {isRenaming ? (
          <input 
            ref={inputRef}
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={() => onRename(id, tempName)}
            onKeyDown={handleKeyDown}
            className="text-black text-xs text-center w-full px-1 outline-none border border-blue-500 z-50"
            onClick={(e) => e.stopPropagation()} // Evita clicar no desktop
          />
      ) : (
          <span className="text-white text-xs font-medium text-center leading-tight select-none px-1 rounded shadow-black break-words w-full" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.5)' }}>
              {label}
          </span>
      )}
    </div>
  );
};

export const Desktop = () => {
  const { openWindow, openContextMenu, fileSystem, refreshKey, renamingId, renameItem } = useOSStore();
  const [opacity, setOpacity] = useState(100);

  useEffect(() => {
      if (refreshKey > 0) {
          setOpacity(0);
          setTimeout(() => setOpacity(100), 150);
      }
  }, [refreshKey]);

  const desktopItems = fileSystem['desktop_folder']?.children.map(id => fileSystem[id]).filter(Boolean) || [];

  const getIcon = (item) => {
      if (item.type === 'folder') return <FolderIcon />;
      if (item.type === 'txt') return <div className="w-10 h-12 bg-white border border-slate-300 flex items-center justify-center shadow-sm"><FileText className="text-slate-500"/></div>;
      if (item.type === 'img') return <div className="w-10 h-10 bg-white border border-slate-300 flex items-center justify-center shadow-sm"><ImageIcon className="text-purple-500"/></div>;
      return <div className="w-10 h-10 bg-slate-200 border-2 border-slate-400 flex items-center justify-center">?</div>;
  };

  const handleOpenItem = (item) => {
      if (item.type === 'folder') {
          openWindow(`folder-${item.id}`, item.name, <FolderIcon/>, <FileExplorer initialPath={item.id}/>);
      } else if (item.type === 'txt') {
          openWindow(`notepad-${item.id}`, item.name, <FileText size={16} className="text-blue-500"/>, <Notepad id={item.id} content={item.content} fileName={item.name} />);
      }
  };

  return (
    <div 
        className="absolute inset-0 p-2 flex flex-col flex-wrap content-start gap-2 z-0 pt-4 pl-4"
        onContextMenu={(e) => openContextMenu(e, 'desktop')}
    >
       <div className={`contents transition-opacity duration-100 ${opacity === 0 ? 'opacity-0' : 'opacity-100'}`}>
           
           {/* Ícones Fixos (Não renomeáveis por padrão, mas poderiam ser) */}
           <DesktopIcon label="Meu Computador" icon={<ComputerIcon />} onDoubleClick={() => openWindow('pc', 'Meu Computador', <Monitor size={16}/>, <FileExplorer initialPath="root"/>)} onContextMenu={(e) => openContextMenu(e, 'file', 'pc')} />
           <DesktopIcon label="Meus Documentos" icon={<FolderIcon />} onDoubleClick={() => openWindow('docs', 'Meus Documentos', <div className="w-4 h-4 text-yellow-500"><FolderIcon /></div>, <FileExplorer initialPath="docs"/>)} onContextMenu={(e) => openContextMenu(e, 'folder', 'docs')} />
           <DesktopIcon label="Personalizar" icon={<div className="w-10 h-10 bg-slate-200 rounded-md flex items-center justify-center border-2 border-slate-400 shadow-lg"><Settings size={24} className="text-slate-700" /></div>} onDoubleClick={() => openWindow('settings', 'Painel de Controle', <Settings size={16}/>, <ControlPanel />)} onContextMenu={(e) => openContextMenu(e, 'file', 'settings')} />
           <DesktopIcon label="Lixeira" icon={<Trash2 size={40} className="text-slate-300 drop-shadow-lg" />} onDoubleClick={() => alert('A Lixeira está vazia.')} onContextMenu={(e) => openContextMenu(e, 'file', 'trash')} />
           <DesktopIcon label="Internet Explorer" icon={<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-300 shadow-lg text-blue-600 font-bold text-xl relative overflow-hidden">e<div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-500/30 rounded-full"></div><div className="absolute -inset-1 border-t-2 border-yellow-400 rounded-full rotate-[-15deg] opacity-70"></div></div>} onDoubleClick={() => openWindow('browser', 'Internet Explorer', <span className="font-bold text-blue-400">e</span>, <Browser />)} onContextMenu={(e) => openContextMenu(e, 'file', 'browser')} />

           {/* Ícones do Usuário (Renomeáveis) */}
           {desktopItems.map(item => (
               <DesktopIcon 
                   key={item.id}
                   id={item.id}
                   label={item.name}
                   icon={getIcon(item)}
                   isRenaming={renamingId === item.id}
                   onRename={renameItem}
                   onDoubleClick={() => handleOpenItem(item)}
                   onContextMenu={(e) => openContextMenu(e, item.type === 'folder' ? 'folder' : 'file', item.id)}
               />
           ))}
       </div>
    </div>
  );
};