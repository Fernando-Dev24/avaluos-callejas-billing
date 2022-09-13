import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
   apiKey: "AIzaSyCxFjp7eDkAkLv68AlK84uJkPjhyjN9DkQ",
   authDomain: "facturas-callejas-app.firebaseapp.com",
   projectId: "facturas-callejas-app",
   storageBucket: "facturas-callejas-app.appspot.com",
   messagingSenderId: "977581036019",
   appId: "1:977581036019:web:de7b3df69c2ecaa8ed0286",
};

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };