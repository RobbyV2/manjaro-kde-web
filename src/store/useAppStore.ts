import { create } from 'zustand';
import { typeApp, apps as initialApps } from '../utils/apps';

interface AppState {
  apps: typeApp[];
  openApp: (name: string, params?: any) => void;
  closeApp: (name: string) => void;
  minimizeApp: (name: string) => void;
  maximizeApp: (name: string) => void;
  setAppPosition: (name: string, x: number, y: number) => void;
  setAppSize: (name: string, w: number, h: number) => void;
  bringToFront: (name: string) => void;
  resetAppOrder: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  apps: initialApps,
  openApp: (name, params) => set((state) => {
    const appIndex = state.apps.findIndex((app) => app.name === name);
    if (appIndex === -1) return state;

    const newApps = [...state.apps];
    const app = { ...newApps[appIndex] };

    if (app.status === 0) {
      app.status = 1; // Opening? Or just open. Ref used 2 in utils.ts. Let's use 2 as 'active'.
      // Wait, utils.ts: app.status.value = 2;
    }
    
    // Bring to front
    const maxZ = Math.max(...state.apps.map((a) => a.zindex), 0);
    app.zindex = maxZ + 1;
    app.status = 1; // Open
    if (params) {
      app.params = params;
    }

    newApps[appIndex] = app;
    return { apps: newApps };
  }),
  closeApp: (name) => set((state) => {
    const newApps = state.apps.map((app) => 
      app.name === name ? { ...app, status: 0, maxed: false, zindex: 0 } : app
    );
    return { apps: newApps };
  }),
  minimizeApp: (name) => set((state) => {
     const newApps = state.apps.map((app) => 
      app.name === name ? { ...app, status: 0 } : app // status 0 is closed? maybe -1 for minimized?
      // Ref project: status: ref(0). 
      // I should check how status is used. 
      // Assuming 0: closed, 1: open, 2: active?
      // utils.ts said status = 2 when opening.
    );
    // If minimizing, maybe just set status to -1 or keep it open but hide it?
    // Let's assume standard taskbar behavior.
    return { apps: newApps };
  }),
  maximizeApp: (name) => set((state) => {
    const newApps = state.apps.map((app) => 
      app.name === name ? { ...app, maxed: !app.maxed } : app
    );
    return { apps: newApps };
  }),
  setAppPosition: (name, x, y) => set((state) => {
     const newApps = state.apps.map((app) => 
      app.name === name ? { ...app, position: { x, y } } : app // or [x, y] depending on typeApp
    );
    return { apps: newApps };
  }),
  setAppSize: (name, w, h) => set((state) => {
      const newApps = state.apps.map((app) => 
      app.name === name ? { ...app, size: { w, h } } : app
    );
    return { apps: newApps };
  }),
  bringToFront: (name) => set((state) => {
    const maxZ = Math.max(...state.apps.map((a) => a.zindex), 0);
    const newApps = state.apps.map((app) => 
      app.name === name ? { ...app, zindex: maxZ + 1 } : app
    );
    return { apps: newApps };
  }),
  resetAppOrder: () => set((state) => {
    // Reset zindex or order
    return state;
  })
}));
