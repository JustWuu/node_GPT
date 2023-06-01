const axios = require('axios'); // 引入套件

// 這個只針對google的搜尋api

async function getAPI(url){
    await axios.get(url)
    .then((response) => { 
        // 處理成功後要做的事
        return response.data.items
    })
    .catch((error) => {
        // 發生意外地處理
        return error
    })
}

module.exports = getAPI