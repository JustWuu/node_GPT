const firebase = require("firebase/app");
const databse = require('firebase/database')

const firebaseConfig = {
    apiKey:process.env.FB_API_KEY,
    authDomain:process.env.FB_AUTH_DOMAIN,
    databaseURL: 'https://vite-base-default-rtdb.firebaseio.com/',
    projectId:process.env.FB_PROJECT_ID,
    storageBucket:process.env.FB_STORAGE_BUCKET,
    messagingSenderId:process.env.FB_MESSAGING_SENDER_ID,
    appId:process.env.FB_APP_ID,
};
firebase.initializeApp(firebaseConfig);

const data = databse.getDatabase()

function pushMessage(name, message, echo){
  const key = databse.push(databse.ref(data, 'GPT')).key;
  databse.update(databse.ref(data, `GPT/${key}`),{
    lineName:name,
    message:message,
    echo:echo,
  }) 
}

function pushMoney(allMoney, money){
  databse.update(databse.ref(data, `money`),{
    allMoney:allMoney,
    nowMoney:money,
  })
}

function getMoney(){
  databse.get(databse.ref(data, `money/`)).then((snapshot) => {
    if (snapshot.exists()) {
        console.log(`${this.child} database get ok`)
        return snapshot.val();
    } else {
        throw `查無資料`
    }
    })
}

module.exports = {pushMessage, pushMoney, getMoney}

