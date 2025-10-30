import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCOCwDu-7dm1_70U_gYzp8WI1qVipoKu8I",
  authDomain: "modified-talon-476112-k3.firebaseapp.com",
  projectId: "modified-talon-476112-k3",
  storageBucket: "modified-talon-476112-k3.appspot.com",
  messagingSenderId: "693413122125",
  appId: "1:693413122125:web:d3f2e0f6a642ac704ccc04",
  measurementId: "G-DDNLPP5ZZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Only initialize Analytics in a browser environment
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };
