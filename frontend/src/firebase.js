// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "personal-blog-website-8511a.firebaseapp.com",
  projectId: "personal-blog-website-8511a",
  storageBucket: "personal-blog-website-8511a.appspot.com",
  messagingSenderId: "965224142595",
  appId: "1:965224142595:web:573f4db538adcb68773b36",
  measurementId: "G-Q478103SK3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);