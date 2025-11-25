import { create } from 'zustand';

// --- SISTEMA DE ARQUIVOS INICIAL (AGORA COM ÍCONES DO SISTEMA) ---
const initialFileSystem = {
  // Raiz
  'root': { id: 'root', name: 'Computador', type: 'root', children: ['c_drive'] },
  'c_drive': { id: 'c_drive', name: 'Disco Local (C:)', type: 'drive', parent: 'root', children: ['users', 'program_files', 'windows'] },
  'program_files': { id: 'program_files', name: 'Arquivos de Programas', type: 'folder', parent: 'c_drive', children: [] },
  'windows': { id: 'windows', name: 'Windows', type: 'folder', parent: 'c_drive', children: ['system32'] },
  'system32': { id: 'system32', name: 'System32', type: 'folder', parent: 'windows', children: [] },
  'users': { id: 'users', name: 'Usuários', type: 'folder', parent: 'c_drive', children: ['paulo'] },
  
  // Usuário Paulo
  'paulo': { id: 'paulo', name: 'Paulo', type: 'folder', parent: 'users', children: ['desktop_folder', 'downloads', 'docs', 'imgs', 'videos', 'musics'] },

  // --- ÁREA DE TRABALHO (AGORA CONTÉM TUDO) ---
  'desktop_folder': { 
      id: 'desktop_folder', 
      name: 'Área de Trabalho', 
      type: 'folder', 
      parent: 'paulo', 
      // A ordem aqui define a ordem inicial. Adicionei os IDs do sistema aqui.
      children: ['my_computer', 'my_docs', 'recycle_bin', 'internet_explorer', 'control_panel', 'shortcut_game'] 
  },

  // ITENS DO SISTEMA (AGORA SÃO OBJETOS EDITÁVEIS)
  'my_computer': { id: 'my_computer', name: 'Meu Computador', type: 'sys_computer', parent: 'desktop_folder' },
  'my_docs': { id: 'my_docs', name: 'Meus Documentos', type: 'sys_docs', parent: 'desktop_folder' },
  'recycle_bin': { id: 'recycle_bin', name: 'Lixeira', type: 'sys_trash', parent: 'desktop_folder' },
  'internet_explorer': { id: 'internet_explorer', name: 'Internet Explorer', type: 'sys_browser', parent: 'desktop_folder' },
  'control_panel': { id: 'control_panel', name: 'Personalizar', type: 'sys_settings', parent: 'desktop_folder' },

  // Pastas Pessoais
  'downloads': { id: 'downloads', name: 'Downloads', type: 'folder', parent: 'paulo', children: [] },
  'docs': { id: 'docs', name: 'Documentos', type: 'folder', parent: 'paulo', children: ['cv', 'notes', 'techs'] },
  'imgs': { id: 'imgs', name: 'Imagens', type: 'folder', parent: 'paulo', children: ['perfil', 'wallpaper'] },
  'videos': { id: 'videos', name: 'Vídeos', type: 'folder', parent: 'paulo', children: ['video_demo'] },
  'musics': { id: 'musics', name: 'Músicas', type: 'folder', parent: 'paulo', children: ['song1'] },

  // Arquivos
  'cv': { id: 'cv', name: 'Curriculo.pdf', type: 'pdf', parent: 'docs', src: 'data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmoKICA8PCAvVHlwZSAvQ2F0YWxvZwogICAgIC9QYWdlcyAyIDAgUgogID4+CmVuZG9iagoKMiAwIG9iagogIDw8IC9UeXBlIC9QYWdlcwogICAgIC9LaWRzIFszIDAgUl0KICAgICAvQ291bnQgMQogICAgIC9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCiAgPj4KZW5kb2JqCgozIDAgb2JqCiAgPDwgIC9UeXBlIC9QYWdlCiAgICAgIC9QYXJlbnQgMiAwIFIKICAgICAgL1Jlc291cmNlcwogICAgICAgPDwgL0ZvbnQKICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgPDwgL1R5cGUgL0ZvbnQKICAgICAgICAgICAgICAgIC9TdWJ0eXBlIC9UeXBlMQogICAgICAgICAgICAgICAgL0Jhc2VGb250IC9IZWx2ZXRpY2EKICAgICAgICAgICAgID4+CiAgICAgICAgICA+PgogICAgICAgPj4KICAgICAgL0NvbnRlbnRzIDQgMCBSCiAgPj4KZW5kb2JqCgo0IDAgb2JqCiAgPDwgL0xlbmd0aCA1NQogID4+CnN0cmVhbQogIEJUKC9GMSAxMiBUZikgMTAwIDcwMCBUZCAoSGVsbG8hIEVzdGUgZSB1bSBQREYgZGUgVGVzdGUgbm8gc2V1IFBvcnRmb2xpbyBXaW5kb3dzIDcpIFRqIEVVCmVuZHN0cmVhbQplbmRvYmoKCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxMCAwMDAwMCBuIAowMDAwMDAwMDYwIDAwMDAwIG4gCjAwMDAwMDAxNTcgMDAwMDAgbiAKMDAwMDAwMDMwNiAwMDAwMCBuIAp0cmFpbGVyCiAgPDwgL1Jvb3QgMSAwIFIKICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjQxMQolJUVPRgo=' },
  'notes': { id: 'notes', name: 'Bem_Vindo.txt', type: 'txt', parent: 'docs', content: 'Bem vindo ao meu portfólio estilo Windows 7!' },
  'techs': { id: 'techs', name: 'Stack.txt', type: 'txt', parent: 'docs', content: 'React, Tailwind, Zustand.' },
  'perfil': { id: 'perfil', name: 'Foto_Perfil.jpg', type: 'img', parent: 'imgs', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  'wallpaper': { id: 'wallpaper', name: 'Wallpaper.jpg', type: 'img', parent: 'imgs', src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
  'video_demo': { id: 'video_demo', name: 'Nature_Sample.mp4', type: 'video', parent: 'videos', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  'shortcut_game': { id: 'shortcut_game', name: 'Steam_Setup.exe', type: 'exe', parent: 'desktop_folder' },
  'song1': { id: 'song1', name: 'Dream_Scapes.mp3', type: 'mp3', parent: 'musics', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', title: 'Dream Scapes', artist: 'SoundHelix' },
};

export const useOSStore = create((set) => ({
  // Estados Visuais
  windows: [],
  activeWindowId: null,
  zIndexCounter: 100,
  bootStatus: 'booting',
  wallpaper: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  themeMode: 'aero',
  cursorType: 'default',
  refreshKey: 0,
  
  // --- NOVO: CONFIGURAÇÕES DE VISUALIZAÇÃO ---
  desktopSort: 'none', // 'name', 'size', 'type', 'date'
  iconSize: 'medium', // 'small', 'medium', 'large'
  setDesktopSort: (sort) => set({ desktopSort: sort }),
  setIconSize: (size) => set({ iconSize: size }),

  // Sistema de Arquivos
  fileSystem: initialFileSystem,
  
  currentUser: { name: 'Convidado', avatar: '' },
  setCurrentUser: (name, avatar) => set({ currentUser: { name, avatar } }),

  // --- AÇÕES DE ARQUIVO ---
  createItem: (parentId, type, nameBase) => set((state) => {
    const id = `new_${Date.now()}`;
    const newItem = {
        id,
        parent: parentId,
        type,
        name: `${nameBase} ${Math.floor(Math.random() * 100)}`,
        created: Date.now(), // Para ordenar por data
        ...(type === 'txt' ? { content: '' } : {}),
        ...(type === 'folder' ? { children: [] } : {}),
    };
    const parent = state.fileSystem[parentId];
    const newParent = { ...parent, children: [...parent.children, id] };
    return {
        refreshKey: state.refreshKey + 1,
        fileSystem: { ...state.fileSystem, [parentId]: newParent, [id]: newItem }
    };
  }),

  updateFileContent: (id, newContent) => set((state) => ({
    fileSystem: { ...state.fileSystem, [id]: { ...state.fileSystem[id], content: newContent } }
  })),

  renamingId: null,
  setRenamingId: (id) => set({ renamingId: id }),
  renameItem: (id, newName) => set((state) => {
      if (!newName.trim()) return { renamingId: null };
      return {
          renamingId: null,
          fileSystem: { ...state.fileSystem, [id]: { ...state.fileSystem[id], name: newName } }
      };
  }),

  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),

  // --- JANELAS E MENU ---
  // (Omitindo o código das janelas para economizar espaço, pois não mudou. Mantenha igual!)
  openWindow: (id, title, icon, component, initialPath = '/') => set((state) => {
    const existingWindow = state.windows.find((w) => w.id === id);
    const newZIndex = state.zIndexCounter + 1;
    if (existingWindow) { return { activeWindowId: id, zIndexCounter: newZIndex, windows: state.windows.map((w) => w.id === id ? { ...w, isMinimized: false, zIndex: newZIndex } : w) }; }
    return { activeWindowId: id, zIndexCounter: newZIndex, windows: [...state.windows, { id, title, icon, component, initialPath, isOpen: true, isMinimized: false, isMaximized: false, zIndex: newZIndex }] };
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
  setCursorType: (type) => set({ cursorType: type }),
  setDesktopSort: (sort) => set({ desktopSort: sort }),
  setIconSize: (size) => set({ iconSize: size }),
}));