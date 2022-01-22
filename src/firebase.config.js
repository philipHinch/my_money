import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDnjqg6jvxyz7oDFx4saq-mRFZujBLLMOQ",
    authDomain: "mymoney-3d96a.firebaseapp.com",
    projectId: "mymoney-3d96a",
    storageBucket: "mymoney-3d96a.appspot.com",
    messagingSenderId: "405513662883",
    appId: "1:405513662883:web:467524a5263e0a2ec9aa16"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore()