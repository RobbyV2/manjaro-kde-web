import { typeApp } from "./apps";
import { typeFile, dolphinFiles } from "../data/filesystem";

export function escapeHtml(s: string): string {
  return s.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function findMimeFiles(type: RegExp): Array<string> {
  const ret: string[] = [];
  function findImage(path: Array<string>) {
    let files: typeFile[] = dolphinFiles as Array<typeFile>;
    // Traverse path
    for (const i of path) {
      const dir = files.find((v) => v.isDir && v.name === i);
      if (dir && dir.sub) {
        files = dir.sub;
      } else {
        files = []; // Path not found or not a directory
        break;
      }
    }
    const pathStr = path.join("/");
    files.forEach((file) => {
      if (type.test(file.mime)) {
        ret.push(pathStr ? pathStr + "/" + file.name : file.name);
      } else if (file.isDir) {
        findImage(path.concat(file.name));
      }
    });
  }
  findImage([]);
  return ret;
}

// Converted to a pure function that modifies state (or returns new state)
// In React, this would likely be part of a reducer or store action
export function openApp(apps: typeApp[], name: string): typeApp | undefined {
  const appIndex = apps.findIndex((app) => app.name === name);
  if (appIndex === -1) return undefined;
  
  const app = apps[appIndex];
  if (app.animating) return undefined;

  // Clone app to avoid mutation if strict
  // But here we might want to return the mutation instructions
  // For now, let's just return the modified app logic but we can't mutate the array directly if using React state
  // We will assume this is a helper called within a state update
  
  // Logic:
  // if (this.topWindow && app !== this.topWindow) {
  //   app.zindex = this.topWindow.zindex + 1;
  // }
  // if (app.order !== undefined) {
  //   app.order = Date.now();
  // }
  // app.status = 2;

  return app;
}