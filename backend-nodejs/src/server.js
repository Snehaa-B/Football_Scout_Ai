import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import playerProfileRoutes from './routes/playerProfileRoutes.js';
import uploadedVideoRoutes from './routes/uploadedVideoRoutes.js';
import performanceMetricsRoutes from './routes/performanceMetricsRoutes.js';
import scoutReportRoutes from './routes/scoutReportRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/player', playerProfileRoutes);
app.use('/api/videos', uploadedVideoRoutes);
app.use('/api/performance', performanceMetricsRoutes);
app.use('/api/scouts', scoutReportRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});