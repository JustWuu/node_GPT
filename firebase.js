// let firebase = require('firebase'); //引入firebase
const firebase = require("firebase/app");

const firebaseConfig = {
    apiKey:process.env.FB_API_KEY,
    authDomain:process.env.FB_AUTH_DOMAIN,
    // databaseURL: process.env.FB_DATABASE_URL,
    projectId:process.env.FB_PROJECT_ID,
    storageBucket:process.env.FB_STORAGE_BUCKET,
    messagingSenderId:process.env.FB_MESSAGING_SENDER_ID,
    appId:process.env.FB_APP_ID,
};
firebase.initializeApp(firebaseConfig);
require('firebase/database')
const database = firebase.database().ref('ChatGPT/')


// const firebaseConfig = {
//     apiKey:process.env.FB_API_KEY,
//     authDomain:process.env.FB_AUTH_DOMAIN,
//     projectId:process.env.FB_PROJECT_ID,
//     storageBucket:process.env.FB_STORAGE_BUCKET,
//     messagingSenderId:process.env.FB_MESSAGING_SENDER_ID,
//     appId:process.env.FB_APP_ID,
// };

// firebase.initializeApp(firebaseConfig); //Initialize Firebase


