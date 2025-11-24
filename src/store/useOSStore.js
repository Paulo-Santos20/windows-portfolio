import { create } from 'zustand';

// DADOS INICIAIS DO SISTEMA DE ARQUIVOS
const initialFileSystem = {
  'root': { id: 'root', name: 'Computador', type: 'root', children: ['c_drive'] },
  'c_drive': { id: 'c_drive', name: 'Disco Local (C:)', type: 'drive', parent: 'root', children: ['users', 'program_files', 'windows'] },
  'program_files': { id: 'program_files', name: 'Arquivos de Programas', type: 'folder', parent: 'c_drive', children: [] },
  'windows': { id: 'windows', name: 'Windows', type: 'folder', parent: 'c_drive', children: ['system32'] },
  'system32': { id: 'system32', name: 'System32', type: 'folder', parent: 'windows', children: [] },
  'users': { id: 'users', name: 'Usuários', type: 'folder', parent: 'c_drive', children: ['paulo'] },
  'paulo': { id: 'paulo', name: 'Paulo', type: 'folder', parent: 'users', children: ['desktop_folder', 'downloads', 'docs', 'imgs', 'videos', 'musics'] },
  'desktop_folder': { id: 'desktop_folder', name: 'Área de Trabalho', type: 'folder', parent: 'paulo', children: ['shortcut_game'] },
  'downloads': { id: 'downloads', name: 'Downloads', type: 'folder', parent: 'paulo', children: [] },
  'docs': { id: 'docs', name: 'Documentos', type: 'folder', parent: 'paulo', children: ['cv', 'notes', 'techs'] },
  'imgs': { id: 'imgs', name: 'Imagens', type: 'folder', parent: 'paulo', children: ['perfil', 'wallpaper'] },
  'videos': { id: 'videos', name: 'Vídeos', type: 'folder', parent: 'paulo', children: ['video_demo'] },
  'musics': { id: 'musics', name: 'Músicas', type: 'folder', parent: 'paulo', children: ['song1'] },
  'cv': { id: 'cv', name: 'Curriculo.pdf', type: 'pdf', parent: 'docs', src: 'data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmoKICA8PCAvVHlwZSAvQ2F0YWxvZwogICAgIC9QYWdlcyAyIDAgUgogID4+CmVuZG9iagoKMiAwIG9iagogIDw8IC9UeXBlIC9QYWdlcwogICAgIC9LaWRzIFszIDAgUl0KICAgICAvQ291bnQgMQogICAgIC9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCiAgPj4KZW5kb2JqCgozIDAgb2JqCiAgPDwgIC9UeXBlIC9QYWdlCiAgICAgIC9QYXJlbnQgMiAwIFIKICAgICAgL1Jlc291cmNlcwogICAgICAgPDwgL0ZvbnQKICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgPDwgL1R5cGUgL0ZvbnQKICAgICAgICAgICAgICAgIC9TdWJ0eXBlIC9UeXBlMQogICAgICAgICAgICAgICAgL0Jhc2VGb250IC9IZWx2ZXRpY2EKICAgICAgICAgICAgID4+CiAgICAgICAgICA+PgogICAgICAgPj4KICAgICAgL0NvbnRlbnRzIDQgMCBSCiAgPj4KZW5kb2JqCgo0IDAgb2JqCiAgPDwgL0xlbmd0aCA1NQogID4+CnN0cmVhbQogIEJUKC9GMSAxMiBUZikgMTAwIDcwMCBUZCAoSGVsbG8hIEVzdGUgZSB1bSBQREYgZGUgVGVzdGUgbm8gc2V1IFBvcnRmb2xpbyBXaW5kb3dzIDcpIFRqIEVVCmVuZHN0cmVhbQplbmRvYmoKCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxMCAwMDAwMCBuIAowMDAwMDAwMDYwIDAwMDAwIG4gCjAwMDAwMDAxNTcgMDAwMDAgbiAKMDAwMDAwMDMwNiAwMDAwMCBuIAp0cmFpbGVyCiAgPDwgL1Jvb3QgMSAwIFIKICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjQxMQolJUVPRgo=' },
  'notes': { id: 'notes', name: 'Bem_Vindo.txt', type: 'txt', parent: 'docs', content: 'Bem vindo!' },
  'techs': { id: 'techs', name: 'Stack.txt', type: 'txt', parent: 'docs', content: 'React...' },
  'perfil': { id: 'perfil', name: 'Foto_Perfil.jpg', type: 'img', parent: 'imgs', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  'wallpaper': { id: 'wallpaper', name: 'Wallpaper.jpg', type: 'img', parent: 'imgs', src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
  'shortcut_game': { id: 'shortcut_game', name: 'Steam_Setup.exe', type: 'exe', parent: 'desktop_folder' },
  'song1': { id: 'song1', name: 'Dream_Scapes.mp3', type: 'mp3', parent: 'musics', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', title: 'Dream Scapes', artist: 'SoundHelix' },
  'video_demo': { id: 'video_demo', name: 'Nature_Sample.mp4', type: 'video', parent: 'videos', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
};

export const useOSStore = create((set, get) => ({
  // ... Estados existentes ...
  windows: [],
  activeWindowId: null,
  zIndexCounter: 100,
  bootStatus: 'booting',
  wallpaper: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  themeMode: 'aero',
  cursorType: 'default',
  
  // --- NOVO: SISTEMA DE ARQUIVOS GLOBAL ---
  fileSystem: initialFileSystem,
  
  // Ação: Criar Novo Arquivo/Pasta
  createItem: (parentId, type, nameBase) => set((state) => {
    const id = `new_${Date.now()}`;
    // Define ícone/conteúdo padrão baseado no tipo
    const newItem = {
        id,
        parent: parentId,
        type,
        name: `${nameBase}`,
        // Props específicas
        ...(type === 'txt' ? { content: '' } : {}),
        ...(type === 'folder' ? { children: [] } : {}),
    };

    // Atualiza pai para incluir o filho
    const parent = state.fileSystem[parentId];
    const newParent = { ...parent, children: [...parent.children, id] };

    return {
        fileSystem: {
            ...state.fileSystem,
            [parentId]: newParent,
            [id]: newItem
        }
    };
  }),

  // --- NOVO: ESTADO DE ATUALIZAÇÃO (REFRESH) ---
  refreshKey: 0,
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),

  // --- CONTEXT MENU ---
  contextMenu: { isOpen: false, x: 0, y: 0, type: null, targetId: null, contextId: null }, // contextId = ID da pasta onde clicou

  openContextMenu: (e, type, targetId = null, contextId = null) => {
    e.preventDefault();
    e.stopPropagation();
    set({ contextMenu: { isOpen: true, x: e.clientX, y: e.clientY, type, targetId, contextId } });
  },

  closeContextMenu: () => set((state) => ({
    contextMenu: { ...state.contextMenu, isOpen: false }
  })),

  // ... (Mantenha as outras funções: setBootStatus, setWallpaper, openWindow, etc.)
  setBootStatus: (status) => set({ bootStatus: status }),
  setWallpaper: (url) => set({ wallpaper: url }),
  setThemeMode: (mode) => set({ themeMode: mode }),
  setCursorType: (type) => set({ cursorType: type }),
  
  openWindow: (id, title, icon, component, initialPath = '/') => set((state) => {
    const existingWindow = state.windows.find((w) => w.id === id);
    const newZIndex = state.zIndexCounter + 1;
    if (existingWindow) {
      return {
        activeWindowId: id,
        zIndexCounter: newZIndex,
        windows: state.windows.map((w) => w.id === id ? { ...w, isMinimized: false, zIndex: newZIndex } : w),
      };
    }
    return {
      activeWindowId: id,
      zIndexCounter: newZIndex,
      windows: [...state.windows, { id, title, icon, component, initialPath, isOpen: true, isMinimized: false, isMaximized: false, zIndex: newZIndex }],
    };
  }),
  closeWindow: (id) => set((state) => ({
    windows: state.windows.filter((w) => w.id !== id),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
  })),
  minimizeWindow: (id) => set((state) => ({
    activeWindowId: null,
    windows: state.windows.map((w) => w.id === id ? { ...w, isMinimized: true } : w)
  })),
  toggleMaximize: (id) => set((state) => ({
    activeWindowId: id,
    windows: state.windows.map((w) => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)
  })),
  focusWindow: (id) => set((state) => {
    const newZIndex = state.zIndexCounter + 1;
    return { activeWindowId: id, zIndexCounter: newZIndex, windows: state.windows.map((w) => w.id === id ? { ...w, zIndex: newZIndex } : w) };
  }),
  restoreWindow: (id) => set((state) => {
    const newZIndex = state.zIndexCounter + 1;
    return { activeWindowId: id, zIndexCounter: newZIndex, windows: state.windows.map((w) => w.id === id ? { ...w, isMinimized: false, zIndex: newZIndex } : w) };
  }),
}));