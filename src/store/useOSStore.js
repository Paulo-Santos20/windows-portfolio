import { create } from 'zustand';

export const useOSStore = create((set) => ({
  windows: [],
  activeWindowId: null,
  zIndexCounter: 100,

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
        { 
            id, 
            title, 
            icon, 
            component, 
            initialPath, // Para saber em que pasta abrir
            isOpen: true, 
            isMinimized: false, 
            isMaximized: false, // Novo estado
            zIndex: newZIndex 
        },
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

  // Nova Função: Alternar Maximizar
  toggleMaximize: (id) => set((state) => ({
    activeWindowId: id,
    windows: state.windows.map((w) => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    )
  })),

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
}));