'use client';

import { Desktop } from '@/components/Desktop';
import { Taskbar } from '@/components/Taskbar';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-zinc-900 overflow-hidden">
      <Desktop />
      <Taskbar />
    </main>
  );
}