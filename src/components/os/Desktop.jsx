import React, { useState, useEffect } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Browser } from '../apps/Browser';
import { MusicPlayer } from '../apps/MusicPlayer';
import { VideoPlayer } from '../apps/VideoPlayer';
import { PDFViewer } from '../apps/PDFViewer';
import { AboutMe } from '../apps/AboutMe';
import { GamesExplorer } from '../apps/GamesExplorer';
import { ControlPanel } from '../apps/ControlPanel';
import { Globe, Play, FileText, User, Film, Gamepad2, Settings } from 'lucide-react';

// --- IMPORTAÇÃO DO CURRÍCULO ---
// Certifique-se de que o arquivo existe em src/assets/curriculo.pdf
import curriculoPdf from '../../assets/curriculo.pdf';

// --- ÍCONES PERSONALIZADOS ---

const InternetIcon = () => (
    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-300 shadow-lg text-blue-600 font-bold text-xl relative overflow-hidden">
       e
       <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-500/30 rounded-full"></div>
       <div className="absolute -inset-1 border-t-2 border-yellow-400 rounded-full rotate-[-15deg] opacity-70"></div>
    </div>
);

const MediaPlayerIcon = () => (
    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center border-2 border-white shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
        <Play fill="white" className="text-white drop-shadow-md" size={24} />
        <div className="absolute bottom-0 w-full h-1/3 bg-black/20 backdrop-blur-sm"></div>
    </div>
);

const VideoFileIcon = () => (
    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center border-2 border-white shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 w-full h-2 bg-black/30 flex justify-center gap-1 pt-0.5">
            {[1,2,3,4].map(i => <div key={i} className="w-1 h-1 bg-white/50 rounded-full"></div>)}
        </div>
        <div className="absolute bottom-0 w-full h-2 bg-black/30 flex justify-center gap-1 pb-0.5">
            {[1,2,3,4].map(i => <div key={i} className="w-1 h-1 bg-white/50 rounded-full"></div>)}
        </div>
        <Film fill="white" className="text-white drop-shadow-md" size={24} />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-white/20 pointer-events-none"></div>
    </div>
);

const GamesFolderIcon = () => (
    <div className="w-12 h-12 relative flex items-center justify-center">
        {/* Pasta Azulada */}
        <div className="absolute w-12 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-md border-2 border-blue-200 shadow-lg"></div>
        <div className="absolute w-12 h-10 top-[-4px] left-0 bg-blue-300 rounded-t-md clip-path-folder"></div>
        {/* Controle Saindo */}
        <div className="relative z-10 text-white drop-shadow-md transform -rotate-12 -translate-y-1">
            <Gamepad2 size={28} fill="#333" className="text-slate-800" />
        </div>
    </div>
);

const SettingsIcon = () => (
    <div className="w-12 h-12 bg-slate-200 rounded-md flex items-center justify-center border-2 border-slate-400 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-300"></div>
        <Settings size={28} className="text-slate-700 relative z-10 drop-shadow-sm" />
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full blur-md opacity-50"></div>
    </div>
);

const CVIcon = () => (
    <div className="w-10 h-12 bg-white border border-slate-300 shadow-md flex flex-col items-center relative">
        <div className="w-full h-1 bg-red-500"></div>
        <div className="flex-1 w-full p-1 flex flex-col gap-1">
            <div className="w-full h-1 bg-slate-200"></div>
            <div className="w-3/4 h-1 bg-slate-200"></div>
            <div className="w-full h-1 bg-slate-200"></div>
        </div>
        <div className="absolute -right-1 -bottom-1 bg-red-600 text-white text-[8px] font-bold px-1 rounded-sm">PDF</div>
    </div>
);

const AboutIcon = () => (
    <div className="w-12 h-12 bg-slate-800 rounded-full border-2 border-slate-600 shadow-lg flex items-center justify-center relative overflow-hidden">
        <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
            className="w-full h-full object-cover opacity-80" 
            alt="Me" 
        />
        <div className="absolute bottom-0 right-0 bg-blue-500 rounded-tl-md p-0.5">
            <User size={10} className="text-white"/>
        </div>
    </div>
);

