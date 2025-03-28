import admin from '../config/firebaseConfig.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Find user in Prisma database
    const user = await prisma.user.findUnique({
      where: { email: decodedToken.email }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(403).json({ 
      message: 'Unauthorized', 
      error: error.message 
    });
  }
};