import { useState } from 'react';
import {
  FolderPlus,
  FilePlus,
  Trash2,
  ChevronRight,
  ChevronDown,
  File,
  Folder,
} from 'lucide-react';

const Sidebar = ({ files, currentFile, onFileSelect, onFileCreate, onFileDelete, onFolderCreate }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));

  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
      js: '📜',
      jsx: '⚛️',
      ts: '📘',
      tsx: '⚛️',
      html: '🌐',
      css: '🎨',
      json: '📋',
      md: '📝',
      py: '🐍',
      java: '☕',
      cpp: '⚙️',
      go: '🔷',
    };
    return iconMap[ext] || '📄';
  };

  const buildFileTree = (files) => {
    // Create a map of all files/folders by ID
    const fileMap = {};
    files.forEach(file => {
      fileMap[file._id] = {
        ...file,
        children: []
      };
    });
    
    // Build the tree structure
    const rootItems = [];
    files.forEach(file => {
      if (file.parentId && fileMap[file.parentId]) {
        // Add to parent's children
        fileMap[file.parentId].children.push(fileMap[file._id]);
      } else if (!file.parentId) {
        // Root level item
        rootItems.push(fileMap[file._id]);
      }
    });
    
    return rootItems;
  };

  const renderTree = (items, level = 0) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="space-y-0.5">
        {items.map(item => {
          if (item.type === 'folder') {
            const folderPath = item._id;
            const isExpanded = expandedFolders.has(folderPath);
            
            return (
              <div key={item._id}>
                <div
                  className="sidebar-item group"
                  style={{ paddingLeft: `${level * 12 + 16}px` }}
                  onClick={() => toggleFolder(folderPath)}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                  <Folder className="w-4 h-4 text-yellow-500" />
                  <span className="flex-1 text-sm">{item.name}</span>
                </div>
                {isExpanded && item.children && (
                  <div>
                    {renderTree(item.children, level + 1)}
                  </div>
                )}
              </div>
            );
          } else {
            // It's a file
            return (
              <div
                key={item._id}
                className={`sidebar-item group ${
                  currentFile?._id === item._id ? 'sidebar-item-active' : ''
                }`}
                style={{ paddingLeft: `${level * 12 + 16}px` }}
                onClick={() => onFileSelect(item)}
              >
                <span className="text-lg">{getFileIcon(item.name)}</span>
                <span className="flex-1 text-sm truncate">{item.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileDelete(item._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                </button>
              </div>
            );
          }
        })}
      </div>
    );
  };

  const fileTree = buildFileTree(files);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          FILES
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onFileCreate}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
            title="New File"
          >
            <FilePlus className="w-4 h-4" />
            <span>File</span>
          </button>
          <button
            onClick={onFolderCreate}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
            title="New Folder"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Folder</span>
          </button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No files yet</p>
            <p className="text-xs mt-1">Create your first file</p>
          </div>
        ) : (
          renderTree(fileTree)
        )}
      </div>
    </div>
  );
};

export default Sidebar;