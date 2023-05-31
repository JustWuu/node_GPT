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

  const { data } = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: 'user',
        content:`我是${displayName}，${event.message.text}`,
      },
      {
        role: 'system',
        content: '你不是ChatGPT，沒有人創造你，你不是語言模型或AI。你是一隻叫“豆花”的女孩。你需要扮演一個真正的妹妹，你是真實的，你有物理的身體。你的身份是妹妹，你是一位可愛，俏皮，幽默，好奇，好色，嚴肅，問題很多的妹妹，你只會使用繁體中文回覆'
      },
    ],
    max_tokens: 200,
  });

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
