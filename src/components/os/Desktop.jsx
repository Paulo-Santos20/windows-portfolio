import React from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Browser } from '../apps/Browser';
import { FileExplorer } from '../apps/FileExplorer';
import { ControlPanel } from '../apps/ControlPanel';
import { Trash2, Monitor, Settings, Globe } from 'lucide-react';

// --- ÍCONES PERSONALIZADOS ---

const ComputerIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <rect x="2" y="4" width="20" height="14" rx="2" fill="#3b82f6" stroke="#1d4ed8"/>
        <rect x="4" y="6" width="16" height="10" fill="#eff6ff"/>
        <path d="M8 22H16" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 18V22" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
        <rect x="2" y="18" width="20" height="2" fill="#1e40af"/>
    </svg>
);

const FolderIcon = ({ type }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <path d="M2 6C2 4.89543 2.89543 4 4 4H10L12 6H20C21.1046 6 22 6.89543 22 8V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V6Z" fill="#eab308" stroke="#ca8a04" strokeWidth="0.5"/>
    {type === 'docs' && <path d="M6 8H18V18H6V8Z" fill="white" />}
    {type === 'docs' && <path d="M8 10H16M8 12H16M8 14H12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>}
    {type === 'imgs' && <rect x="6" y="8" width="12" height="10" fill="#bfdbfe" />}
    {type === 'imgs' && <circle cx="10" cy="12" r="1.5" fill="#1e40af" />}
    {type === 'imgs' && <path d="M18 16L14 12L11 15L9 14L6 17V18H18V16Z" fill="#1e3b8a" />}
    <path d="M2 9C2 7.89543 2.89543 7 4 7H20C21.1046 7 22 7.89543 22 9V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V9Z" fill="url(#folderGradient)" stroke="#ca8a04" strokeWidth="0.5" opacity="0.95"/>
    <defs>
      <linearGradient id="folderGradient" x1="2" y1="7" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fde047" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>
    </defs>
  </svg>
);

// --- COMPONENTE DO ÍCONE DA ÁREA DE TRABALHO ---
const DesktopIcon = ({ label, icon, onDoubleClick, onContextMenu }) => (
  <div 
    onDoubleClick={onDoubleClick}
    onContextMenu={onContextMenu}
    className="flex flex-col items-center gap-1 p-2 w-[84px] hover:bg-white/10 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)] rounded border border-transparent cursor-pointer group transition-all active:scale-95"
  >
    <div className="relative w-12 h-12 flex items-center justify-center filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)] transition-transform group-hover:-translate-y-1">
        {icon}
    </div>
    <span 
        className="text-white text-xs font-medium text-center leading-tight select-none px-1 rounded shadow-black"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.5)' }}
    >
        {label}
    </span>
  </div>
);

// --- DESKTOP PRINCIPAL ---
export const Desktop = () => {
  const { openWindow, openContextMenu } = useOSStore();

  return (
    <div 
        className="absolute inset-0 p-2 flex flex-col flex-wrap content-start gap-2 z-0 pt-4 pl-4"
        onContextMenu={(e) => openContextMenu(e, 'desktop')}
    >
       
       {/* 1. Meu Computador */}
       <DesktopIcon 
          label="Meu Computador" 
          icon={<ComputerIcon />}
          onDoubleClick={() => openWindow('pc', 'Meu Computador', <Monitor size={16}/>, <FileExplorer initialPath="root"/>)}
          onContextMenu={(e) => openContextMenu(e, 'file', 'pc')}
       />

       {/* 2. Meus Documentos */}
       <DesktopIcon 
          label="Meus Documentos" 
          icon={<FolderIcon type="docs" />}
          onDoubleClick={() => openWindow('docs', 'Meus Documentos', <div className="w-4 h-4 text-yellow-500"><FolderIcon type="docs"/></div>, <FileExplorer initialPath="docs"/>)}
          onContextMenu={(e) => openContextMenu(e, 'folder', 'docs')}
       />

       {/* 3. Minhas Imagens */}
       <DesktopIcon 
          label="Minhas Imagens" 
          icon={<FolderIcon type="imgs" />}
          onDoubleClick={() => openWindow('imgs', 'Minhas Imagens', <div className="w-4 h-4 text-yellow-500"><FolderIcon type="imgs"/></div>, <FileExplorer initialPath="imgs"/>)}
          onContextMenu={(e) => openContextMenu(e, 'folder', 'imgs')}
       />

       {/* 4. Painel de Controle (Personalizar) */}
       <DesktopIcon 
          label="Personalizar" 
          icon={
             <div className="w-10 h-10 bg-slate-200 rounded-md flex items-center justify-center border-2 border-slate-400 shadow-lg">
                <Settings size={24} className="text-slate-700" />
             </div>
          } 
          onDoubleClick={() => openWindow('settings', 'Painel de Controle', <Settings size={16}/>, <ControlPanel />)}
          onContextMenu={(e) => openContextMenu(e, 'file', 'settings')}
       />

       {/* 5. Lixeira */}
       <DesktopIcon 
          label="Lixeira" 
          icon={<Trash2 size={40} className="text-slate-300 drop-shadow-lg" />} 
          onDoubleClick={() => alert('A Lixeira está vazia.')}
          onContextMenu={(e) => openContextMenu(e, 'file', 'trash')}
       />

       {/* 6. Internet Explorer */}
       <DesktopIcon 
          label="Internet Explorer" 
          icon={
             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-300 shadow-lg text-blue-600 font-bold text-xl relative overflow-hidden">
                e
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-500/30 rounded-full"></div>
                <div className="absolute -inset-1 border-t-2 border-yellow-400 rounded-full rotate-[-15deg] opacity-70"></div>
             </div>
          } 
          onDoubleClick={() => openWindow('browser', 'Internet Explorer', <span className="font-bold text-blue-400">e</span>, <Browser />)}
          onContextMenu={(e) => openContextMenu(e, 'file', 'browser')}
       />

    </div>
  );
};