import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBRMvIqcnEgNXDWdqzQY7z6iJOHN7iNStg",
    authDomain: "instagram-4.firebaseapp.com",
    databaseURL: "https://instagram-4-default-rtdb.firebaseio.com",
    projectId: "instagram-4",
    storageBucket: "instagram-4.appspot.com",
    messagingSenderId: "200024264792",
    appId: "1:200024264792:web:e0349d2fa5441cf80e7a2d"
  };
  

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

const postDb = db.collection('posts')
const userDb = db.collection('users')

export { db, auth, storage, postDb, userDb };