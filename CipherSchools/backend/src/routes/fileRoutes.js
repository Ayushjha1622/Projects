import express from 'express';
import {
  createFile,
  getFile,
  updateFile,
  deleteFile,
  getProjectFiles,
  moveFile,
} from '../controllers/fileController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/').post(createFile);

router.route('/project/:projectId').get(getProjectFiles);

router
  .route('/:id')
  .get(getFile)
  .put(updateFile)
  .delete(deleteFile);

router.put('/:id/move', moveFile);

export default router;