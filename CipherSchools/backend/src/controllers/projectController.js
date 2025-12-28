import Project from '../models/Project.js';
import File from '../models/File.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * @desc    Create new project
 * @route   POST /api/projects
 * @access  Private
 */
export const createProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return next(new AppError('Please provide a project title', 400));
    }

    const project = await Project.create({
      title,
      description: description || '',
      createdBy: req.user._id,
    });

    // Create root project folder
    const rootFolder = await File.create({
      projectId: project._id,
      parentId: null,
      name: title,
      type: 'folder',
    });

    // Create default folders inside root
    const defaultFolders = [
      {
        projectId: project._id,
        parentId: rootFolder._id,
        name: 'src',
        type: 'folder',
      },
      {
        projectId: project._id,
        parentId: rootFolder._id,
        name: 'public',
        type: 'folder',
      },
    ];

    const createdFolders = await File.insertMany(defaultFolders);
    const srcFolder = createdFolders.find((f) => f.name === 'src');
    const publicFolder = createdFolders.find((f) => f.name === 'public');

    // Create default files inside src folder
    const srcFiles = [
      {
        projectId: project._id,
        parentId: srcFolder._id,
        name: 'App.jsx',
        type: 'file',
        content: `function App() {
  return (
    <div className="App">
      <h1>Welcome to CipherStudio</h1>
      <p>Start editing to see changes!</p>
    </div>
  );
}

export default App;`,
        s3Key: `projects/${project._id}/src/App.jsx`,
      },
      {
        projectId: project._id,
        parentId: srcFolder._id,
        name: 'main.jsx',
        type: 'file',
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
        s3Key: `projects/${project._id}/src/main.jsx`,
      },
      {
        projectId: project._id,
        parentId: srcFolder._id,
        name: 'index.css',
        type: 'file',
        content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.App {
  text-align: center;
  padding: 2rem;
}`,
        s3Key: `projects/${project._id}/src/index.css`,
      },
    ];

    await File.insertMany(srcFiles);

    // Create index.html in public folder
    await File.create({
      projectId: project._id,
      parentId: publicFolder._id,
      name: 'index.html',
      type: 'file',
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,
      s3Key: `projects/${project._id}/public/index.html`,
    });

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all projects for logged in user
 * @route   GET /api/projects
 * @access  Private
 */
export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id })
      .sort({ updatedAt: -1 })
      .select('title description createdAt updatedAt');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single project with full file tree
 * @route   GET /api/projects/:id
 * @access  Private
 */
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    // Check ownership
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return next(
        new AppError('Not authorized to access this project', 403)
      );
    }

    // Get all files for this project
    const files = await File.find({ projectId: project._id }).sort({
      type: -1,
      name: 1,
    });

    // Build file tree
    const fileTree = buildFileTree(files);

    res.status(200).json({
      success: true,
      data: {
        project,
        files: fileTree,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private
 */
export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    // Check ownership
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return next(
        new AppError('Not authorized to update this project', 403)
      );
    }

    const { title, description } = req.body;

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: project,
      message: 'Project updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    // Check ownership
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return next(
        new AppError('Not authorized to delete this project', 403)
      );
    }

    // Delete all files associated with this project
    await File.deleteMany({ projectId: project._id });

    // Delete project
    await project.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Autosave project
 * @route   POST /api/projects/:id/autosave
 * @access  Private
 */
export const autosaveProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    // Check ownership
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return next(
        new AppError('Not authorized to autosave this project', 403)
      );
    }

    const { files } = req.body;

    if (!files || !Array.isArray(files)) {
      return next(new AppError('Please provide files array', 400));
    }

    // Update files
    for (const fileData of files) {
      if (fileData._id) {
        // Update existing file
        await File.findByIdAndUpdate(fileData._id, {
          content: fileData.content,
        });
      }
    }

    // Update project timestamp
    project.updatedAt = Date.now();
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project autosaved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to build file tree
 */
const buildFileTree = (files) => {
  const fileMap = {};
  const rootFiles = [];

  // Create a map of all files
  files.forEach((file) => {
    fileMap[file._id.toString()] = {
      ...file.toObject(),
      children: [],
    };
  });

  // Build the tree structure
  files.forEach((file) => {
    const fileObj = fileMap[file._id.toString()];

    if (file.parentId) {
      const parent = fileMap[file.parentId.toString()];
      if (parent) {
        parent.children.push(fileObj);
      }
    } else {
      rootFiles.push(fileObj);
    }
  });

  return rootFiles;
};