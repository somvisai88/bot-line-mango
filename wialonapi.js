'use strict';
const express = require('express');
const wialon = require('./wialon.node.js').wialon;

const app = express();
// Print message to log
function msg(text) { console.log(text); }

function init() { // Execute after login succeed
	var sess = wialon.core.Session.getInstance(); // get instance of current Session
	// flags to specify what kind of data should be returned
	var flags = wialon.item.Item.dataFlag.base | wialon.item.Resource.dataFlag.base | wialon.item.Item.dataFlag.messages | wialon.item.Resource.dataFlag.notifications;

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
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

function showData(event) {
	var data = event.getData(); // get data from event
		
	if (data.tp && data.tp == "evt") {
		console.log(" " + data.et); // add row with data to info-table
		console.log("Count " + eventCount); // get notification count
    eventCount = eventCount + 1;	
    
    
		xhr.open("POST","https://api.telegram.org/bot1596286707:AAEczFpw7ou6kkn3XlVfZt3Oa5cc5d029UU/sendMessage?chat_id=-573736883&text="+ encodeURI(data.et), true);
		xhr.send();
	}
  
}

wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com"); // init session
// For more info about how to generate token check
// http://sdk.wialon.com/playground/demo/app_auth_token
wialon.core.Session.getInstance().loginToken("984d9fe52eae37eff6feb497a0fefc53C6D18967A117E57BE1BD259AA0B76F2AF0F653AE", "", // try to login
	function (code) { // login callback
	    // if error code - print error message
		if (code){ msg(wialon.core.Errors.getErrorText(code)); return; }
		msg("Logged successfully"); init(); // when login suceed then run init() function
});

// listen on port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});