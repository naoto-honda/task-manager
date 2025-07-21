// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDj9hCTOzI63-qkz7zQLXtyuSOQthrq89Y',
  authDomain: 'my-task-manager-app-765ff.firebaseapp.com',
  projectId: 'my-task-manager-app-765ff',
  storageBucket: 'my-task-manager-app-765ff.firebasestorage.app',
  messagingSenderId: '879403003632',
  appId: '1:879403003632:web:28b8d9b76510a10ddb1c35',
  measurementId: 'G-67JQ59GDTS',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
