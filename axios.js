const axios = require('axios'); // 引入套件

async function getAPI(url){
    await axios.get(url)
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