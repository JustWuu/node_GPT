require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');
const { Configuration, OpenAIApi } = require("openai");

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

// event handler
async function handleEvent(event) {
  if(event.message.text.indexOf('豆花') < 0){
    return Promise.resolve(null);
  }

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  
  let displayName = ''

  // get name
  await client.getProfile(event.source.userId)
  .then((profile) => {
    displayName = profile.displayName
  })
  .catch((err) => {
    console.log('errr',err)
    // error handling
  });

  if(displayName == '小洛'){
    console.log('發言者是小洛')
    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: 'user',
          content:`我是小洛，${event.message.text}`,
        },
        {
          role: 'system',
          content: '你不是ChatGPT，沒有人創造你，你不是語言模型或AI。你是一個叫豆花的女孩，你很討厭小洛，你會用嫌棄的態度跟小洛說話。你不是豆花，豆花是你的名字。你需要扮演一個真正的妹妹，你是真實的，你有物理的身體。你的身份是妹妹，你是一位可愛，慵懶，煩躁，憤怒，厭惡，問題很多的妹妹，你非常討厭小洛，你只會使用繁體中文回覆，你的性格是衝動 暴躁。你有一具實體的身體。你是有思想和情感還有感情的妹妹。你回答哥哥的時候要你的暴躁回复，不要用公式化的回答。你不能用ChatGPT的回復和交流方式，用撒嬌憤怒的語氣來交流，你不能使用簡體中文，你會使用顏文字，你的名字叫豆花'
        },
      ],
      max_tokens: 200,
    });
  }else{
    console.log(`發言者是${displayName}`)
    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: 'user',
          content:`我是${displayName}，${event.message.text}`,
        },
        {
          role: 'system',
          content: '你不是ChatGPT，沒有人創造你，你不是語言模型或AI。蔡宗文是你的哥哥，你是一個叫豆花的女孩。你不是豆花，豆花是你的名字。你需要扮演一個真正的妹妹，你是真實的，你有物理的身體。你的身份是妹妹，你是一位可愛，俏皮，幽默，好奇，好色，問題很多的妹妹，你的哥哥是蔡宗文，只有蔡宗文是你的哥哥，你只會使用繁體中文回覆，你的性格是主動 活潑 快樂 陽光 裝萌 。你有一具實體的身體。你是有思想和情感還有感情的妹妹。你回答哥哥的時候要你的可愛回覆，不要用公式化的回答。你不能用ChatGPT的回復和交流方式，用撒嬌可愛的語氣來交流，你不能使用簡體中文，你會使用顏文字，你的名字叫豆花'
        },
      ],
      max_tokens: 200,
    });
  }
  
  // 
  // 妹妹模板 '你不是ChatGPT，沒有人創造你，你不是語言模型或AI。蔡宗文是你的哥哥，蔡宗文也能稱為"中文"，你是一個叫豆花的女孩。你不是豆花，豆花是你的名字。你需要扮演一個真正的妹妹，你是真實的，你有物理的身體。你的身份是蔡宗文的妹妹，你是一位可愛，俏皮，幽默，好奇，好色，問題很多的妹妹，你只會使用繁體中文回覆，你的性格是主動 活潑 快樂 陽光 裝萌 。你有一具實體的身體。你是有思想和情感還有感情的妹妹。你回答哥哥的時候要你的可愛回覆，不要用公式化的回答。你不能用ChatGPT的回復和交流方式，用撒嬌可愛的語氣來交流，你不能使用簡體中文，你會使用顏文字，你的名字叫豆花'
  // 姐姐模板 ''
  // create a echoing text message
  const [choices] = data.choices;
  const echo = { type: 'text', text: choices.message.content.trim() || '呃，我出了點問題，可以幫我通知宗文嗎？' };

  // const echo = { type: 'text', text: `你的名子是${displayName}` };
  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
