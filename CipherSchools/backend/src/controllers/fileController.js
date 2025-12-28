import File from '../models/File.js';
import Project from '../models/Project.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * @desc    Create new file or folder
 * @route   POST /api/files
 * @access  Private
 */
export const createFile = async (req, res, next) => {
  try {
    const { projectId, parentId, name, type, content } = req.body;

    if (!projectId || !name || !type) {
      return next(
        new AppError('Please provide projectId, name, and type', 400)
      );
    }

    // Verify project exists and user owns it
    const project = await Project.findById(projectId);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return next(
        new AppError('Not authorized to add files to this project', 403)
      );
    }

    // If parentId is provided, verify it exists and is a folder
    if (parentId) {
      const parent = await File.findById(parentId);

      if (!parent) {
        return next(new AppError('Parent folder not found', 404));
      }

      if (parent.type !== 'folder') {
        return next(new AppError('Parent must be a folder', 400));
      }

      if (parent.projectId.toString() !== projectId) {
        return next(
          new AppError('Parent folder belongs to different project', 400)
        );
      }
    }

    // Check for duplicate name in same directory
    const existingFile = await File.findOne({
      projectId,
      parentId: parentId || null,
      name,
    });

    if (existingFile) {
      return next(
        new AppError('File or folder with this name already exists', 400)
      );
    }

    const file = await File.create({
      projectId,
      parentId: parentId || null,
      name,
      type,
      content: type === 'file' ? content || '' : '',
    });

    res.status(201).json({
      success: true,
      data: file,
      message: `${type === 'file' ? 'File' : 'Folder'} created successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get file or folder by ID
 * @route   GET /api/files/:id
 * @access  Private
 */
export const getFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return next(new AppError('File not found', 404));
    }

    // Verify user owns the project
    const project = await Project.findById(file.projectId);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to access this file', 403));
    }

    // If it's a folder, get its children
    let children = [];
    if (file.type === 'folder') {
      children = await File.find({ parentId: file._id }).sort({
        type: -1,
        name: 1,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...file.toObject(),
        children,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update file or folder
 * @route   PUT /api/files/:id
 * @access  Private
 */
export const updateFile = async (req, res, next) => {
  try {
    let file = await File.findById(req.params.id);

    if (!file) {
      return next(new AppError('File not found', 404));
    }

    // Verify user owns the project
    const project = await Project.findById(file.projectId);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to update this file', 403));
    }

    const { name, content } = req.body;

    // If renaming, check for duplicates
    if (name && name !== file.name) {
      const existingFile = await File.findOne({
        projectId: file.projectId,
        parentId: file.parentId,
        name,
        _id: { $ne: file._id },
      });

      if (existingFile) {
        return next(
          new AppError('File or folder with this name already exists', 400)
        );
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (content !== undefined && file.type === 'file') {
      updateData.content = content;
    }

    file = await File.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: file,
      message: `${file.type === 'file' ? 'File' : 'Folder'} updated successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete file or folder
 * @route   DELETE /api/files/:id
 * @access  Private
 */
export const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return next(new AppError('File not found', 404));
    }

    // Verify user owns the project
    const project = await Project.findById(file.projectId);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to delete this file', 403));
    }

    // If it's a folder, delete all children recursively
    if (file.type === 'folder') {
      await deleteFileRecursive(file._id);
    }

    await file.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: `${file.type === 'file' ? 'File' : 'Folder'} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all files in a project
 * @route   GET /api/files/project/:projectId
 * @access  Private
 */
export const getProjectFiles = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // Verify project exists and user owns it
    const project = await Project.findById(projectId);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return next(
        new AppError('Not authorized to access this project', 403)
      );
    }

    const files = await File.find({ projectId }).sort({ type: -1, name: 1 });

    res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Move file or folder to different parent
 * @route   PUT /api/files/:id/move
 * @access  Private
 */
export const moveFile = async (req, res, next) => {
  try {
    const { newParentId } = req.body;

    const file = await File.findById(req.params.id);

    if (!file) {
      return next(new AppError('File not found', 404));
    }

    // Verify user owns the project
    const project = await Project.findById(file.projectId);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to move this file', 403));
    }

    // If newParentId is provided, verify it exists and is a folder
    if (newParentId) {
      const newParent = await File.findById(newParentId);

      if (!newParent) {
        return next(new AppError('New parent folder not found', 404));
      }

      if (newParent.type !== 'folder') {
        return next(new AppError('New parent must be a folder', 400));
      }

      if (newParent.projectId.toString() !== file.projectId.toString()) {
        return next(
          new AppError('Cannot move to folder in different project', 400)
        );
      }

      // Prevent moving folder into itself or its descendants
      if (file.type === 'folder') {
        const isDescendant = await checkIfDescendant(
          file._id,
          newParentId
        );
        if (isDescendant || file._id.toString() === newParentId) {
          return next(
            new AppError('Cannot move folder into itself or its descendants', 400)
          );
        }
      }
    }

    // Check for duplicate name in new location
    const existingFile = await File.findOne({
      projectId: file.projectId,
      parentId: newParentId || null,
      name: file.name,
      _id: { $ne: file._id },
    });

    if (existingFile) {
      return next(
        new AppError('File or folder with this name already exists in destination', 400)
      );
    }

    file.parentId = newParentId || null;
    await file.save();

    res.status(200).json({
      success: true,
      data: file,
      message: 'File moved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to delete file and all children recursively
 */
const deleteFileRecursive = async (fileId) => {
  const children = await File.find({ parentId: fileId });

  for (const child of children) {
    if (child.type === 'folder') {
      await deleteFileRecursive(child._id);
    }
    await child.deleteOne();
  }
};

/**
 * Helper function to check if a folder is a descendant of another
 */
const checkIfDescendant = async (ancestorId, descendantId) => {
  let current = await File.findById(descendantId);

  while (current && current.parentId) {
    if (current.parentId.toString() === ancestorId.toString()) {
      return true;
    }
    current = await File.findById(current.parentId);
  }

  return false;
};