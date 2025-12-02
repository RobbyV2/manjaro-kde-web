export type typeApp = {
  icon: string;
  name: string;
  taskbar?: number;
  order?: number; // removed Ref
  position: { x: number, y: number } | [number, number]; // simplified
  size: { w: number, h: number } | [number, number];
  status: number; // removed Ref
  maxed: boolean; // removed Ref
  zindex: number; // removed Ref
  animating: boolean;
  app: string; // Changed to string identifier for now
  params?: { [key: string]: any };
};

export const apps: typeApp[] = [
  {
    name: "chrome",
    icon: "chrome",
    taskbar: 0,
    position: [30, 30],
    size: [900, 600],
    status: 0,
    maxed: false,
    zindex: 0,
    animating: false,
    app: "chrome",
  },
  {
    name: "dolphin",
    icon: "dolphin",
    taskbar: 1,
    position: [10, 10],
    size: [700, 500],
    status: 0,
    maxed: false,
    zindex: 0,
    animating: false,
    app: "dolphin",
  },
  {
    name: "settings",
    icon: "settings",
    order: 0,
    position: [30, 30],
    size: [700, 500],
    status: 0,
    maxed: false,
    zindex: 0,
    animating: false,
    app: "settings",
  },
  {
    name: "terminal",
    icon: "terminal",
    taskbar: 2,
    position: [80, 80],
    size: [700, 500],
    status: 0,
    maxed: false,
    zindex: 0,
    animating: false,
    app: "terminal",
  },
  {
    name: "vscode",
    icon: "vscode",
    taskbar: 3,
    position: [20, 20],
    size: [800, 500],
    status: 0,
    maxed: false,
    zindex: 0,
    animating: false,
    app: "vscode",
  },
  {
    name: "image viewer",
    icon: "image-viewer",
    order: 0,
    position: [10, 10],
    size: [700, 450],
    status: 0,
    maxed: false,
    zindex: 0,
    animating: false,
    app: "image viewer",
    params: { filepath: "" },
  },

  {
    icon: "music",
    name: "music",
    order: 0,
    position: [80, 80],
    size: [800, 500],
    status: 0,
    maxed: false,
    zindex: 0,
    animating: false,
    app: "music",
    params: { filepath: "" },
  },
  {
    name: "gedit",
    icon: "gedit",
    order: 0,
    position: [80, 80],
    size: [800, 500],
    status: 0,
    maxed: false,
    zindex: 0,
    animating: false,
    app: "gedit",
    params: { filepath: "" },
  },
];

export default apps;