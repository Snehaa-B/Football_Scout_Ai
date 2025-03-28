import express from 'express';
import { 
  createScoutReport, 
  getScoutReports, 
  getScoutReportById, 
  updateScoutReport, 
  deleteScoutReport 
} from '../controllers/scoutReportController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/reports', verifyToken, createScoutReport);
router.get('/reports', verifyToken, getScoutReports);
router.get('/reports/:id', verifyToken, getScoutReportById);
router.put('/reports/:id', verifyToken, updateScoutReport);
router.delete('/reports/:id', verifyToken, deleteScoutReport);

export default router;