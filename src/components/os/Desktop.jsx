import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Browser } from '../apps/Browser';
import { MusicPlayer } from '../apps/MusicPlayer';
import { VideoPlayer } from '../apps/VideoPlayer';
import { PDFViewer } from '../apps/PDFViewer';
import { AboutMe } from '../apps/AboutMe';
import { GamesExplorer } from '../apps/GamesExplorer';
import { ControlPanel } from '../apps/ControlPanel';
import { Notepad } from '../apps/Notepad';
import { FileExplorer } from '../apps/FileExplorer';
import { Settings, Gamepad2, Play, Film, User, FileText, Globe, Image as ImageIcon } from 'lucide-react';
import curriculoPdf from '../../assets/curriculo.pdf';

// --- IMPORTAÇÃO DOS ASSETS WEBP ---
// Certifique-se de que estes arquivos existem na sua pasta de assets
import folderWebp from '../../assets/icons/folder.ico';
import textWebp from '../../assets/icons/text.ico';
import ieWebp from '../../assets/icons/ie.ico';
import wmpWebp from '../../assets/icons/wmp.ico';
import videoWebp from '../../assets/icons/video.png';
import gamesWebp from '../../assets/icons/game.ico';
import settingsWebp from '../../assets/icons/config.ico';
import pdfWebp from '../../assets/icons/pdf.ico';
import userWebp from '../../assets/icons/user.png';
import imageWebp from '../../assets/icons/user.png'; // Ícone genérico para imagens
import unknownWebp from '../../assets/icons/user.png'; // Ícone genérico para desconhecido

// --- COMPONENTE AUXILIAR PARA ÍCONES WEBP ---
const WebPIcon = ({ src, alt = "icon" }) => (
  <img 
    src={src} 
    alt={alt} 
    className="w-full h-full object-contain drop-shadow-md select-none pointer-events-none" 
    draggable={false}
  />
);

