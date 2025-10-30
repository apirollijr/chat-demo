// Centralized Firebase initialization to ensure the default app exists
// before any feature (Auth/Firestore) is used across the app.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, signInAnonymously } from 'firebase/auth';
// Ensure the Auth component is registered in environments where tree-shaking might drop side effects
import 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// TODO: Replace with your Firebase project's Web config from
// Firebase Console → Project settings → General → Your apps (Web)
const firebaseConfig = {
    apiKey: 'AIzaSyCbIcNchiv4hdf3rxX4Eu6EF7oTfXhp6IA',
    authDomain: 'chat-demo-502d3.firebaseapp.com',
    projectId: 'chat-demo-502d3',
    // Bucket per your Firebase project settings
    storageBucket: 'chat-demo-502d3.firebasestorage.app',
    messagingSenderId: '79173417817',
    appId: '1:79173417817:web:df64f14e0ee659fee16a48',
    // measurementId: 'G-5PYGZ2YCTL' // Not used in React Native
};

// Create or reuse the default app (prevents duplicate-app errors on fast refresh)
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Feature SDKs bound to this app instance
export const db = getFirestore(app);
// Force the exact bucket to avoid dev hot-reload config mismatch
export const storage = getStorage(app, `gs://${firebaseConfig.storageBucket}`);
export const storageBucketName = firebaseConfig.storageBucket;

// Initialize or reuse a singleton Auth instance
let authInstance;
export const getAuthInstance = () => {
    if (!authInstance) {
        // Use simple modular getAuth for maximum RN compatibility
        authInstance = getAuth(app);
    }
    return authInstance;
};

// Convenience helper for anonymous sign-in used by Start screen
export const signInAnonymouslyRN = async () => {
    try {
        const auth = getAuthInstance();
        return await signInAnonymously(auth);
    } catch (e) {
        // Fallback to compat API in case of provider registration issues in the bundler
        if (__DEV__) console.warn('[firebase] modular auth failed, falling back to compat:', e?.message || e);
        const compat = await import('firebase/compat/app');
        await import('firebase/compat/auth');
        const firebaseCompat = compat.default || compat;
        // Reuse existing app or initialize
        let appCompat;
        try {
            appCompat = firebaseCompat.app();
        } catch {
            appCompat = firebaseCompat.initializeApp(firebaseConfig);
        }
        return firebaseCompat.auth().signInAnonymously();
    }
};
