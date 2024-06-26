require('dotenv').config();

const line = require('@line/bot-sdk');
const express = require('express');
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

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // if(event.message.text.indexOf('豆花') < 0){
  //   return Promise.resolve(null);
  // }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
      role: 'user',
      content: event.message.text,
      },
      // {
      //   role: 'system',
      //   content: '你好，我是機器人',
      // },
    ],
    max_tokens: 200,
  });

  // create a echoing text message
  const echo = { type: 'text', text: choices.message.content.trim() || '抱歉，我沒有話可說了。' };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});