const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');


const firebaseConfig = {
  apiKey: "AIzaSyCNG87or1Wu0g0UW8f19MVmWwGUj4bk8UU",
  authDomain: "capp-6a8b5.firebaseapp.com",
  projectId: "capp-6a8b5",
  storageBucket: "capp-6a8b5.appspot.com",
  messagingSenderId: "785224452873",
  appId: "1:785224452873:web:d5bbc054da9deec67c21d8",
  measurementId: "G-PJLCFFJLLD"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { app,storage, ref, uploadBytes, getDownloadURL };