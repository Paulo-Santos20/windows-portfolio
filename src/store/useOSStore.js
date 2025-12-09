import { create } from 'zustand';
import bugWallpaper from '../assets/Wallpaper.webp';

export const BLISS_URL = 'https://web.archive.org/web/20230607062923if_/https://upload.wikimedia.org/wikipedia/pt/2/2d/Bliss_%28Windows_XP%29.png';

const initialFileSystem = {
  // ... (MANTENHA TODO O CONTEÚDO DO INITIALFILESYSTEM IGUAL) ...
  // Vou abreviar aqui para focar na mudança da função openWindow, mas mantenha suas pastas e arquivos!
  'root': { id: 'root', name: 'Computador', type: 'root', children: ['c_drive'] },
  'c_drive': { id: 'c_drive', name: 'Disco Local (C:)', type: 'drive', parent: 'root', children: ['users', 'program_files', 'windows'] },
  'program_files': { id: 'program_files', name: 'Arquivos de Programas', type: 'folder', parent: 'c_drive', children: [] },
  'windows': { id: 'windows', name: 'Windows', type: 'folder', parent: 'c_drive', children: ['system32'] },
  'system32': { id: 'system32', name: 'System32', type: 'folder', parent: 'windows', children: [] },
  'users': { id: 'users', name: 'Usuários', type: 'folder', parent: 'c_drive', children: ['paulo'] },
  'paulo': { id: 'paulo', name: 'Paulo', type: 'folder', parent: 'users', children: ['desktop_folder', 'downloads', 'docs', 'imgs', 'videos', 'musics'] },
  'desktop_folder': { id: 'desktop_folder', name: 'Área de Trabalho', type: 'folder', parent: 'paulo', children: ['calc', 'cmd'] },
  'downloads': { id: 'downloads', name: 'Downloads', type: 'folder', parent: 'paulo', children: [] },
  'docs': { id: 'docs', name: 'Documentos', type: 'folder', parent: 'paulo', children: ['cv', 'notes', 'techs'] },
  'imgs': { id: 'imgs', name: 'Imagens', type: 'folder', parent: 'paulo', children: ['perfil', 'wallpaper'] },
  'videos': { id: 'videos', name: 'Vídeos', type: 'folder', parent: 'paulo', children: ['video_demo'] },
  'musics': { id: 'musics', name: 'Músicas', type: 'folder', parent: 'paulo', children: ['song1'] },
  'cv': { id: 'cv', name: 'Meu Currículo', type: 'pdf', parent: 'docs', src: 'data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmoKICA8PCAvVHlwZSAvQ2F0YWxvZwogICAgIC9QYWdlcyAyIDAgUgogID4+CmVuZG9iagoKMiAwIG9iagogIDw8IC9UeXBlIC9QYWdlcwogICAgIC9LaWRzIFszIDAgUl0KICAgICAvQ291bnQgMQogICAgIC9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCiAgPj4KZW5kb2JqCgozIDAgb2JqCiAgPDwgIC9UeXBlIC9QYWdlCiAgICAgIC9QYXJlbnQgMiAwIFIKICAgICAgL1Jlc291cmNlcwogICAgICAgPDwgL0ZvbnQKICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgPDwgL1R5cGUgL0ZvbnQKICAgICAgICAgICAgICAgIC9TdWJ0eXBlIC9UeXBlMQogICAgICAgICAgICAgICAgL0Jhc2VGb250IC9IZWx2ZXRpY2EKICAgICAgICAgICAgID4+CiAgICAgICAgICA+PgogICAgICAgPj4KICAgICAgL0NvbnRlbnRzIDQgMCBSCiAgPj4KZW5kb2JqCgo0IDAgb2JqCiAgPDwgL0xlbmd0aCA1NQogID4+CnN0cmVhbQogIEJUKC9GMSAxMiBUZikgMTAwIDcwMCBUZCAoSGVsbG8hIEVzdGUgZSB1bSBQREYgZGUgVGVzdGUgbm8gc2V1IFBvcnRmb2xpbyBXaW5kb3dzIDcpIFRqIEVVCmVuZHN0cmVhbQplbmRvYmoKCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxMCAwMDAwMCBuIAowMDAwMDAwMDYwIDAwMDAwIG4gCjAwMDAwMDAxNTcgMDAwMDAgbiAKMDAwMDAwMDMwNiAwMDAwMCBuIAp0cmFpbGVyCiAgPDwgL1Jvb3QgMSAwIFIKICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjQxMQolJUVPRgo=' },
  'about': { id: 'about', name: 'Sobre Mim', type: 'app' },
  'browser': { id: 'browser', name: 'Internet Explorer', type: 'app' },
  'wmp': { id: 'wmp', name: 'Media Player', type: 'app' },
  'video_demo': { id: 'video_demo', name: 'Vídeo Demo', type: 'video', parent: 'videos', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  'games_folder': { id: 'games_folder', name: 'Jogos', type: 'folder' },
  'settings': { id: 'settings', name: 'Personalizar', type: 'app' },
  'my_projects': { id: 'my_projects', name: 'Meus Projetos', type: 'app' },
  'calc': { id: 'calc', name: 'Calculadora', type: 'app' },
  'cmd': { id: 'cmd', name: 'Prompt de Comando', type: 'app' },
  'notes': { id: 'notes', name: 'Bem_Vindo.txt', type: 'txt', parent: 'docs', content: 'Bem vindo ao meu portfólio!' },
  'techs': { id: 'techs', name: 'Stack.txt', type: 'txt', parent: 'docs', content: 'React, Tailwind, Zustand.' },
  'perfil': { id: 'perfil', name: 'Foto_Perfil.jpg', type: 'img', parent: 'imgs', src: '' },
  'wallpaper': { id: 'wallpaper', name: 'Wallpaper.jpg', type: 'img', parent: 'imgs', src: '' },
  'shortcut_game': { id: 'shortcut_game', name: 'Steam_Setup.exe', type: 'exe', parent: 'desktop_folder' },
  'song1': { id: 'song1', name: 'Dream_Scapes.mp3', type: 'mp3', parent: 'musics', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', title: 'Dream Scapes', artist: 'SoundHelix' },
};

export const useOSStore = create((set, get) => ({
  displaySettings: { scale: 0.85, fontSize: 'normal' },
  setDisplaySettings: (newSettings) => set((state) => ({ displaySettings: { ...state.displaySettings, ...newSettings } })),
  wallpaper: bugWallpaper, 
  themeMode: 'xp',
  windows: [],
  activeWindowId: null,
  zIndexCounter: 100,
  bootStatus: 'booting',
  cursorType: 'default',
  setCursorType: (type) => set({ cursorType: type }),
  currentUser: { name: 'Convidado', avatar: '' },
  globalVolume: 0.5,
  setGlobalVolume: (vol) => set({ globalVolume: vol }),
  setCurrentUser: (name, avatar) => set({ currentUser: { name, avatar } }),
  fileSystem: initialFileSystem,
  refreshKey: 0,
  
  createItem: (parentId, type, nameBase) => set((state) => { const id = `new_${Date.now()}`; const newItem = { id, parent: parentId, type, name: `${nameBase} ${Math.floor(Math.random() * 100)}`, ...(type === 'txt' ? { content: '' } : {}), ...(type === 'folder' ? { children: [] } : {}) }; const parent = state.fileSystem[parentId]; const newParent = { ...parent, children: [...parent.children, id] }; return { refreshKey: state.refreshKey + 1, fileSystem: { ...state.fileSystem, [parentId]: newParent, [id]: newItem } }; }),
  updateFileContent: (id, newContent) => set((state) => ({ fileSystem: { ...state.fileSystem, [id]: { ...state.fileSystem[id], content: newContent } } })),
  renamingId: null,
  setRenamingId: (id) => set({ renamingId: id }),
  renameItem: (id, newName) => set((state) => { if (!newName.trim() || !state.fileSystem[id]) return { renamingId: null }; return { renamingId: null, fileSystem: { ...state.fileSystem, [id]: { ...state.fileSystem[id], name: newName } } }; }),
  desktopSort: 'name',
  setDesktopSort: (sortType) => set({ desktopSort: sortType }),
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
  
  // --- OPEN WINDOW ATUALIZADO ---
  openWindow: (id, title, icon, component, initialPath = '/', options = {}) => set((state) => {
    const existingWindow = state.windows.find((w) => w.id === id);
    const newZIndex = state.zIndexCounter + 1;
    
    if (existingWindow) {
      return { activeWindowId: id, zIndexCounter: newZIndex, windows: state.windows.map((w) => w.id === id ? { ...w, isMinimized: false, zIndex: newZIndex } : w) };
    }

    // DEFINIÇÕES ESPECÍFICAS DE TAMANHO POR APP
    let winWidth = options.isSkin ? 600 : 800;
    let winHeight = options.isSkin ? 400 : 600;
    let hasMenuBar = true; // Por padrão tem menu (File, Edit...)
    let resizable = true;

    // Ajuste Fino para Calculadora
    if (id === 'calc') {
        winWidth = 242;  // Largura exata da calc + bordas
        winHeight = 276; // Altura exata
        hasMenuBar = false; // Calculadora tem menu próprio interno, remove o do Frame
        resizable = false; // Calculadora do XP não redimensiona
    }

    if (id === 'cmd') { winWidth = 600; winHeight = 350; hasMenuBar = false; }

    return {
      activeWindowId: id,
      zIndexCounter: newZIndex,
      windows: [
        ...state.windows,
        { 
            id, title, icon, component, initialPath, 
            isOpen: true, isMinimized: false, isMaximized: false, zIndex: newZIndex, 
            isSkin: options.isSkin || false,
            // NOVAS PROPS
            initialWidth: winWidth,
            initialHeight: winHeight,
            hasMenuBar: hasMenuBar,
            resizable: resizable
        }
      ],
    };
  }),
  
  closeWindow: (id) => set((state) => ({ windows: state.windows.filter((w) => w.id !== id), activeWindowId: state.activeWindowId === id ? null : state.activeWindowId })),
  minimizeWindow: (id) => set((state) => ({ activeWindowId: null, windows: state.windows.map((w) => w.id === id ? { ...w, isMinimized: true } : w) })),
  toggleMaximize: (id) => set((state) => ({ activeWindowId: id, windows: state.windows.map((w) => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w) })),
  focusWindow: (id) => set((state) => { const newZIndex = state.zIndexCounter + 1; return { activeWindowId: id, zIndexCounter: newZIndex, windows: state.windows.map((w) => w.id === id ? { ...w, zIndex: newZIndex } : w) }; }),
  restoreWindow: (id) => set((state) => { const newZIndex = state.zIndexCounter + 1; return { activeWindowId: id, zIndexCounter: newZIndex, windows: state.windows.map((w) => w.id === id ? { ...w, isMinimized: false, zIndex: newZIndex } : w) }; }),
  contextMenu: { isOpen: false, x: 0, y: 0, type: null, targetId: null, contextId: null },
  openContextMenu: (e, type, targetId = null, contextId = null) => { e.preventDefault(); e.stopPropagation(); set({ contextMenu: { isOpen: true, x: e.clientX, y: e.clientY, type, targetId, contextId } }); },
  closeContextMenu: () => set((state) => ({ contextMenu: { ...state.contextMenu, isOpen: false } })),
  setBootStatus: (status) => set({ bootStatus: status }),
  setWallpaper: (url) => set({ wallpaper: url }),
  setThemeMode: (mode) => set({ themeMode: mode }),
}));