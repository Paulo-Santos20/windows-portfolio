import { create } from 'zustand';
import localWallpaper from '../assets/wallpaper.webp';

// URL do wallpaper online (com fallback automÃ¡tico)
export const WALLPAPER_URL = 'https://web.archive.org/web/20230607062923if_/https://upload.wikimedia.org/wikipedia/pt/2/2d/Bliss_%28Windows_XP%29.png';

// Fallback: usa o wallpaper local se a URL online falhar
const loadWallpaper = () => {
  if (localStorage.getItem('wallpaper')) return;
  const img = new Image();
  img.onload = () => useOSStore.setState({ wallpaper: WALLPAPER_URL });
  img.onerror = () => useOSStore.setState({ wallpaper: localWallpaper });
  img.src = WALLPAPER_URL;
};

// Iniciar carga do wallpaper
loadWallpaper();

const initialFileSystem = {
  // RAIZ E DRIVES
  'root': { id: 'root', name: 'Computador', type: 'root', children: ['c_drive'] },
  'c_drive': { id: 'c_drive', name: 'Disco Local (C:)', type: 'drive', parent: 'root', children: ['users', 'program_files', 'windows'] },
  
  // PASTAS DO SISTEMA
  'program_files': { id: 'program_files', name: 'Arquivos de Programas', type: 'folder', parent: 'c_drive', children: [] },
  'windows': { id: 'windows', name: 'Windows', type: 'folder', parent: 'c_drive', children: ['system32'] },
  'system32': { id: 'system32', name: 'System32', type: 'folder', parent: 'windows', children: [] },
  
  // USUÃRIOS
  'users': { id: 'users', name: 'UsuÃ¡rios', type: 'folder', parent: 'c_drive', children: ['paulo'] },
  'paulo': { id: 'paulo', name: 'Paulo', type: 'folder', parent: 'users', children: ['desktop_folder', 'downloads', 'docs', 'imgs', 'videos', 'musics'] },

  // ÃREA DE TRABALHO (Com atalhos para Apps)
  'desktop_folder': { 
      id: 'desktop_folder', 
      name: 'Ãrea de Trabalho', 
      type: 'folder', 
      parent: 'paulo', 
      children: ['calc', 'cmd', 'paint'] // Adicionados Calc, CMD e Paint
  }, 
  
  'downloads': { id: 'downloads', name: 'Downloads', type: 'folder', parent: 'paulo', children: [] },
  'docs': { id: 'docs', name: 'Documentos', type: 'folder', parent: 'paulo', children: ['cv', 'notes', 'techs'] },
  'imgs': { id: 'imgs', name: 'Imagens', type: 'folder', parent: 'paulo', children: ['perfil', 'wallpaper'] },
  'videos': { id: 'videos', name: 'VÃ­deos', type: 'folder', parent: 'paulo', children: ['video_demo'] },
  'musics': { id: 'musics', name: 'MÃºsicas', type: 'folder', parent: 'paulo', children: ['song1'] },

  // --- ARQUIVOS E APPS ---
  'cv': { id: 'cv', name: 'Meu Currículo', type: 'pdf', parent: 'docs', src: 'data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmoKICA8PCAvVHlwZSAvQ2F0YWxvZwogICAgIC9QYWdlcyAyIDAgUgogID4+CmVuZG9iagoKMiAwIG9iagogIDw8IC9UeXBlIC9QYWdlcwogICAgIC9LaWRzIFszIDAgUl0KICAgICAvQ291bnQgMQogICAgIC9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCiAgPj4KZW5kb2JqCgozIDAgb2JqCiAgPDwgIC9UeXBlIC9QYWdlCiAgICAgIC9QYXJlbnQgMiAwIFIKICAgICAgL1Jlc291cmNlcwogICAgICAgPDwgL0ZvbnQKICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgPDwgL1R5cGUgL0ZvbnQKICAgICAgICAgICAgICAgIC9TdWJ0eXBlIC9UeXBlMQogICAgICAgICAgICAgICAgL0Jhc2VGb250IC9IZWx2ZXRpY2EKICAgICAgICAgICAgID4+CiAgICAgICAgICA+PgogICAgICAgPj4KICAgICAgL0NvbnRlbnRzIDQgMCBSCiAgPj4KZW5kb2JqCgo0IDAgb2JqCiAgPDwgL0xlbmd0aCA1NQogID4+CnN0cmVhbQogIEJUKC9GMSAxMiBUZikgMTAwIDcwMCBUZCAoSGVsbG8hIEVzdGUgZSB1bSBQREYgZGUgVGVzdGUgbm8gc2V1IFBvcnRmb2xpbyBXaW5kb3dzIDcpIFRqIEVVCmVuZHN0cmVhbQplbmRvYmoKCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxMCAwMDAwMCBuIAowMDAwMDAwMDYwIDAwMDAwIG4gCjAwMDAwMDAxNTcgMDAwMDAgbiAKMDAwMDAwMDMwNiAwMDAwMCBuIAp0cmFpbGVyCiAgPDwgL1Jvb3QgMSAwIFIKICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjQxMQolJUVPRgo=' },
  
  // Apps do Sistema
  'about': { id: 'about', name: 'Sobre Mim', type: 'app' },
  'browser': { id: 'browser', name: 'Internet Explorer', type: 'app' },
  'wmp': { id: 'wmp', name: 'Media Player', type: 'app' },
  'video_demo': { id: 'video_demo', name: 'VÃ­deo Demo', type: 'video', parent: 'videos', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  'games_folder': { id: 'games_folder', name: 'Jogos', type: 'folder' },
  'settings': { id: 'settings', name: 'Personalizar', type: 'app' },
  'my_projects': { id: 'my_projects', name: 'Meus Projetos', type: 'app' },
  
  // Apps Adicionais
  'calc': { id: 'calc', name: 'Calculadora', type: 'app' },
  'cmd': { id: 'cmd', name: 'Prompt de Comando', type: 'app' },
  'paint': { id: 'paint', name: 'Paint', type: 'app' }, // NOVO

  // Arquivos de Exemplo
  'notes': { id: 'notes', name: 'Bem_Vindo.txt', type: 'txt', parent: 'docs', content: 'Bem vindo ao meu portfÃ³lio!' },
  'techs': { id: 'techs', name: 'Stack.txt', type: 'txt', parent: 'docs', content: 'React, Tailwind, Zustand.' },
  'perfil': { id: 'perfil', name: 'Foto_Perfil.jpg', type: 'img', parent: 'imgs', src: '' },
  'wallpaper': { id: 'wallpaper', name: 'wallpaper.jpg', type: 'img', parent: 'imgs', src: '' },
  'shortcut_game': { id: 'shortcut_game', name: 'Steam_Setup.exe', type: 'exe', parent: 'desktop_folder' },
  'song1': { id: 'song1', name: 'Dream_Scapes.mp3', type: 'mp3', parent: 'musics', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', title: 'Dream Scapes', artist: 'SoundHelix' },
};

export const useOSStore = create((set) => ({
  // --- DISPLAY & TEMA ---
  displaySettings: { scale: 0.85, fontSize: 'normal' },
  setDisplaySettings: (newSettings) => set((state) => ({ displaySettings: { ...state.displaySettings, ...newSettings } })),
  wallpaper: localStorage.getItem('wallpaper') || localWallpaper,
  themeMode: 'xp',
  theme: (localStorage.getItem('theme') || 'winxp'),
  breakpoint: 'desktop',
  setWallpaper: (url) => { localStorage.setItem('wallpaper', url); set({ wallpaper: url }); },
  setThemeMode: (mode) => set({ themeMode: mode }),
  setTheme: (theme) => { localStorage.setItem('theme', theme); set({ theme }); },
  setBreakpoint: (bp) => set({ breakpoint: bp }),

  // --- WINDOWS & BOOT ---
  windows: [],
  activeWindowId: null,
  zIndexCounter: 100,
  bootStatus: 'booting',
  cursorType: 'default',
  lastShakenWindow: null,
  shakeRestoreQueue: [],
  setBootStatus: (status) => set({ bootStatus: status }),
  setCursorType: (type) => set({ cursorType: type }),

  // --- USUÃRIO & ÃUDIO ---
  currentUser: { name: 'Convidado', avatar: '' },
  globalVolume: parseFloat(localStorage.getItem('globalVolume')) || 0.5,
  msgNickname: localStorage.getItem('msgNickname') || '',
  setMsgNickname: (name) => { localStorage.setItem('msgNickname', name); set({ msgNickname: name }); },
  msgStatus: localStorage.getItem('msgStatus') || 'online',
  setMsgStatus: (s) => { localStorage.setItem('msgStatus', s); set({ msgStatus: s }); },
  msgPersonalMessage: localStorage.getItem('msgPersonalMessage') || '',
  setMsgPersonalMessage: (m) => { localStorage.setItem('msgPersonalMessage', m); set({ msgPersonalMessage: m }); },
  msgSoundEnabled: localStorage.getItem('msgSoundEnabled') !== 'false',
  setMsgSoundEnabled: (v) => { localStorage.setItem('msgSoundEnabled', v); set({ msgSoundEnabled: v }); },
  setGlobalVolume: (vol) => { localStorage.setItem('globalVolume', vol); set({ globalVolume: vol }); },
  setCurrentUser: (name, avatar) => set({ currentUser: { name, avatar } }),

  // --- SISTEMA DE ARQUIVOS (CRUD) ---
  fileSystem: initialFileSystem,
  refreshKey: 0, // Gatilho de atualizaÃ§Ã£o visual
  
  createItem: (parentId, type, nameBase) => set((state) => { 
      const id = `new_${Date.now()}`; 
      const newItem = { id, parent: parentId, type, name: `${nameBase} ${Math.floor(Math.random() * 100)}`, ...(type === 'txt' ? { content: '' } : {}), ...(type === 'folder' ? { children: [] } : {}) }; 
      const parent = state.fileSystem[parentId]; 
      const newParent = { ...parent, children: [...parent.children, id] }; 
      return { refreshKey: state.refreshKey + 1, fileSystem: { ...state.fileSystem, [parentId]: newParent, [id]: newItem } }; 
  }),
  
  updateFileContent: (id, newContent) => set((state) => ({ fileSystem: { ...state.fileSystem, [id]: { ...state.fileSystem[id], content: newContent } } })),
  
  renamingId: null,
  setRenamingId: (id) => set({ renamingId: id }),
  renameItem: (id, newName) => set((state) => { 
      if (!newName.trim() || !state.fileSystem[id]) return { renamingId: null }; 
      return { renamingId: null, fileSystem: { ...state.fileSystem, [id]: { ...state.fileSystem[id], name: newName } } }; 
  }),

  // --- SELEÃ‡ÃƒO E ORDENAÃ‡ÃƒO ---
  selectedItemId: null,
  selectItem: (id) => set({ selectedItemId: id }),
  desktopSort: 'name',
  setDesktopSort: (sortType) => set({ desktopSort: sortType }),
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),

  openWindow: (id, title, icon, component, initialPath = '/', options = {}) => set((state) => {
    const existingWindow = state.windows.find((w) => w.id === id);
    const newZIndex = state.zIndexCounter + 1;
    
    if (existingWindow) {
      return { activeWindowId: id, zIndexCounter: newZIndex, windows: state.windows.map((w) => w.id === id ? { ...w, isMinimized: false, zIndex: newZIndex } : w) };
    }

    // -- CONFIGURAÃ‡Ã•ES ESPECÃFICAS DE CADA APP --
    let winWidth = options.isSkin ? 600 : 800;
    let winHeight = options.isSkin ? 400 : 600;
    let hasMenuBar = true;
    let resizable = true;

    // Calculadora (Tamanho Fixo)
    if (id === 'calc') { winWidth = 236; winHeight = 258; hasMenuBar = false; resizable = false; }
    
    // CMD (Fixo)
    if (id === 'cmd') { winWidth = 600; winHeight = 350; hasMenuBar = false; resizable = false; }
    
    // Paint (RedimensionÃ¡vel)
    if (id === 'paint') { winWidth = 800; winHeight = 600; hasMenuBar = false; resizable = true; } 
    
    // Media Player (RedimensionÃ¡vel) -> AQUI O AJUSTE
    if (id === 'wmp') { winWidth = 700; winHeight = 500; hasMenuBar = false; resizable = true; }

    // MSG Main (lista de contatos)
    if (id === 'msg-main') { winWidth = 310; winHeight = 500; hasMenuBar = false; resizable = true; }

    // MSG Conversation
    if (id === 'msg-conversation') { winWidth = 500; winHeight = 420; hasMenuBar = false; resizable = true; }

    return {
      activeWindowId: id,
      zIndexCounter: newZIndex,
      windows: [
        ...state.windows,
        { 
            id, title, icon, component, initialPath, 
            isOpen: true, isMinimized: false, isMaximized: false, zIndex: newZIndex, 
            isSkin: options.isSkin || false,
            initialWidth: winWidth,
            initialHeight: winHeight,
            hasMenuBar: hasMenuBar,
            resizable: resizable
        }
      ],
    };
  }),
  
  closeWindow: (id) => set((state) => ({ windows: state.windows.filter((w) => w.id !== id), activeWindowId: state.activeWindowId === id ? null : state.activeWindowId })),
  minimizeWindow: (id) => set((state) => ({ 
    activeWindowId: null, 
    windows: state.windows.map((w) => w.id === id ? { ...w, isMinimized: true } : w) 
  })),
  toggleMaximize: (id) => set((state) => ({ 
    activeWindowId: id, 
    windows: state.windows.map((w) => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w) 
  })),
  focusWindow: (id) => set((state) => { const newZIndex = state.zIndexCounter + 1; return { activeWindowId: id, zIndexCounter: newZIndex, windows: state.windows.map((w) => w.id === id ? { ...w, isMinimized: false, zIndex: newZIndex } : w) }; }),
  restoreWindow: (id) => set((state) => { const newZIndex = state.zIndexCounter + 1; return { activeWindowId: id, zIndexCounter: newZIndex, windows: state.windows.map((w) => w.id === id ? { ...w, isMinimized: false, zIndex: newZIndex } : w) }; }),
  clearWindows: () => set({ windows: [], activeWindowId: null }),
  minimizeOthers: (exceptId) => set((state) => ({ windows: state.windows.map((w) => w.id !== exceptId ? { ...w, isMinimized: true } : w) })),
  handleShake: (id) => set((state) => {
    if (state.lastShakenWindow === id) {
      const restoreIds = state.shakeRestoreQueue;
      return {
        lastShakenWindow: null,
        shakeRestoreQueue: [],
        windows: state.windows.map((w) => restoreIds.includes(w.id) ? { ...w, isMinimized: false } : w),
      };
    }
    const openIds = state.windows.filter((w) => w.id !== id && !w.isMinimized).map((w) => w.id);
    return {
      lastShakenWindow: id,
      shakeRestoreQueue: openIds,
      windows: state.windows.map((w) => w.id !== id ? { ...w, isMinimized: true } : w),
    };
  }),
  
  // --- MENU DE CONTEXTO ---
  contextMenu: { isOpen: false, x: 0, y: 0, type: null, targetId: null, contextId: null },
  openContextMenu: (e, type, targetId = null, contextId = null) => { e.preventDefault(); e.stopPropagation(); set({ contextMenu: { isOpen: true, x: e.clientX, y: e.clientY, type, targetId, contextId } }); },
  closeContextMenu: () => set((state) => ({ contextMenu: { ...state.contextMenu, isOpen: false } })),
}));
