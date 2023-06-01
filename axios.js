const { async } = require('@firebase/util');
const axios = require('axios'); // 引入套件

async function getAPI(url){
    await axios.get('url/users')
    .then(function (response) { 
        // 處理成功後要做的事
        console.log(response);
        return response
    })
    .catch(function (error) {
        // 發生意外地處理
        console.log(error);
        return error
    })
}


module.exports = getAPI