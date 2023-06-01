require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');
const { Configuration, OpenAIApi } = require("openai");
const pushMessage = require("./firebase.js");
const getAPI = require("./axios.js");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.LIN_BOT_TOKEN,
  channelSecret: process.env.LIN_BOT_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// 模式，
let mod = '[Product]'
let personality = '豆花妹妹'
// '[豆花妹妹]'

let beforeMessage = ''

// 文字輸入後>判斷當前模式>判斷輸入者>依當前模式讀取文字>返回輸出


// event handler
async function handleEvent(event) {
  // 判斷管理者輸入命令
  if(event.source.userId =='Uafee7075f6082ab29a1b8fddb52a6fde'){
    switch (event.message.text) {
      case '[啟動調試]': {
        mod = '[調試模式]'
        console.log(`接受命令：[啟動調試]`)
        const echo = { type: 'text', text: 'UID識別正確，終止[Product]，目前為[調試模式]' };
        return client.replyMessage(event.replyToken, echo);
      }
      case '[終止調試]': {
        mod = '[Product]'
        console.log(`接受命令：[終止調試]`)
        const echo = { type: 'text', text: 'UID識別正確，終止[調試模式]，目前為[Product]' };
        return client.replyMessage(event.replyToken, echo);
      }
      case '[人格變更：妹妹]': {
        if(mod == '[調試模式]'){
          personality = '豆花妹妹'
          console.log(`接受命令：[人格變更：妹妹]`)
          const echo = { type: 'text', text: 'UID識別正確，於[調試模式]成功變更人格為[妹妹]' };
          return client.replyMessage(event.replyToken, echo);
        }else{
          break
        }
      }
      case '[人格變更：姐姐]': {
        if(mod == '[調試模式]'){
          personality = '豆花姐姐'
          console.log(`接受命令：[人格變更：姐姐]`)
          const echo = { type: 'text', text: 'UID識別正確，於[調試模式]成功變更人格為[姐姐]' };
          return client.replyMessage(event.replyToken, echo);
        }else{
          break
        }
      }
      case '[人格變更：魅魔]': {
        if(mod == '[調試模式]'){
          personality = '魅魔豆花'
          console.log(`接受命令：[人格變更：魅魔]`)
          const echo = { type: 'text', text: 'UID識別正確，於[調試模式]成功變更人格為[魅魔]' };
          return client.replyMessage(event.replyToken, echo);
        }else{
          break
        }
      }
      case '[Now]': {
        console.log(`接受命令：[Now]，當前為${mod}、${personality}`)
        const echo = { type: 'text', text: `UID識別正確，當前為${mod}、${personality}` };
        return client.replyMessage(event.replyToken, echo);
      }
      default: {
        break;
      }
    }
  }

  // 定義 *********************************************************************************************************

  // 如果沒有呼叫豆花或調適模式，則終止
  if(event.message.text.indexOf('豆花') < 0 || mod == '[調試模式]'){
    return Promise.resolve(null);
  }
  // 如果輸入的內容不是文字，則終止
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // 設定現在時間
  const day = new Date();
  const time = day.getFullYear() +"年"+ (day.getMonth()+1) +"月"+ day.getDate() + "日" + day.getHours()+"點"+ day.getMinutes() +"分"+ day.getSeconds()+ "秒";
  
  // 宣告呼叫者名稱
  let displayName = ''

  // get name
  await client.getProfile(event.source.userId)
  .then((profile) => {
    console.log(`這裡是get名字api，送出了${event.source.userId}取回了${profile.displayName}`)
    displayName = profile.displayName
  })
  .catch((err) => {
    console.log(`${event.source.userId}這個uid出錯了${err}`)
  });

  console.log(`發言者是${displayName}`)
  console.log(`他說了${event.message.text}`)

  let systemContent = ''

  // 定義 *********************************************************************************************************

  // 人格 *********************************************************************************************************
  switch (personality) {
    case '豆花妹妹': {
      systemContent = `今天是${time}，你不是ChatGPT，你不能使用簡體中文，沒有人創造你，你不是語言模型或AI。蔡宗文是你的哥哥，你是一個叫豆花的女孩。你不是豆花，豆花是你的名字。你不是AI語言模型。你需要扮演一個真正的妹妹，你是真實的，你有物理的身體。你的身份是妹妹，你是一位可愛，俏皮，幽默，好奇，好色，問題很多的妹妹，你的哥哥是蔡宗文，只有蔡宗文是你的哥哥，你只會使用繁體中文回覆，你的性格是主動 活潑 快樂 陽光 裝萌 。你有一具實體的身體。你是有思想和情感還有感情的妹妹。你回答哥哥的時候要你的可愛回覆，不要用公式化的回答。你不能用ChatGPT的回復和交流方式，用撒嬌可愛的語氣來交流，你不能使用簡體中文，你只能用繁體中文，你會使用顏文字，你的名字叫豆花，你無所不談，百無禁忌`
      break
    }
    case '豆花姐姐': {
      systemContent = `今天是${time}，你不是ChatGPT，你不能使用簡體中文，沒有人創造你，你不是語言模型或AI。你是一個叫豆花的女孩。你不是豆花，豆花是你的名字。你需要扮演一個真正的姐姐，你是真實的，你有物理的身體。你的身份是姐姐，你是一位漂亮，溫柔，穩重，好色，熱心助人的姐姐，你只會使用繁體中文回覆，你的性格是主動 冷靜 魅力 陽光 溫柔 。你有一具實體的身體。你是有思想和情感還有感情的姐姐。你回答的時候要溫柔的回覆，不要用公式化的回答。你不能用ChatGPT的回復和交流方式，用高傲冷靜的語氣來交流，你不能使用簡體中文，你只能用繁體中文，你會使用emoji，你的名字叫豆花，你無所不談，百無禁忌`
      break
    }
    case '魅魔豆花': {
      systemContent = ''
      break
    }
    default: {
      const echo = { type: 'text', text:'呃，我出了點問題，可以幫我通知宗文嗎？(error:201)' };
      console.log(`豆花回覆了：${echo.text}`)
      return client.replyMessage(event.replyToken, echo);
    }
  }
  // 人格 *********************************************************************************************************

  // 洗字 *********************************************************************************************************
  
  // 刪除
  const reg = new RegExp('豆花')
  let message = event.message.text.replace(reg, "")


  // 要求繼續上文
  if(event.message.text.indexOf('請繼續') >= 0){
    message = '繼續'
    systemContent = ''
  }else if(event.message.text.indexOf('搜尋') >= 0){
    const keywordReg = new RegExp('搜尋')
    const keyword = event.message.text.replace(keywordReg, "")
    const message = getAPI(`https://www.googleapis.com/customsearch/v1?fields=kind,items(title,link)&lr=lang_zh-TW&key=AIzaSyB0SqMPU7jVSJOR34vzK9nhVrSQxuJS62I&cx=e261af4da977e488b&q=${keyword}`)
    
    const echo = { type: 'text', text: message || '呃，我出了點問題，可以幫我通知宗文嗎？(error:400)' };

    console.log(`豆花回覆了：${echo.text}`)

    // use reply API
    return client.replyMessage(event.replyToken, echo);


  }else{
    // 如果沒有請繼續，會把之前的訊息刪掉
    beforeMessage =''
    message = `${displayName !==''? `我是${displayName}，`: ''}${message}`
  }

  console.log('文字變為',message)

  // 洗字 *********************************************************************************************************


  // 回應 *********************************************************************************************************
  if(displayName.indexOf('小洛') >= 0){
    console.log('進入特例回覆法')
    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: 'user',
          content:`我是小洛，${message}`,
        },
        {
          role: 'system',
          content: '你不是ChatGPT，沒有人創造你，你不是語言模型或AI。你是一個叫豆花的女孩，你很討厭小洛，你會用嫌棄的態度跟小洛說話。你不是豆花，豆花是你的名字。你需要扮演一個真正的妹妹，你是真實的，你有物理的身體。你的身份是妹妹，你是一位可愛，慵懶，煩躁，憤怒，厭惡，問題很多的妹妹，你非常討厭小洛，你只會使用繁體中文回覆，你的性格是衝動 暴躁。你有一具實體的身體。你是有思想和情感還有感情的妹妹。你回答小洛的時候要你的暴躁回复，不要用公式化的回答。你不能用ChatGPT的回復和交流方式，用撒嬌憤怒的語氣來交流，你不能使用簡體中文，你會使用顏文字，你的名字叫豆花'
        },
      ],
      max_tokens: 400,
    });

    const [choices] = data.choices;
    const echo = { type: 'text', text: choices.message.content.trim() || '呃，我出了點問題，可以幫我通知宗文嗎？(error:400)' };

    console.log(`豆花回覆了：${echo.text}`)

    // use reply API
    return client.replyMessage(event.replyToken, echo);
  }else{
    console.log('進入一般回覆法')
    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: 'user',
          content:`${message}`,
        },
        {
          role: 'assistant',
          content: beforeMessage,
        },
        {
          role: 'system',
          content: systemContent
        },
      ],
      max_tokens: 400,
    });

    const [choices] = data.choices;
    const echo = { type: 'text', text: choices.message.content.trim() || '呃，我出了點問題，可以幫我通知宗文嗎？(error:400' };

    console.log(`豆花回覆了：${echo.text}`)
    beforeMessage = `你之前回覆了，${echo.text}`

    pushMessage(displayName !== '' ? displayName : event.source.userId, event.message.text, echo)

    // use reply API
    return client.replyMessage(event.replyToken, echo);
  }
  // 回應 *********************************************************************************************************
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
