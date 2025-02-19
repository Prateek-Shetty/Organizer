import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDTkow58gpzDkZJP2sZuaGzsFJuAVDrfFQ",
  authDomain: "organizer-7e3d9.firebaseapp.com",
  projectId: "organizer-7e3d9",
  storageBucket: "organizer-7e3d9.appspot.com",
  messagingSenderId: "172212236105",
  appId: "1:172212236105:web:effec92c2cd52bc2bef498",
  measurementId: "G-VJ7S44JV0L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
