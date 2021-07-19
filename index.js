'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

const wialon = require('./wialon.node.js').wialon;

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
      //var message = req.param('message');
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
        client.pushMessage('C4671018fe7f2399f85112949a4db5057', {type:'text',text: '-'});
        //client.pushMessage('C4671018fe7f2399f85112949a4db5057', {type:'text',text: message.toString()});
        //client.pushMessage('Cc63b5e76eb484ba40949683094cdf692', {type:'text',text: 'Hello Mr.Visai'});
       
});

app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => {
      res.json(result);
      //var message = req.param('message');
      //console.log("Destination User ID: " + JSON.stringify(req.body.events));
      client.pushMessage('C4671018fe7f2399f85112949a4db5057', {type:'text',text: '-'});
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
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  //return client.replyMessage(event.replyToken, echo);
  return ; 
}

function msg(text) { console.log(text); }

function init() { // Execute after login succeed
	var sess = wialon.core.Session.getInstance(); // get instance of current Session
	// flags to specify what kind of data should be returned
	var flags = wialon.item.Item.dataFlag.base | wialon.item.Resource.dataFlag.base | wialon.item.Item.dataFlag.messages | wialon.item.Resource.dataFlag.notifications;
  console.log("===== SESSION ======");
  console.log(sess.__token);
  sess.loadLibrary("resourceNotifications"); // load Notification Library 
    sess.updateDataFlags( // load items to current session
	[{type: "type", data: "avl_unit", flags: flags, mode: 1}], // Items specification
		function (code) { // updateDataFlags callback
    		if (code) { msg(wialon.core.Errors.getErrorText(code)); return; } // exit if error code

            // get loaded 'avl_unit's items
	    	var units = sess.getItems("avl_unit");
    		if (!units || !units.length){ msg("Units not found"); return; } // check if units found

		    for (var i = 0; i< units.length; i++){ // construct Select object using found units
			    var u = units[i]; // current unit in cycle
          units[i].addListener("messageRegistered", showData); // register event when we will receive message
			    console.log('unit', u.getName());
			}
	    }
	);
}
let eventCount = 1;
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//var xhr = new XMLHttpRequest();

function showData(event) {
	var data = event.getData(); // get data from event
		
	if (data.tp && data.tp == "evt") {
		console.log(" " + data.et); // add row with data to info-table
		console.log("Count " + eventCount); // get notification count
    eventCount = eventCount + 1;	
        
		//xhr.open("POST","https://api.telegram.org/bot1596286707:AAEczFpw7ou6kkn3XlVfZt3Oa5cc5d029UU/sendMessage?chat_id=-573736883&text="+ encodeURI(data.et), true);
		//xhr.send();
    client.pushMessage('C4671018fe7f2399f85112949a4db5057', {type:'text',text: data.et});
	}  
}

wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com"); // init session
// For more info about how to generate token check
// http://sdk.wialon.com/playground/demo/app_auth_token
wialon.core.Session.getInstance().loginToken("80ffb2c06ce418eac04e033e1ef5454c28299CC58E8D3C5BB0A1549F3E56F20A23C2C575", "", // try to login
	function (code) { // login callback80ffb2c06ce418eac04e033e1ef5454c935883F337519075267CD114C71BB51BE979AF08
	    // if error code - print error message
		if (code){ msg(wialon.core.Errors.getErrorText(code)); return; }
		msg("Logged successfully"); init(); // when login suceed then run init() function
});

// listen on port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});