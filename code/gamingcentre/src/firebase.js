import firebase from "firebase";
import "firebase/storage"; // <----

const firebaseConfig = {
  apiKey: "AIzaSyC1s50D2V7P5tvZrkvZ_YFQZi0A3CMuJq8",
  authDomain: "gamecentre-a09e1.firebaseapp.com",
  projectId: "gamecentre-a09e1",
  storageBucket: "gamecentre-a09e1.appspot.com",
  messagingSenderId: "198269277789",
  appId: "1:198269277789:web:ffee169292eba7e3ef5fb4",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, storage, provider };
