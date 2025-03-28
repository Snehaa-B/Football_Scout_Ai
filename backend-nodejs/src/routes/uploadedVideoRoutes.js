import express from 'express';
import { 
  uploadVideo, 
  getVideos, 
  getVideoById, 
  deleteVideo 
} from '../controllers/uploadedVideoController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/upload', verifyToken, uploadVideo);
router.get('/videos', verifyToken, getVideos);
router.get('/videos/:id', verifyToken, getVideoById);
router.delete('/videos/:id', verifyToken, deleteVideo);

export default router;