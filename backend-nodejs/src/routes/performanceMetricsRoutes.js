import express from 'express';
import { 
  addPerformanceMetrics, 
  getPerformanceMetrics, 
  updatePerformanceMetrics, 
  deletePerformanceMetrics 
} from '../controllers/performanceMetricsController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/metrics', verifyToken, addPerformanceMetrics);
router.get('/metrics', verifyToken, getPerformanceMetrics);
router.put('/metrics/:id', verifyToken, updatePerformanceMetrics);
router.delete('/metrics/:id', verifyToken, deletePerformanceMetrics);

export default router;