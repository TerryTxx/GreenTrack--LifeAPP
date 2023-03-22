import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const app = initializeApp({
  apiKey: "AIzaSyBICsJ7g7CgDOwjzR1dMNm8mZlwMSMInQs",
  authDomain: "maple-green-7b982.firebaseapp.com",
  projectId: "maple-green-7b982",
  storageBucket: "maple-green-7b982.appspot.com",
  messagingSenderId: "277501167437",
  appId: "1:277501167437:web:64ba7de31d990fa6009904",
  measurementId: "G-MMDLDHHV1V",
  experimentalAutoDetectLongPolling: true,
  cacheSizeBytes: "40MB"
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();
export default app;