// Componente de Ícone Genérico
const DesktopIcon = ({ label, icon, onDoubleClick, onContextMenu }) => (
  <div 
    onDoubleClick={onDoubleClick}
    onContextMenu={onContextMenu}
    className="flex flex-col items-center gap-1 p-2 w-[90px] h-[110px] hover:bg-white/10 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)] rounded border border-transparent cursor-pointer group transition-all active:scale-95 mb-2"
  >
    <div className="relative w-12 h-12 flex items-center justify-center filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)] transition-transform group-hover:-translate-y-1">
        {icon}
    </div>
    <span className="text-white text-xs font-medium text-center leading-tight select-none px-1 rounded shadow-black line-clamp-2 break-words w-full" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.5)' }}>{label}</span>
  </div>
);

export const Desktop = () => {
  const { openWindow, openContextMenu, refreshKey } = useOSStore();
  const [opacity, setOpacity] = useState(100);

  // Efeito Piscar (Refresh)
  useEffect(() => {
      if (refreshKey > 0) {
          setOpacity(0);
          setTimeout(() => setOpacity(100), 150);
      }
  }, [refreshKey]);

  // URLs de Mídia
  const musicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  return (
    <div 
        className="absolute inset-0 p-2 flex flex-col flex-wrap content-start items-start gap-1 z-0 pt-4 pl-4 pb-12 overflow-hidden"
        onContextMenu={(e) => openContextMenu(e, 'desktop')}
    >
       <div className={`contents transition-opacity duration-100 ${opacity === 0 ? 'opacity-0' : 'opacity-100'}`}>
           
           {/* 1. MEU CURRÍCULO (Agora usando o arquivo importado) */}
           <DesktopIcon 
              label="Meu Currículo" 
              icon={<CVIcon />} 
              onDoubleClick={() => openWindow('cv', 'Meu Currículo.pdf', <FileText size={16} className="text-red-500"/>, <PDFViewer src={curriculoPdf} />)} 
              onContextMenu={(e) => openContextMenu(e, 'file', 'cv')}
           />

           {/* 2. SOBRE MIM */}
           <DesktopIcon 
              label="Sobre Mim" 
              icon={<AboutIcon />} 
              onDoubleClick={() => openWindow('about', 'Sobre Mim', <User size={16} className="text-blue-500"/>, <AboutMe />)} 
              onContextMenu={(e) => openContextMenu(e, 'file', 'about')}
           />

           {/* 3. INTERNET */}
           <DesktopIcon 
              label="Internet Explorer" 
              icon={<InternetIcon />} 
              onDoubleClick={() => openWindow('browser', 'Internet Explorer', <Globe size={16} className="text-blue-500"/>, <Browser initialUrl="https://github.com/seu-usuario?tab=repositories" />)} 
              onContextMenu={(e) => openContextMenu(e, 'file', 'browser')}
           />

           {/* 4. MÚSICA */}
           <DesktopIcon 
              label="Minha Playlist" 
              icon={<MediaPlayerIcon />} 
              onDoubleClick={() => openWindow('wmp', 'Windows Media Player', <Play size={16} className="text-orange-500"/>, <MusicPlayer src={musicUrl} title="Dream Scapes" artist="SoundHelix" />)} 
              onContextMenu={(e) => openContextMenu(e, 'file', 'wmp')}
           />

           {/* 5. VÍDEO */}
           <DesktopIcon 
              label="Vídeo de Apresentação" 
              icon={<VideoFileIcon />} 
              onDoubleClick={() => openWindow('video-demo', 'Vídeo de Apresentação', <Film size={16} className="text-purple-500"/>, <VideoPlayer src={videoUrl} title="Apresentação do Projeto" />)} 
              onContextMenu={(e) => openContextMenu(e, 'file', 'video')}
           />

           {/* 6. JOGOS */}
           <DesktopIcon 
              label="Jogos" 
              icon={<GamesFolderIcon />} 
              onDoubleClick={() => openWindow('games-explorer', 'Jogos', <Gamepad2 size={16} className="text-green-600"/>, <GamesExplorer />)} 
              onContextMenu={(e) => openContextMenu(e, 'folder', 'games')}
           />

           {/* 7. PERSONALIZAR */}
           <DesktopIcon 
              label="Personalizar" 
              icon={<SettingsIcon />} 
              onDoubleClick={() => openWindow('settings', 'Painel de Controle', <Settings size={16}/>, <ControlPanel />)} 
              onContextMenu={(e) => openContextMenu(e, 'file', 'settings')}
           />

       </div>
    </div>
  );
};