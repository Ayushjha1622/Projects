import { useState } from 'react';
import {
  SandpackProvider,
  SandpackPreview,
  SandpackConsole
} from '@codesandbox/sandpack-react';
import { useTheme } from '../../context/ThemeContext';
import { Play, Maximize2, Minimize2, RefreshCw } from 'lucide-react';

const PreviewPanel = ({ files, currentFile }) => {
  const { isDark } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Update files array with current file's latest content
  const getUpdatedFiles = () => {
    if (!currentFile) return files;
    
    return files.map(file =>
      file._id === currentFile._id
        ? { ...file, content: currentFile.content }
        : file
    );
  };

  const updatedFiles = getUpdatedFiles();

  // Helper to get full path for a file
  const getFilePath = (file, allFiles) => {
    let path = file.name;
    let currentFile = file;
    
    while (currentFile.parentId) {
      const parent = allFiles.find(f => f._id === currentFile.parentId);
      if (parent) {
        path = `${parent.name}/${path}`;
        currentFile = parent;
      } else {
        break;
      }
    }
    
    return `/${path}`;
  };

  // Convert files to Sandpack format
  const getSandpackFiles = () => {
    const sandpackFiles = {};
    
    // Only include actual files (not folders)
    const actualFiles = updatedFiles.filter(f => f.type === 'file');
    
    actualFiles.forEach(file => {
      const filePath = getFilePath(file, updatedFiles);
      sandpackFiles[filePath] = {
        code: file.content || '',
      };
    });

    // Ensure we have at least an App component
    if (Object.keys(sandpackFiles).length === 0) {
      sandpackFiles['/App.jsx'] = {
        code: `export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>Welcome to Ayustudio! 🚀</h1>
      <p>Create files to see your code in action.</p>
    </div>
  );
}`,
      };
    }

    return sandpackFiles;
  };

  // Determine template based on files
  const getTemplate = () => {
    const actualFiles = updatedFiles.filter(f => f.type === 'file');
    
    const hasReact = actualFiles.some(f =>
      f.name.endsWith('.jsx') ||
      f.name.endsWith('.tsx') ||
      f.content?.includes('import React')
    );
    
    const hasVue = actualFiles.some(f => f.name.endsWith('.vue'));
    const hasSvelte = actualFiles.some(f => f.name.endsWith('.svelte'));
    const hasHTML = actualFiles.some(f => f.name.endsWith('.html'));

    if (hasReact) return 'react';
    if (hasVue) return 'vue';
    if (hasSvelte) return 'svelte';
    if (hasHTML) return 'static';
    return 'vanilla';
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'} flex flex-col bg-white dark:bg-gray-900`}>
      {/* Header */}
      <div className="h-12 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-semibold">Live Preview</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title="Refresh Preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          
        </div>
      </div>

      {/* React Playground Output - Shows only the rendered result */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {updatedFiles.filter(f => f.type === 'file').length > 0 ? (
          <SandpackProvider
            key={refreshKey}
            template={getTemplate()}
            files={getSandpackFiles()}
            theme={isDark ? 'dark' : 'light'}
            customSetup={{
              dependencies: {
                'react': '^18.2.0',
                'react-dom': '^18.2.0',
              },
            }}
            options={{
              autorun: true,
              autoReload: true,
              recompileMode: 'immediate',
              recompileDelay: 500,
            }}
          >
            {/* Preview Window - Shows compiled output only */}
            <div className="flex-1 overflow-hidden">
              <SandpackPreview
                showNavigator={true}
                showRefreshButton={false}
                showOpenInCodeSandbox={false}
                style={{ height: '100%' }}
              />
            </div>
            
            {/* Console for errors/logs */}
            <div className="h-32 border-t border-gray-200 dark:border-gray-700">
              <SandpackConsole
                showHeader={false}
                style={{ height: '100%' }}
              />
            </div>
          </SandpackProvider>
        ) : (
          <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900">
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                React Playground Ready
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Write React code and see the live output here
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Bar */}
      <div className="h-8 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded">
            ✓ Compiled
          </span>
          <span>Template: {getTemplate()}</span>
        </div>
        <span>{updatedFiles.filter(f => f.type === 'file').length} file{updatedFiles.filter(f => f.type === 'file').length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
};

export default PreviewPanel;