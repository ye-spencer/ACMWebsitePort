// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSyFrdpgHmHKHCIgbdXJiOkX2TOvDlkKE",
  authDomain: "acm-website-25a8a.firebaseapp.com",
  projectId: "acm-website-25a8a",
  storageBucket: "acm-website-25a8a.firebasestorage.app",
  messagingSenderId: "231551202058",
  appId: "1:231551202058:web:b3c0182f283fa6068280f3",
  measurementId: "G-W01JXMQ1JK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);