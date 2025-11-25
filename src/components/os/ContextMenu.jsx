import React, { useState } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { RefreshCw, Settings, FolderPlus, Trash2, ExternalLink, FileText, ChevronRight } from 'lucide-react';
import { ControlPanel } from '../apps/ControlPanel';

export const ContextMenu = () => {
  const { contextMenu, closeContextMenu, openWindow, triggerRefresh, createItem, setRenamingId } = useOSStore();
  const [showNewSubmenu, setShowNewSubmenu] = useState(false);

  if (!contextMenu.isOpen) return null;

  const handleRefresh = () => {
    triggerRefresh();
    closeContextMenu();
  };

  const handleCreate = (type, name) => {
      const parentId = contextMenu.type === 'desktop' ? 'desktop_folder' : contextMenu.contextId;
      if (parentId) {
          createItem(parentId, type, name);
      }
      closeContextMenu();
  };

  const handlePersonalize = () => {
    openWindow('settings', 'Painel de Controle', <Settings size={16}/>, <ControlPanel />);
    closeContextMenu();
  };

  // AÇÃO DE RENOMEAR
  const handleRename = () => {
      if (contextMenu.targetId) {
          setRenamingId(contextMenu.targetId);
      }
      closeContextMenu();
  };

  const NewSubmenu = () => (
      <div 
        className="absolute left-[98%] -top-1 w-48 bg-[#f0f0f0] border border-[#979797] shadow-[2px_2px_5px_rgba(0,0,0,0.3)] py-1 z-[100000] -ml-1"
        onMouseEnter={() => setShowNewSubmenu(true)}
      >
          <li className="menu-item" onClick={() => handleCreate('folder', 'Nova Pasta')}>
             <span className="w-4"><FolderPlus size={14} className="text-yellow-600"/></span> Pasta
          </li>
          <li className="menu-item" onClick={() => handleCreate('txt', 'Novo Documento de Texto')}>
             <span className="w-4"><FileText size={14} className="text-blue-500"/></span> Documento de Texto
          </li>
      </div>
  );

  const renderOptions = () => {
    if (contextMenu.type === 'desktop' || contextMenu.type === 'folder-bg') {
      return (
        <>
          <li className="menu-item group">
             <span className="w-4"></span> Exibir <span className="ml-auto text-[10px]"><ChevronRight size={10}/></span>
          </li>
          <li className="menu-item">
             <span className="w-4"></span> Classificar por <span className="ml-auto text-[10px]"><ChevronRight size={10}/></span>
          </li>
          <li className="menu-item" onClick={handleRefresh}>
             <span className="w-4"><RefreshCw size={14}/></span> Atualizar
          </li>
          <div className="h-[1px] bg-gray-300 my-1 mx-1"></div>
          <li 
            className="menu-item relative flex justify-between items-center" 
            onMouseEnter={() => setShowNewSubmenu(true)}
            onMouseLeave={() => setShowNewSubmenu(false)}
          >
             <div className="flex items-center gap-2">
                <span className="w-4">✨</span> Novo 
             </div>
             <span className="text-[10px]"><ChevronRight size={10}/></span>
             {showNewSubmenu && <NewSubmenu />}
          </li>
          <div className="h-[1px] bg-gray-300 my-1 mx-1"></div>
          <li className="menu-item font-bold" onClick={handlePersonalize}>
             <span className="w-4"><Settings size={14}/></span> Personalizar
          </li>
        </>
      );
    }

    if (contextMenu.type === 'file' || contextMenu.type === 'folder') {
      return (
        <>
          <li className="menu-item font-bold" onClick={() => closeContextMenu()}>
             <span className="w-4"><ExternalLink size={14}/></span> Abrir
          </li>
          <div className="h-[1px] bg-gray-300 my-1 mx-1"></div>
          <li className="menu-item text-red-600" onClick={() => closeContextMenu()}>
             <span className="w-4"><Trash2 size={14}/></span> Excluir
          </li>
          <li className="menu-item" onClick={handleRename}>
             <span className="w-4"></span> Renomear
          </li>
        </>
      );
    }
    return null;
  };

  return (
    <div 
      className="fixed z-[99999] bg-[#f0f0f0] border border-[#979797] shadow-[2px_2px_5px_rgba(0,0,0,0.3)] py-1 w-56 rounded-sm text-xs text-black font-sans select-none"
      style={{ top: contextMenu.y, left: contextMenu.x }}
      onClick={(e) => e.stopPropagation()}
    >
      <ul className="flex flex-col relative">
         {renderOptions()}
      </ul>
      <style>{`
        .menu-item { display: flex; align-items: center; gap: 8px; padding: 4px 12px 4px 8px; cursor: default; }
        .menu-item:hover { background-color: #e5f3fb; border: 1px solid #7da2ce; padding: 3px 11px 3px 7px; }
      `}</style>
    </div>
  );
};