import React, { useState } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { 
    FileText, 
    Image as ImageIcon, 
    Folder, 
    ArrowLeft, 
    ArrowUp, 
    Monitor, 
    FileType, 
    ChevronRight, 
    ChevronDown, 
    HardDrive,
    Star,
    Download,
    Film, 
    Music,
    Play
} from 'lucide-react';
import { Notepad } from './Notepad';
import { ImageViewer } from './ImageViewer';
import { PDFViewer } from './PDFViewer';
import { MusicPlayer } from './MusicPlayer';

// --- MOCK FILE SYSTEM (SISTEMA DE ARQUIVOS) ---
const fileSystem = {
  // --- ESTRUTURA BASE ---
  'root': { id: 'root', name: 'Computador', type: 'root', children: ['c_drive'] },
  'c_drive': { id: 'c_drive', name: 'Disco Local (C:)', type: 'drive', parent: 'root', children: ['users', 'program_files', 'windows'] },
  
  'program_files': { id: 'program_files', name: 'Arquivos de Programas', type: 'folder', parent: 'c_drive', children: [] },
  'windows': { id: 'windows', name: 'Windows', type: 'folder', parent: 'c_drive', children: ['system32'] },
  'system32': { id: 'system32', name: 'System32', type: 'folder', parent: 'windows', children: [] },

  // --- USUÁRIO ---
  'users': { id: 'users', name: 'Usuários', type: 'folder', parent: 'c_drive', children: ['paulo'] },
  'paulo': { id: 'paulo', name: 'Paulo', type: 'folder', parent: 'users', children: ['desktop_folder', 'downloads', 'docs', 'imgs', 'videos', 'musics'] },

  // --- PASTAS DE CATEGORIA ---
  'desktop_folder': { id: 'desktop_folder', name: 'Área de Trabalho', type: 'folder', parent: 'paulo', children: ['shortcut_game'] },
  'downloads': { id: 'downloads', name: 'Downloads', type: 'folder', parent: 'paulo', children: [] },
  'docs': { id: 'docs', name: 'Documentos', type: 'folder', parent: 'paulo', children: ['cv', 'notes', 'techs'] },
  'imgs': { id: 'imgs', name: 'Imagens', type: 'folder', parent: 'paulo', children: ['perfil', 'wallpaper'] },
  'videos': { id: 'videos', name: 'Vídeos', type: 'folder', parent: 'paulo', children: ['video_demo'] },
  // AQUI ESTÁ A CORREÇÃO: A pasta músicas tem o filho 'song1'
  'musics': { id: 'musics', name: 'Músicas', type: 'folder', parent: 'paulo', children: ['song1'] },

  // --- ARQUIVOS E CONTEÚDO ---
  'cv': { 
      id: 'cv', name: 'Curriculo_FullStack.pdf', type: 'pdf', parent: 'docs',
      src: 'data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmoKICA8PCAvVHlwZSAvQ2F0YWxvZwogICAgIC9QYWdlcyAyIDAgUgogID4+CmVuZG9iagoKMiAwIG9iagogIDw8IC9UeXBlIC9QYWdlcwogICAgIC9LaWRzIFszIDAgUl0KICAgICAvQ291bnQgMQogICAgIC9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCiAgPj4KZW5kb2JqCgozIDAgb2JqCiAgPDwgIC9UeXBlIC9QYWdlCiAgICAgIC9QYXJlbnQgMiAwIFIKICAgICAgL1Jlc291cmNlcwogICAgICAgPDwgL0ZvbnQKICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgPDwgL1R5cGUgL0ZvbnQKICAgICAgICAgICAgICAgIC9TdWJ0eXBlIC9UeXBlMQogICAgICAgICAgICAgICAgL0Jhc2VGb250IC9IZWx2ZXRpY2EKICAgICAgICAgICAgID4+CiAgICAgICAgICA+PgogICAgICAgPj4KICAgICAgL0NvbnRlbnRzIDQgMCBSCiAgPj4KZW5kb2JqCgo0IDAgb2JqCiAgPDwgL0xlbmd0aCA1NQogID4+CnN0cmVhbQogIEJUKC9GMSAxMiBUZikgMTAwIDcwMCBUZCAoSGVsbG8hIEVzdGUgZSB1bSBQREYgZGUgVGVzdGUgbm8gc2V1IFBvcnRmb2xpbyBXaW5kb3dzIDcpIFRqIEVVCmVuZHN0cmVhbQplbmRvYmoKCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxMCAwMDAwMCBuIAowMDAwMDAwMDYwIDAwMDAwIG4gCjAwMDAwMDAxNTcgMDAwMDAgbiAKMDAwMDAwMDMwNiAwMDAwMCBuIAp0cmFpbGVyCiAgPDwgL1Jvb3QgMSAwIFIKICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjQxMQolJUVPRgo=' 
  },
  'notes': { id: 'notes', name: 'Bem_Vindo.txt', type: 'txt', parent: 'docs', content: 'Bem vindo ao meu portfólio estilo Windows 7!' },
  'techs': { id: 'techs', name: 'Stack.txt', type: 'txt', parent: 'docs', content: 'React, Tailwind, Zustand.' },
  'perfil': { id: 'perfil', name: 'Foto_Perfil.jpg', type: 'img', parent: 'imgs', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  'wallpaper': { id: 'wallpaper', name: 'Wallpaper.jpg', type: 'img', parent: 'imgs', src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
  'video_demo': { id: 'video_demo', name: 'Demo_Project.mp4', type: 'video', parent: 'videos' },
  'shortcut_game': { id: 'shortcut_game', name: 'Steam_Setup.exe', type: 'exe', parent: 'desktop_folder' },
  
  // --- ARQUIVO DE MÚSICA ---
  'song1': { 
      id: 'song1', 
      name: 'Dream_Scapes.mp3', 
      type: 'mp3', 
      parent: 'musics', 
      // Link direto para um MP3 funcional
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 
      title: 'Dream Scapes', 
      artist: 'SoundHelix' 
  }
};

// --- COMPONENTES AUXILIARES ---
const FavoriteLink = ({ id, icon: Icon, label, color = "text-blue-500", currentId, onClick }) => (
    <div 
      onClick={() => onClick(fileSystem[id])} 
      className={`pl-6 py-0.5 text-xs text-slate-700 hover:bg-[#e5f3fb] cursor-pointer flex items-center gap-2 border border-transparent ${currentId === id ? 'bg-[#dceafc] font-medium border-dashed border-[#7da2ce] border-l-0 border-r-0 border-t-0 border-b-0' : ''}`}
    >
        <Icon size={14} className={color}/> {label}
    </div>
);

const SidebarItem = ({ id, level = 0, currentId, expandedFolders, onToggle, onNavigate }) => {
    const item = fileSystem[id];
    if (!item) return null;

    const hasChildren = item.children && item.children.some(childId => {
        const child = fileSystem[childId];
        return child && ['folder', 'drive', 'root'].includes(child.type);
    });
    
    const isExpanded = expandedFolders.includes(id);
    const isSelected = currentId === id;

    return (
        <div>
            <div 
              onClick={() => onNavigate(item)}
              className={`flex items-center gap-1 py-0.5 px-1 cursor-pointer select-none border border-transparent whitespace-nowrap group ${isSelected ? 'bg-[#dceafc] border-[#7da2ce]' : 'hover:bg-[#f0f5f9]'}`}
              style={{ paddingLeft: `${level * 12 + 4}px` }}
            >
                <div 
                  onClick={(e) => { e.stopPropagation(); if(hasChildren) onToggle(id); }} 
                  className={`w-4 h-4 flex items-center justify-center rounded z-10 ${hasChildren ? 'hover:bg-slate-200/50' : ''}`}
                >
                   {hasChildren ? (
                       isExpanded ? <ChevronDown size={10} className="text-slate-500"/> : <ChevronRight size={10} className="text-slate-500"/>
                   ) : <div className="w-4" />}
                </div>

                <div className="w-4 h-4 flex items-center justify-center">
                  {item.type === 'root' ? <Monitor size={14} className="text-slate-600" /> : 
                   item.type === 'drive' ? <HardDrive size={14} className="text-slate-600" /> :
                   <Folder size={14} className="text-yellow-500 fill-yellow-500" />}
                </div>

                <span className={`text-xs truncate ${isSelected ? 'text-black font-medium' : 'text-slate-700'}`}>{item.name}</span>
            </div>

            {isExpanded && hasChildren && (
                <div>
                    {item.children
                      .filter(childId => {
                          const child = fileSystem[childId];
                          return child && ['folder', 'drive', 'root'].includes(child.type);
                      })
                      .map(childId => (
                          <SidebarItem 
                              key={childId} 
                              id={childId} 
                              level={level + 1} 
                              currentId={currentId} 
                              expandedFolders={expandedFolders}
                              onToggle={onToggle}
                              onNavigate={onNavigate}
                          />
                      ))
                    }
                </div>
            )}
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export const FileExplorer = ({ initialPath = 'c_drive' }) => {
  const [currentId, setCurrentId] = useState(initialPath);
  const [history, setHistory] = useState([initialPath]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [expandedFolders, setExpandedFolders] = useState(['root', 'c_drive', 'users', 'paulo', 'musics']); // 'musics' adicionado para teste
  
  const { openWindow } = useOSStore();
  const currentFolder = fileSystem[currentId] || fileSystem['c_drive'];

  const handleOpen = (item) => {
      // 1. NAVEGAÇÃO (Pastas)
      if (['folder', 'root', 'drive'].includes(item.type)) {
          const newHistory = history.slice(0, historyIndex + 1);
          newHistory.push(item.id);
          setHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);
          setCurrentId(item.id);
          
          if (!expandedFolders.includes(item.id)) {
             setExpandedFolders(prev => [...prev, item.id]);
          }
          return;
      }
      
      // 2. ABRIR ARQUIVOS
      if (item.type === 'txt') {
          openWindow(`notepad-${item.id}`, item.name, <FileText size={16} className="text-blue-500"/>, <Notepad content={item.content} fileName={item.name} />);
      } else if (item.type === 'img') {
          openWindow(`img-${item.id}`, item.name, <ImageIcon size={16} className="text-yellow-500"/>, <ImageViewer src={item.src} fileName={item.name} />);
      } else if (item.type === 'pdf') {
          openWindow(`pdf-${item.id}`, item.name, <FileType size={16} className="text-red-500"/>, <PDFViewer src={item.src} />);
      } else if (item.type === 'exe') {
          alert("Programa simulado.");
      } else if (item.type === 'video') {
          alert("Player de vídeo simulado.");
      } 
      // 3. PLAYER DE MÚSICA (Corrigido)
      else if (item.type === 'mp3') {
          openWindow(
              `player-${item.id}`, 
              'Windows Media Player', 
              <div className="w-4 h-4 bg-orange-500 rounded-full border border-white flex items-center justify-center"><Play size={8} fill="white" color="white"/></div>, 
              <MusicPlayer src={item.src} title={item.title} artist={item.artist} />
          );
      }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentId(history[newIndex]);
    }
  };

  const handleUp = () => {
    if (currentFolder.parent) {
      handleOpen(fileSystem[currentFolder.parent]);
    }
  };

  const toggleExpand = (id) => {
      setExpandedFolders(prev => 
         prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      );
  };

  const getIcon = (item, size = 48) => {
    if (item.type === 'drive') return <HardDrive className="text-slate-500" size={size} />;
    if (item.type === 'folder' || item.type === 'root') return <Folder className="text-yellow-500 fill-yellow-500" size={size} />;
    if (item.type === 'img') return <div className="w-10 h-10 bg-white p-0.5 border shadow-sm"><img src={item.src} className="w-full h-full object-cover" alt=""/></div>;
    if (item.type === 'pdf') return <FileType className="text-red-500" size={size} />;
    if (item.type === 'exe') return <div className="w-10 h-10 bg-slate-200 border border-slate-400 rounded flex items-center justify-center font-bold text-xs">EXE</div>;
    if (item.type === 'video') return <Film className="text-purple-500" size={size} />;
    // ÍCONE DE ÁUDIO CORRIGIDO
    if (item.type === 'mp3') return (
        <div className="flex flex-col items-center justify-center w-12 h-12 bg-white border border-slate-300 shadow-sm group-hover:scale-105 transition-transform">
            <Music size={24} className="text-blue-500" />
            <span className="text-[8px] font-bold text-blue-500 mt-1">MP3</span>
        </div>
    );
    return <FileText className="text-slate-500" size={size} />;
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* TOPO */}
      <div className="bg-[#f0f5f9] border-b border-slate-300 p-2 flex items-center gap-2 flex-shrink-0">
          <button onClick={handleBack} disabled={historyIndex === 0} className="disabled:opacity-30 hover:bg-blue-100 p-1 rounded-full"><ArrowLeft size={16} color="#444" /></button>
          <button onClick={handleUp} disabled={!currentFolder.parent} className="disabled:opacity-30 hover:bg-blue-100 p-1 rounded-full"><ArrowUp size={16} color="#444" /></button>
          <div className="flex-1 bg-white border border-slate-300 rounded-[2px] px-2 py-1 text-sm flex items-center gap-2 shadow-inner h-7">
              <Monitor size={14} className="text-slate-500" />
              <ChevronRight size={12} className="text-slate-400" />
              <span className="text-slate-700 font-medium">{currentFolder.name}</span>
          </div>
      </div>

      {/* CORPO */}
      <div className="flex flex-1 overflow-hidden">
          
          {/* SIDEBAR */}
          <div className="w-[220px] bg-[#f1f5fb] border-r border-[#dae5f0] h-full overflow-y-auto pt-2 pb-4 flex-shrink-0">
              <div className="mb-2">
                  <div className="flex items-center gap-1 px-1 py-0.5 text-slate-500 cursor-default mb-1 group">
                      <Star size={12} className="text-yellow-500 fill-yellow-500 ml-1"/>
                      <span className="text-xs font-bold uppercase tracking-wide">Favoritos</span>
                  </div>
                  <FavoriteLink id="desktop_folder" icon={Monitor} label="Área de Trabalho" currentId={currentId} onClick={handleOpen} />
                  <FavoriteLink id="downloads" icon={Download} label="Downloads" currentId={currentId} onClick={handleOpen} />
                  <FavoriteLink id="docs" icon={FileText} label="Documentos" color="text-yellow-600" currentId={currentId} onClick={handleOpen} />
                  <FavoriteLink id="imgs" icon={ImageIcon} label="Imagens" color="text-yellow-600" currentId={currentId} onClick={handleOpen} />
                  <FavoriteLink id="musics" icon={Music} label="Músicas" color="text-blue-600" currentId={currentId} onClick={handleOpen} />
                  <FavoriteLink id="videos" icon={Film} label="Vídeos" color="text-purple-500" currentId={currentId} onClick={handleOpen} />
              </div>
              <div className="h-[1px] bg-slate-200 mx-2 my-2"></div>
              <div className="mt-1">
                  <SidebarItem 
                      id="root" 
                      currentId={currentId} 
                      expandedFolders={expandedFolders} 
                      onToggle={toggleExpand} 
                      onNavigate={handleOpen} 
                  />
              </div>
          </div>

          {/* GRID DE CONTEÚDO */}
          <div className="flex-1 bg-white p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {currentFolder.children && currentFolder.children.length > 0 ? (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 items-start">
                    {currentFolder.children.map(childId => {
                        const child = fileSystem[childId];
                        if (!child) return null;
                        return (
                            <div 
                                key={childId}
                                onDoubleClick={() => handleOpen(child)}
                                className={`flex flex-col items-center gap-1 p-2 border border-transparent rounded-[2px] cursor-pointer group transition-all ${
                                    currentId === childId ? 'bg-[#cce8ff] border-[#99d1ff]' : 'hover:bg-[#dceafc] hover:border-[#7da2ce]'
                                }`}
                                onClick={() => setCurrentId(childId)}
                            >
                                <div className="h-14 flex items-center justify-center transition-transform group-hover:scale-105">
                                    {getIcon(child)}
                                </div>
                                <span className="text-xs text-center text-slate-700 w-full truncate px-1 font-medium group-hover:text-black">
                                    {child.name}
                                </span>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                    <span className="text-sm">Esta pasta está vazia.</span>
                </div>
            )}
          </div>
      </div>

      {/* RODAPÉ */}
      <div className="bg-[#f0f5f9] border-t border-slate-300 px-4 h-8 flex items-center gap-4 text-xs text-slate-600 flex-shrink-0">
          <span>{currentFolder.children ? currentFolder.children.length : 0} itens</span>
          <span className="border-l border-slate-300 pl-4">Local: {currentFolder.name}</span>
      </div>
    </div>
  );
};