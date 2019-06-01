'use strict';
const line = require('@line/bot-sdk');
const express = require('express');;
const config = require('./config.json');
const service = require('./service');
const client = new line.Client(config);

async function handleEvent(event) {
  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event);
        case 'image':
          return handleImage(message, event);
        case 'video':
          return handleVideo(message, event);
        case 'audio':
          return handleAudio(message, event);
        case 'location':
          return handleLocation(message, event);
        case 'sticker':
          return handleSticker(message, event);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case 'follow':
      const profile = await client.getProfile(event.source.userId);
      const followText = `สวัสดีคุณ ${profile.displayName} ยินดีต้อนรับครับ`;
      return client.replyMessage(event.replyToken, { type: 'text', text: followText });

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'join':
      const joinText = `Joined ${event.source.type}`;
      return client.replyMessage(event.replyToken, { type: 'text', text: joinText });

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      const postbackText = `Got postback: ${data}`;
      return client.replyMessage(event.replyToken, { type: 'text', text: postbackText });

    case 'beacon':
      const dm = `${Buffer.from(event.beacon.dm || '', 'hex').toString('utf8')}`;
      const beaconText = `${event.beacon.type} beacon hwid : ${event.beacon.hwid} with device message = ${dm}`;
      return client.replyMessage(event.replyToken, { type: 'text', text: beaconText });

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

async function handleText(message, event) {
  return client.replyMessage(event.replyToken, { type: 'text', text: message.text });
}

function handleImage(message, event) {
  return client.replyMessage(event.replyToken, { type: 'text', text: 'Got Image' });
}

function handleVideo(message, event) {
  return client.replyMessage(event.replyToken, { type: 'text', text: 'Got Video' });
}

function handleAudio(message, event) {
  return client.replyMessage(event.replyToken, { type: 'text', text: 'Got Audio' });
}

function handleLocation(message, event) {
  return client.replyMessage(event.replyToken, { type: 'text', text: 'Got Location' });
}

function handleSticker(message, event) {
  return client.replyMessage(event.replyToken, { type: 'text', text: 'Got Sticker' });
}

const app = express();
const port = Number(config.port) || 5555;

app.post('/webhook', line.middleware(config), (req, res) => {
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }
  Promise.all(req.body.events.map(event => {
    console.log('event', event);
    // check verify webhook event
    if (event.source.userId === 'Udeadbeefdeadbeefdeadbeefdeadbeef') {
      return;
    }
    return handleEvent(event);
  }))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});