// --- COMPONENTE DE ÍCONE DA ÁREA DE TRABALHO (GRID FIXO) ---
const DesktopIcon = ({ id, label, icon, onDoubleClick, onContextMenu, isRenaming, onRename }) => {
  const [tempName, setTempName] = useState(label);
  const inputRef = useRef(null);

  useEffect(() => {
      setTempName(label); // Sincroniza se o nome mudar externamente
  }, [label]);

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
      {/* Container do Ícone */}
      <div className="w-10 h-10 md:w-[48px] md:h-[48px] flex-shrink-0 flex items-center justify-center filter drop-shadow-[2px_2px_1px_rgba(0,0,0,0.3)]">
          {icon}
      </div>
      
      {/* Container do Texto */}
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
                style={{ 
                    fontFamily: 'Tahoma, sans-serif',
                    textShadow: '1px 1px 0px #000000',
                    wordBreak: 'break-word'
                }}
                title={label}
            >
                {label}
            </span>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export const Desktop = () => {
  const { openWindow, openContextMenu, fileSystem, refreshKey, desktopSort, renameItem, renamingId } = useOSStore();
  const [opacity, setOpacity] = useState(100);

  useEffect(() => {
      if (refreshKey > 0) {
          setOpacity(0);
          setTimeout(() => setOpacity(100), 150);
      }
  }, [refreshKey]);

  // Carrega itens do desktop da store
  let desktopItems = fileSystem['desktop_folder']?.children.map(id => fileSystem[id]).filter(Boolean) || [];

  if (desktopSort === 'name') desktopItems.sort((a, b) => a.name.localeCompare(b.name));
  else if (desktopSort === 'type') desktopItems.sort((a, b) => a.type.localeCompare(b.type));

  // Função helper para definir ícones dinâmicos baseados no tipo do arquivo
  const getIcon = (item) => {
      if (item.type === 'folder') return <WebPIcon src={folderWebp} />;
      if (item.type === 'txt') return <WebPIcon src={textWebp} />;
      if (item.type === 'img') return <WebPIcon src={imageWebp} />;
      return <WebPIcon src={unknownWebp} />;
  };

  const handleOpenItem = (item) => {
      // Passamos o ícone WebP também para a janela, se necessário, ou mantemos o ícone SVG pequeno na barra de título
      if (item.type === 'folder') openWindow(`folder-${item.id}`, item.name, <WebPIcon src={folderWebp}/>, <FileExplorer initialPath={item.id}/>);
      else if (item.type === 'txt') openWindow(`notepad-${item.id}`, item.name, <FileText size={16}/>, <Notepad id={item.id} content={item.content} fileName={item.name} />);
  };

  const getName = (id, defaultName) => fileSystem[id]?.name || defaultName;
  const musicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  return (
    <div 
        className="absolute inset-0 p-2 flex flex-col flex-wrap content-start items-start gap-y-1 gap-x-2 z-0 pt-4 pl-2 pb-12 overflow-hidden"
        onContextMenu={(e) => openContextMenu(e, 'desktop')}
    >
       <div className={`contents transition-opacity duration-100 ${opacity === 0 ? 'opacity-0' : 'opacity-100'}`}>
           
           {/* --- ÍCONES PADRÃO (FIXOS) --- */}
           
           {/* Currículo */}
           <DesktopIcon 
              id="cv"
              label={getName('cv', "Meu Currículo")} 
              icon={<WebPIcon src={pdfWebp} />} 
              isRenaming={renamingId === 'cv'} onRename={renameItem}
              onDoubleClick={() => openWindow('cv', 'Meu Currículo.pdf', <FileText size={16} className="text-red-500"/>, <PDFViewer src={curriculoPdf} />)} 
              onContextMenu={(e) => openContextMenu(e, 'file', 'cv')}
           />

           {/* Sobre Mim */}
           <DesktopIcon 
              id="about"
              label={getName('about', "Sobre Mim")} 
              icon={<WebPIcon src={userWebp} />} 
              isRenaming={renamingId === 'about'} onRename={renameItem}
              onDoubleClick={() => openWindow('about', 'Sobre Mim', <User size={16} className="text-blue-500"/>, <AboutMe />)} 
              onContextMenu={(e) => openContextMenu(e, 'file', 'about')}
           />

           {/* Internet Explorer */}
           <DesktopIcon 
              id="browser"
              label={getName('browser', "Internet Explorer")} 
              icon={<WebPIcon src={ieWebp} />} 
              isRenaming={renamingId === 'browser'} onRename={renameItem}
              onDoubleClick={() => openWindow('browser', 'Internet Explorer', <Globe size={16} className="text-blue-500"/>, <Browser initialUrl="https://github.com" />)} 
              onContextMenu={(e) => openContextMenu(e, 'file', 'browser')}
           />

           {/* Media Player */}
           <DesktopIcon 
              id="wmp"
              label={getName('wmp', "Media Player")} 
              icon={<WebPIcon src={wmpWebp} />} 
              isRenaming={renamingId === 'wmp'} onRename={renameItem}
              onDoubleClick={() => openWindow('wmp', 'Windows Media Player', <Play size={16} className="text-orange-500"/>, <MusicPlayer src={musicUrl} title="Dream Scapes" artist="SoundHelix" />, '/', { isSkin: true })} 
              onContextMenu={(e) => openContextMenu(e, 'file', 'wmp')}
           />

           {/* Vídeo Demo */}
           <DesktopIcon 
              id="video_demo" 
              label={getName('video_demo', "Vídeo Demo")} 
              icon={<WebPIcon src={videoWebp} />} 
              isRenaming={renamingId === 'video_demo'} onRename={renameItem}
              onDoubleClick={() => openWindow('video-demo', 'Apresentação', <Film size={16} className="text-purple-500"/>, <VideoPlayer src={videoUrl} title="Apresentação do Projeto" />, '/', { isSkin: true })} 
              onContextMenu={(e) => openContextMenu(e, 'file', 'video_demo')}
           />

           {/* Pasta Jogos */}
           <DesktopIcon 
              id="games_folder" 
              label={getName('games_folder', "Jogos")} 
              icon={<WebPIcon src={gamesWebp} />} 
              isRenaming={renamingId === 'games_folder'} onRename={renameItem}
              onDoubleClick={() => openWindow('games-explorer', 'Jogos', <Gamepad2 size={16} className="text-green-600"/>, <GamesExplorer />)} 
              onContextMenu={(e) => openContextMenu(e, 'folder', 'games_folder')}
           />

           {/* Personalizar (Configurações) */}
           <DesktopIcon 
              id="settings"
              label={getName('settings', "Personalizar")} 
              icon={<WebPIcon src={settingsWebp} />} 
              isRenaming={renamingId === 'settings'} onRename={renameItem}
              onDoubleClick={() => openWindow('settings', 'Painel de Controle', <Settings size={16}/>, <ControlPanel />)} 
              onContextMenu={(e) => openContextMenu(e, 'file', 'settings')}
           />

           {/* --- ÍCONES CRIADOS PELO USUÁRIO (DINÂMICOS) --- */}
           {desktopItems.map(item => (
               <DesktopIcon 
                   key={item.id} id={item.id} label={item.name} icon={getIcon(item)}
                   isRenaming={renamingId === item.id} onRename={renameItem}
                   onDoubleClick={() => handleOpenItem(item)}
                   onContextMenu={(e) => openContextMenu(e, item.type === 'folder' ? 'folder' : 'file', item.id)}
               />
           ))}
       </div>
    </div>
  );
};