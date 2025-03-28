import express from 'express';
import { 
  createPlayerProfile, 
  getPlayerProfile, 
  updatePlayerProfile, 
  deletePlayerProfile 
} from '../controllers/playerProfileController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/profile', verifyToken, createPlayerProfile);
router.get('/profile', verifyToken, getPlayerProfile);
router.put('/profile', verifyToken, updatePlayerProfile);
router.delete('/profile', verifyToken, deletePlayerProfile);

export default router;