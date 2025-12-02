'use client';

import React from 'react';
import { Terminal } from './Terminal';
import { Settings } from './Settings';
import { Dolphin } from './Dolphin';
import { VSCode } from './VSCode';
import { Music } from './Music';
import { ImageViewer } from './ImageViewer';

// Placeholder for Gedit if not implemented yet
const GeditPlaceholder = ({ filepath }: { filepath?: string }) => (
    <div className="w-full h-full bg-[#262626] text-white p-4 font-mono">
        <div className="text-gray-400 mb-2">Editing: {filepath || "Untitled"}</div>
        <textarea className="w-full h-full bg-transparent outline-none resize-none" defaultValue="This is a simple text editor placeholder." />
    </div>
);


const APP_COMPONENTS: { [key: string]: React.ComponentType<any> } = {
  'terminal': Terminal,
  'settings': Settings,
  'dolphin': Dolphin,
  'vscode': VSCode,
  'music': Music,
  'image viewer': ImageViewer,
  'gedit': GeditPlaceholder,
  'chrome': () => <iframe src="https://www.google.com/webhp?igu=1" className="w-full h-full bg-white" title="Chrome" />,
};

export const AppRenderer = ({ appName, params }: { appName: string; params?: any }) => {
  const Component = APP_COMPONENTS[appName];

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        App "{appName}" not implemented yet.
      </div>
    );
  }

  return <Component {...params} />;
};