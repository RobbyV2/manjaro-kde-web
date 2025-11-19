import { create } from 'zustand';

export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  component: string;
  isPinned: boolean;
  priority?: number; // for pinned sort
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
}

export interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface AppInstance extends AppConfig, WindowState {
  params?: any;
}

interface DesktopState {
  apps: AppInstance[];
  activeAppId: string | null;
  isLocked: boolean;
  
  // Actions
  openApp: (id: string) => void;
  closeApp: (id: string) => void;
  minimizeApp: (id: string) => void;
  toggleMaximize: (id: string) => void;
  setZIndex: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  setAppParams: (id: string, params: any) => void;
  setLocked: (locked: boolean) => void;
  
  // UI State
  activeMenu: 'start' | 'calendar' | 'tray-paste' | 'tray-volume' | 'tray-bluetooth' | 'tray-wifi' | 'tray-arrow' | null;
  setActiveMenu: (menu: 'start' | 'calendar' | 'tray-paste' | 'tray-volume' | 'tray-bluetooth' | 'tray-wifi' | 'tray-arrow' | null) => void;
}

const initialApps: AppInstance[] = [
  {
    id: 'chrome',
    name: 'Chrome',
    icon: 'chrome',
    component: 'Chrome',
    isPinned: true,
    priority: 0,
    defaultPosition: { x: 30, y: 30 },
    defaultSize: { width: 900, height: 600 },
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 0,
    position: { x: 30, y: 30 },
    size: { width: 900, height: 600 },
  },
  {
    id: 'dolphin',
    name: 'Dolphin',
    icon: 'dolphin',
    component: 'Dolphin',
    isPinned: true,
    priority: 1,
    defaultPosition: { x: 10, y: 10 },
    defaultSize: { width: 700, height: 500 },
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 0,
    position: { x: 10, y: 10 },
    size: { width: 700, height: 500 },
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: 'terminal',
    component: 'Terminal',
    isPinned: true,
    priority: 2,
    defaultPosition: { x: 80, y: 80 },
    defaultSize: { width: 700, height: 500 },
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 0,
    position: { x: 80, y: 80 },
    size: { width: 700, height: 500 },
  },
  {
    id: 'vscode',
    name: 'VS Code',
    icon: 'vscode',
    component: 'VSCode',
    isPinned: true,
    priority: 3,
    defaultPosition: { x: 20, y: 20 },
    defaultSize: { width: 800, height: 500 },
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 0,
    position: { x: 20, y: 20 },
    size: { width: 800, height: 500 },
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: 'settings',
    component: 'Settings',
    isPinned: false,
    defaultPosition: { x: 30, y: 30 },
    defaultSize: { width: 700, height: 500 },
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 0,
    position: { x: 30, y: 30 },
    size: { width: 700, height: 500 },
  },
  {
    id: 'image-viewer',
    name: 'Image Viewer',
    icon: 'image-viewer',
    component: 'ImageViewer',
    isPinned: false,
    defaultPosition: { x: 10, y: 10 },
    defaultSize: { width: 700, height: 450 },
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 0,
    position: { x: 10, y: 10 },
    size: { width: 700, height: 450 },
  },
  {
    id: 'about',
    name: 'About',
    icon: 'about',
    component: 'About',
    isPinned: false,
    defaultPosition: { x: 50, y: 50 },
    defaultSize: { width: 450, height: 400 },
    isOpen: false, // Originally open/minimized in legacy, but let's start closed or check requirements
    isMinimized: true, // Legacy status 2
    isMaximized: false,
    zIndex: 1,
    position: { x: 50, y: 50 },
    size: { width: 450, height: 400 },
  },
  {
    id: 'music',
    name: 'Music',
    icon: 'music',
    component: 'Music',
    isPinned: false,
    defaultPosition: { x: 80, y: 80 },
    defaultSize: { width: 800, height: 500 },
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 0,
    position: { x: 80, y: 80 },
    size: { width: 800, height: 500 },
  },
  {
    id: 'gedit',
    name: 'Gedit',
    icon: 'gedit',
    component: 'Gedit',
    isPinned: false,
    defaultPosition: { x: 80, y: 80 },
    defaultSize: { width: 800, height: 500 },
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 0,
    position: { x: 80, y: 80 },
    size: { width: 800, height: 500 },
  },
];

export const useDesktopStore = create<DesktopState>((set) => ({
  apps: initialApps,
  activeAppId: null,
  isLocked: process.env.NODE_ENV !== 'development', // Replicate legacy logic

  openApp: (id) => set((state) => {
    const maxZ = Math.max(0, ...state.apps.map(a => a.zIndex));
    return {
      apps: state.apps.map(app => app.id === id ? { 
        ...app, 
        isOpen: true, 
        isMinimized: false, 
        zIndex: maxZ + 1 
      } : app),
      activeAppId: id
    };
  }),

  closeApp: (id) => set((state) => ({
    apps: state.apps.map(app => app.id === id ? { 
      ...app, 
      isOpen: false, 
      isMinimized: false, 
      isMaximized: false 
    } : app),
    activeAppId: state.activeAppId === id ? null : state.activeAppId // Handle active focus later
  })),

  minimizeApp: (id) => set((state) => ({
    apps: state.apps.map(app => app.id === id ? { ...app, isMinimized: true } : app),
    activeAppId: state.activeAppId === id ? null : state.activeAppId
  })),

  toggleMaximize: (id) => set((state) => ({
    apps: state.apps.map(app => app.id === id ? { ...app, isMaximized: !app.isMaximized } : app)
  })),

  setZIndex: (id) => set((state) => {
    const maxZ = Math.max(0, ...state.apps.map(a => a.zIndex));
    return {
      apps: state.apps.map(app => app.id === id ? { ...app, zIndex: maxZ + 1 } : app),
      activeAppId: id
    };
  }),

  updateWindowPosition: (id, position) => set((state) => ({
    apps: state.apps.map(app => app.id === id ? { ...app, position } : app)
  })),

  updateWindowSize: (id, size) => set((state) => ({
    apps: state.apps.map(app => app.id === id ? { ...app, size } : app)
  })),

  setAppParams: (id, params) => set((state) => ({
    apps: state.apps.map(app => app.id === id ? { ...app, params } : app)
  })),

  setLocked: (locked) => set({ isLocked: locked }),

  activeMenu: null,
  setActiveMenu: (menu) => set({ activeMenu: menu }),
}));
