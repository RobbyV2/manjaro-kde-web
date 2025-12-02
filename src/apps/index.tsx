'use client';

import React from 'react';
import { Terminal } from './Terminal';
import { Settings } from './Settings';
import { Dolphin } from './Dolphin';

// Mapping app names to components
const APP_COMPONENTS: { [key: string]: React.ComponentType<any> } = {
  'terminal': Terminal,
  'settings': Settings,
  'dolphin': Dolphin,
  // Add others later: vscode, music, etc.
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
