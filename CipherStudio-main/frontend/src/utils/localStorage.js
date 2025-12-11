// LocalStorage utilities for offline save/load

const STORAGE_KEYS = {
  PROJECTS: 'ayustudio_projects',
  FILES: 'ayustudio_files',
  CURRENT_PROJECT: 'ayustudio_current_project',
  THEME: 'ayustudio_theme',
};

// Projects
export const saveProjectsToLocal = (projects) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
  }
};

export const getProjectsFromLocal = () => {
  try {
    const projects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return projects ? JSON.parse(projects) : [];
  } catch (error) {
    console.error('Error getting projects from localStorage:', error);
    return [];
  }
};

// Files
export const saveFilesToLocal = (projectId, files) => {
  try {
    const allFiles = getFilesFromLocal();
    allFiles[projectId] = files;
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(allFiles));
  } catch (error) {
    console.error('Error saving files to localStorage:', error);
  }
};

export const getFilesFromLocal = (projectId = null) => {
  try {
    const files = localStorage.getItem(STORAGE_KEYS.FILES);
    const allFiles = files ? JSON.parse(files) : {};
    return projectId ? (allFiles[projectId] || []) : allFiles;
  } catch (error) {
    console.error('Error getting files from localStorage:', error);
    return projectId ? [] : {};
  }
};

// Current Project
export const saveCurrentProject = (projectId) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, projectId);
  } catch (error) {
    console.error('Error saving current project:', error);
  }
};

export const getCurrentProject = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT);
  } catch (error) {
    console.error('Error getting current project:', error);
    return null;
  }
};

// Theme
export const saveTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

export const getTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  } catch (error) {
    console.error('Error getting theme:', error);
    return 'dark';
  }
};

// Clear all data
export const clearLocalStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};