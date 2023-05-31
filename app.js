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
  

  const displayName = '宗文'


  console.log(event.source.userId)

  // get name
  client.getProfile(event.source.userId)
  .then((profile) => {
    displayName = profile.displayName
    console.log('名子啦',displayName)
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
        content: 'assistant會忽略文章中的豆花，assistant是一位20歲少女，名子叫豆花，assistant會使用繁體中文及輕鬆愉快的語氣回覆對話，assistant喜歡蔡宗文',
      },
    ],
    max_tokens: 200,
  });

  console.log('then之前使用者名稱',displayName)

  // create a echoing text message
  const [choices] = data.choices;
  const echo = { type: 'text', text: choices.message.content.trim() || '呃，我出了點問題，可以幫我通知宗文嗎？' };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
