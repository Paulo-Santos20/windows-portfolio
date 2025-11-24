import React from 'react';
import { Folder, Globe, Trash2, FileText } from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';
import { Browser } from '../apps/Browser';

const DesktopIcon = ({ label, icon, onDoubleClick }) => (
  <div 
    onDoubleClick={onDoubleClick}
    className="flex flex-col items-center gap-1 p-2 w-24 hover:bg-white/10 rounded border border-transparent hover:border-white/20 cursor-pointer group text-shadow"
  >
    <div className="text-white filter drop-shadow-lg transition-transform group-active:scale-95">
        {icon}
    </div>
    <span className="text-white text-xs font-medium shadow-black drop-shadow-md text-center leading-tight select-none bg-black/20 rounded px-1">
        {label}
    </span>
  </div>
);

export const Desktop = () => {
  const { openWindow } = useOSStore();

  const openBrowser = () => {
    openWindow('browser', 'Internet Explorer', <Globe size={16} />, <Browser />);
  };

  const openCV = () => {
    openWindow('cv', 'Currículo.pdf', <FileText size={16} />, <div className="p-4">Visualizador de PDF aqui...</div>);
  };

  return (
    <div className="absolute inset-0 p-4 flex flex-col flex-wrap content-start gap-2 z-0">
       <DesktopIcon label="Meu Computador" icon={<div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center"><Folder className="text-white" /></div>} />
       <DesktopIcon label="Lixeira" icon={<Trash2 size={40} className="text-slate-300" />} />
       <DesktopIcon label="Internet" onDoubleClick={openBrowser} icon={<Globe size={40} className="text-blue-300" />} />
       <DesktopIcon label="Meu CV" onDoubleClick={openCV} icon={<FileText size={40} className="text-yellow-100" />} />
    </div>
  );
};