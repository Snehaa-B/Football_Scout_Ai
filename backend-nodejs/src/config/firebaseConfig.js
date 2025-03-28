import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if required environment variables are present
const requiredEnvVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Parse the private key - handle both escaped and unescaped newlines
const privateKey = process.env.FIREBASE_PRIVATE_KEY.includes('\\n') 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : process.env.FIREBASE_PRIVATE_KEY;

const firebaseAdminConfig = {
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey
  })
};

// Initialize Firebase Admin SDK
admin.initializeApp(firebaseAdminConfig);

export const auth = admin.auth();

export default admin;