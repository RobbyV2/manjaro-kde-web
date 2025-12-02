import { typeApp } from "./apps";

export function useTopWindow(apps: typeApp[]): typeApp | undefined {
  if (!apps || apps.length === 0) return undefined;
  // Filter for open windows (status != 0 if that's what it means, or just sort by zindex)
  // Assuming zindex is managed and persistent
  const sorted = [...apps].sort((a, b) => b.zindex - a.zindex);
  return sorted[0];
}
