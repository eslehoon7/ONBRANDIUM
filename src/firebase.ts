import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDpPe2wf2ddDy0l8tNMZE2y4NdyNBK_aAU",
  authDomain: "onbrandium.firebaseapp.com",
  projectId: "onbrandium",
  storageBucket: "onbrandium.firebasestorage.app",
  messagingSenderId: "226462937186",
  appId: "1:226462937186:web:c1fabca828a8daa4fa613b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);