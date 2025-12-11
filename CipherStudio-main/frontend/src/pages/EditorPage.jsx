import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI, filesAPI } from '../utils/api';
import {
  saveProjectsToLocal,
  getProjectsFromLocal,
  saveFilesToLocal,
  getFilesFromLocal,
  saveCurrentProject,
  getCurrentProject,
} from '../utils/localStorage';
import Header from '../components/Editor/Header';
import Sidebar from '../components/Editor/Sidebar';
import CodeEditor from '../components/Editor/CodeEditor';
import ProjectSelector from '../components/Editor/ProjectSelector';
import PreviewPanel from '../components/Editor/PreviewPanel';
import { Loader2 } from 'lucide-react';

const EditorPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load projects on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  // Load files when project changes
  useEffect(() => {
    if (currentProject) {
      loadFiles(currentProject._id);
      saveCurrentProject(currentProject._id);
    }
  }, [currentProject]);

  // Auto-save every 30 seconds if there are unsaved changes
  useEffect(() => {
    if (!hasUnsavedChanges || !currentFile) return;

    const autoSaveInterval = setInterval(() => {
      handleSave();
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [hasUnsavedChanges, currentFile]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentFile]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      const projectsData = response.data.data;
      setProjects(projectsData);
      saveProjectsToLocal(projectsData);

      // Load last opened project
      const lastProjectId = getCurrentProject();
      if (lastProjectId) {
        const lastProject = projectsData.find(p => p._id === lastProjectId);
        if (lastProject) {
          setCurrentProject(lastProject);
        }
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      // Load from localStorage as fallback
      const localProjects = getProjectsFromLocal();
      setProjects(localProjects);
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async (projectId) => {
    try {
      const response = await filesAPI.getProjectFiles(projectId);
      const filesData = response.data.data;
      setFiles(filesData);
      saveFilesToLocal(projectId, filesData);
      
      // Select first file if available
      if (filesData.length > 0 && !currentFile) {
        setCurrentFile(filesData[0]);
      }
    } catch (error) {
      console.error('Error loading files:', error);
      // Load from localStorage as fallback
      const localFiles = getFilesFromLocal(projectId);
      setFiles(localFiles);
    }
  };

  const handleProjectCreate = async (projectData) => {
    try {
      const response = await projectsAPI.create(projectData);
      const newProject = response.data.data;
      setProjects([...projects, newProject]);
      setCurrentProject(newProject);
      saveProjectsToLocal([...projects, newProject]);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const handleProjectDelete = async (projectId) => {
    try {
      await projectsAPI.delete(projectId);
      const updatedProjects = projects.filter(p => p._id !== projectId);
      setProjects(updatedProjects);
      saveProjectsToLocal(updatedProjects);
      
      if (currentProject?._id === projectId) {
        setCurrentProject(null);
        setFiles([]);
        setCurrentFile(null);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const handleFileCreate = async () => {
    if (!currentProject) return;

    const fileName = prompt('Enter file name (e.g., index.jsx):');
    if (!fileName) return;

    try {
      const response = await filesAPI.create({
        projectId: currentProject._id,
        name: fileName,
        type: 'file',
        content: '',
        parentId: null,
      });
      
      const newFile = response.data.data;
      const updatedFiles = [...files, newFile];
      setFiles(updatedFiles);
      setCurrentFile(newFile);
      saveFilesToLocal(currentProject._id, updatedFiles);
    } catch (error) {
      console.error('Error creating file:', error);
      alert(error.response?.data?.message || 'Failed to create file');
    }
  };

  const handleFileDelete = async (fileId) => {
    if (!confirm('Delete this file?')) return;

    try {
      await filesAPI.delete(fileId);
      const updatedFiles = files.filter(f => f._id !== fileId);
      setFiles(updatedFiles);
      saveFilesToLocal(currentProject._id, updatedFiles);
      
      if (currentFile?._id === fileId) {
        setCurrentFile(updatedFiles[0] || null);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  };

  const handleFileSelect = (file) => {
    if (hasUnsavedChanges && currentFile) {
      if (!confirm('You have unsaved changes. Continue?')) {
        return;
      }
    }
    setCurrentFile(file);
    setHasUnsavedChanges(false);
  };

  const handleCodeChange = (value) => {
    if (currentFile) {
      setCurrentFile({ ...currentFile, content: value });
      setHasUnsavedChanges(true);
    }
  };

  const handleSave = async () => {
    if (!currentFile || !hasUnsavedChanges) return;

    try {
      setIsSaving(true);
      await filesAPI.update(currentFile._id, {
        content: currentFile.content,
      });
      
      // Update local state
      const updatedFiles = files.map(f =>
        f._id === currentFile._id ? currentFile : f
      );
      setFiles(updatedFiles);
      saveFilesToLocal(currentProject._id, updatedFiles);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFolderCreate = () => {
    alert('Folder creation coming soon!');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header
        currentProject={currentProject}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {!currentProject ? (
        <div className="flex-1 overflow-auto">
          <ProjectSelector
            projects={projects}
            currentProject={currentProject}
            onSelect={setCurrentProject}
            onCreate={handleProjectCreate}
            onDelete={handleProjectDelete}
            loading={loading}
          />
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 flex-shrink-0">
            <Sidebar
              files={files}
              currentFile={currentFile}
              onFileSelect={handleFileSelect}
              onFileCreate={handleFileCreate}
              onFileDelete={handleFileDelete}
              onFolderCreate={handleFolderCreate}
            />
          </div>
          <div className="flex-1 overflow-hidden flex">
            {/* Code Editor - Left Side */}
            <div className="flex-1 border-r border-gray-200 dark:border-gray-700">
              <CodeEditor
                file={currentFile}
                onChange={handleCodeChange}
              />
            </div>
            
            {/* Live Preview - Right Side (Always Visible) */}
            <div className="flex-1">
              <PreviewPanel
                files={files}
                currentFile={currentFile}
              />
            </div>
          </div>
        </div>
      )}

      {/* Unsaved changes indicator */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50">
          Unsaved changes
        </div>
      )}
    </div>
  );
};

export default EditorPage;