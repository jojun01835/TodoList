import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQgtXGivMmX22UPE1MZmOOg76bdG9L8B8",
  authDomain: "todolist-842a9.firebaseapp.com",
  projectId: "todolist-842a9",
  storageBucket: "todolist-842a9.appspot.com",
  messagingSenderId: "115632554354",
  appId: "1:115632554354:web:b944ca9f87164bf2351deb",
  measurementId: "G-Z9928EMCNT",
};

const app = initializeApp(firebaseConfig);

// Firestore 인스턴스 생성
const firestore = getFirestore(app);

export default firestore;
