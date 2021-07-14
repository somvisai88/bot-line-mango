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
        //console.log("Destination User ID: " + JSON.stringify(req));
        //console.log("=======CHECK=======: " + req.body.events[0].source.groupId);
        //client.pushMessage('Ca83e09bb6adda01520a67c1888f52780', {type:'text',text: message.toString()});
        
        //client.leaveGroup(req.body.events[0].source.groupId.toString()); ===> OK
         /*client.getGroupMemberIds(req.body.events[0].source.groupId.toString())
        .then((ids) => {
            ids.forEach((id) => console.log(id));
            })
        .catch((err) => {
            // error handling
        });*/
        //client.pushMessage('Ca83e09bb6adda01520a67c1888f52780', {type:'text',text: 'Hello Mr.callMe'});
        client.pushMessage('C4671018fe7f2399f85112949a4db5057', {type:'text',text: message.toString()});
        //client.pushMessage('Cc63b5e76eb484ba40949683094cdf692', {type:'text',text: 'Hello Mr.Visai'});
       
});

app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => {
      res.json(result);
      //var message = req.param('message');
      //console.log("Destination User ID: " + JSON.stringify(req.body.events));
      client.pushMessage('Ca83e09bb6adda01520a67c1888f52780', {type:'text',text: ''});
    })
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
  //const echo = { type: 'text', text: event.message.text };

  // use reply API
 // return client.replyMessage(event.replyToken, echo);
}

//-------------------WIALON REMOTE API
const axios1 = require("axios");
var eid ="";
axios1
  .get(
    `https://hst-api.wialon.com/wialon/ajax.html?svc=token/login&params={"token":"984d9fe52eae37eff6feb497a0fefc539AFE330D44C2849275CFE3A09C3EB820D1AFE214"}`
  )
  .then((response) => {
    console.log("ip:" + response.data.host);
    
    eid = response.data.eid;
    console.log(eid);
    //var url = `https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&sid=${eid}&params={%22spec%22:{%22itemsType%22:%22avl_unit%22,%22propName%22:%22%22,%22propValueMask%22:%22%22,%22sortType%22:%22%22,%22propType%22:%22%22,%22or_logic%22:false},%22force%22:1,%22flags%22:1025,%22from%22:0,%22to%22:0}`;
    //console.log(decodeURI(url));
    //console.log("usuario:" + response.data.user.nm);
    //axios1.get(url).then((response) => {
    //  console.log(response.data.items);
    //});

    //------------------- Add Units in Events Management------------
    var urlEvents = `https://hst-api.wialon.com/wialon/ajax.html?svc=core/update_data_flags&sid=${eid}&params={%22spec%22:[{%22type%22:%22type%22,%22data%22:%22avl_resource%22,%22flags%22:1,%22mode%22:0}]}`;
    console.log(decodeURI(urlEvents));
    axios1.get(urlEvents).then((response) => {
    console.log(response.data);
      
    });

    
  })
  .catch((error) => {
    console.log(error);
  });
//------------------------------------

//----------------- CHECK WIALON UPDATE EVERY 15 SECONDS
function intervalFunc() {
  var urlWialonUpdate = `https://hst-api.wialon.com/avl_evts?sid=${eid}`;
  console.log(decodeURI(urlWialonUpdate));
    axios1.get(urlWialonUpdate).then((response) => {
      console.log(response.data);
    });
}

//setInterval(intervalFunc, 5000);
//------------------------------------------------------

// listen on port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});