'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: 'jJimluP5stlRMhYTTL/H6yanvfzc7onViAhFrahUhT5E2FTMpDZVOBTHznGVmwyd1Wshhuqh2lD+vYfBfbO8c1GS9MFcI8VaoyF6NeQuS+GBFlSU1hjVcFN6EJDZcOZgBgBzfwpJG7vxCRxdasRhgAdB04t89/1O/w1cDnyilFU=',
  channelSecret: '4361e408dfc289fd414684b3269f5e9a',
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callMe',  function(req, res) {
        var message = req.param('message');
        //console.log("Destination User ID: " + JSON.stringify(req.body.events[0]));
        //console.log("=======CHECK=======: " + req.body.events[0].source.groupId);
        //console.log("=======CLIENT======: " + client.;
        
        //client.leaveGroup(req.body.events[0].source.groupId.toString()); ===> OK
         /*client.getGroupMemberIds(req.body.events[0].source.groupId.toString())
        .then((ids) => {
            ids.forEach((id) => console.log(id));
            })
        .catch((err) => {
            // error handling
        });*/

        //client.pushMessage('Cc63b5e76eb484ba40949683094cdf692', {type:'text',text: message.toString()});
        client.pushMessage('Cc63b5e76eb484ba40949683094cdf692', {type:'text',text: 'Hello Mr.Visai'});
       
});

app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) =>  res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {    
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  

  return client.replyMessage(event.replyToken, echo);
}



// listen on port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});