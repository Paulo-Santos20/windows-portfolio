import { create } from 'zustand';

export const useOSStore = create((set) => ({
  // --- SISTEMA DE JANELAS (Existente) ---
  windows: [],
  activeWindowId: null,
  zIndexCounter: 100,

  // --- NOVO: ESTADO DO SISTEMA ---
  bootStatus: 'booting', // 'booting' | 'login' | 'desktop'
  wallpaper: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Default Blue
  themeMode: 'aero', // 'aero' (light/blue) | 'dark' (obsidian)
  
  // Ações de Boot
  setBootStatus: (status) => set({ bootStatus: status }),
  
  // Ações de Personalização
  setWallpaper: (url) => set({ wallpaper: url }),
  setThemeMode: (mode) => set({ themeMode: mode }),

  // ... (Mantenha as funções openWindow, closeWindow, etc. iguais às anteriores)
  openWindow: (id, title, icon, component, initialPath = '/') => set((state) => {
    const existingWindow = state.windows.find((w) => w.id === id);
    const newZIndex = state.zIndexCounter + 1;
    if (existingWindow) {
      return {
        activeWindowId: id,
        zIndexCounter: newZIndex,
        windows: state.windows.map((w) => 
          w.id === id ? { ...w, isMinimized: false, zIndex: newZIndex } : w
        ),
      };
    }
    return {
      activeWindowId: id,
      zIndexCounter: newZIndex,
      windows: [
        ...state.windows,
        { id, title, icon, component, initialPath, isOpen: true, isMinimized: false, isMaximized: false, zIndex: newZIndex },
      ],
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
    windows: state.windows.map((w) => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    )
  })),

  focusWindow: (id) => set((state) => {
    const newZIndex = state.zIndexCounter + 1;
    return {
      activeWindowId: id,
      zIndexCounter: newZIndex,
      windows: state.windows.map((w) => 
        w.id === id ? { ...w, zIndex: newZIndex } : w
      )
    };
  }),

  restoreWindow: (id) => set((state) => {
    const newZIndex = state.zIndexCounter + 1;
    return {
      activeWindowId: id,
      zIndexCounter: newZIndex,
      windows: state.windows.map((w) => 
        w.id === id ? { ...w, isMinimized: false, zIndex: newZIndex } : w
      )
    };
  }),
}));