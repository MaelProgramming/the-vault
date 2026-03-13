import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // L'élément clé

const firebaseConfig = {
  apiKey: "AIzaSyCrNgj-CpyTQC66avNIv_VlWH4iEZxHR0M",
  authDomain: "the-vault-2025.firebaseapp.com",
  projectId: "the-vault-2025",
  storageBucket: "the-vault-2025.firebasestorage.app",
  messagingSenderId: "700482305043",
  appId: "1:700482305043:web:919c4d437ff1ef5aa093e6",
  measurementId: "G-J95Z3JRZ3E"
};

// Initialisation
const app = initializeApp(firebaseConfig);

// Les instances exportées
export const auth = getAuth(app);

export default app;