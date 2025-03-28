import admin from 'firebase-admin';

// Parse the private key (replace newlines with actual newline characters)
const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

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