import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBub1ROZCogmfW9ZULjc0oSaJ650imDuH4",
  authDomain: "milk-tracker-a9345.firebaseapp.com",
  projectId: "milk-tracker-a9345",
  storageBucket: "milk-tracker-a9345.firebasestorage.app",
  messagingSenderId: "761048594898",
  appId: "1:761048594898:web:db95c2fdf508a5a2eab00b",
  measurementId: "G-4VLSSC8332"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
