import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  OAuthProvider,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Apple Auth Provider
const appleProvider = new OAuthProvider('apple.com');

// Email/Password Authentication
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Email sign in error:', error);
    return { 
      success: false, 
      error: error.code || error.message 
    };
  }
};

export const createUserWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Email sign up error:', error);
    return { 
      success: false, 
      error: error.code || error.message 
    };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    console.error('Password reset error:', error);
    return { 
      success: false, 
      error: error.code || error.message 
    };
  }
};

// Google Authentication
export const signInWithGoogle = async (idToken: string) => {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Google sign in error:', error);
    return { 
      success: false, 
      error: error.code || error.message 
    };
  }
};

// Apple Authentication
export const signInWithApple = async (idToken: string, nonce: string) => {
  try {
    const credential = OAuthProvider.credential({
      providerId: 'apple.com',
      idToken,
      rawNonce: nonce,
    });
    const userCredential = await signInWithCredential(auth, credential);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Apple sign in error:', error);
    return { 
      success: false, 
      error: error.code || error.message 
    };
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { 
      success: false, 
      error: error.code || error.message 
    };
  }
};

// Auth state listener
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Guest mode authentication
export const signInAsGuest = async () => {
  try {
    // Store guest mode flag in AsyncStorage
    await AsyncStorage.setItem('isGuestMode', 'true');
    return { success: true };
  } catch (error: any) {
    console.error('Guest sign in error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

export const isGuestMode = async () => {
  try {
    const isGuest = await AsyncStorage.getItem('isGuestMode');
    return isGuest === 'true';
  } catch (error) {
    console.error('Error checking guest mode:', error);
    return false;
  }
};

export const clearGuestMode = async () => {
  try {
    await AsyncStorage.removeItem('isGuestMode');
    return { success: true };
  } catch (error: any) {
    console.error('Error clearing guest mode:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

export { auth };