	'use strict'

var request = require('request')
var Config = require('./config')

var newRequest = request.defaults({
	uri: 'https://graph.facebook.com/v2.6/me/messages',
	method: 'POST',
	json: true,
	qs: {
		access_token: Config.FB_PAGE_TOKEN
	},
	headers: {
		'Content-Type': 'application/json'
	},
})

var getDetails=function (recipientId,cb){
	var userdetails
	  request("https://graph.facebook.com/v2.6/"+recipientId+"?access_token="+Config.FB_PAGE_TOKEN,function(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log("hurray\n\n") 
        userdetails=JSON.parse(body)
        cb(userdetails)
    }
    else
    {
      console.log("Error.Couldnt fetch User Details")
      cb({firstname:"",lastname:""})
    }


})

}
var newMessage = function (recipientId, msg, messagetype, cb) {
	var opts = {
		form: {
			recipient: {
				id: recipientId
			},
		}
	}

	switch(messagetype)
	{
		case "image":var message = {
			attachment: {
				"type": "image",
				"payload": {
					"url": msg
				}
			}
		}
		break
		case "button":var message={ "attachment":{
								      "type":"template",
								      "payload":{
								        "template_type":"button",
								        "text":msg.text,
								        "buttons":[
								          {
								            "type":"web_url",
								            "url":msg.url,
								            "title":"Show "
								          }
								        ]
								      }
							    	}
								}
	
					break
		case "generic":var message={
								    "attachment":{
								      "type":"template",
								      "payload":{
								        "template_type":"generic",
								        "elements":[
								           
								        ]
								      }
								    }
								  }


								  msg.listelement.forEach(function(item,index){

								  	var temp={
								            "title":item.Title,
								            "image_url":item.img_url,
								            "subtitle":item.subtitle,
								            "default_action": {
								              "type": "web_url",
								              "url": item.defaulturl,
								              "messenger_extensions": false,
								              "webview_height_ratio": "tall"
								              },
								            "buttons":[
								              {
								                "type":"web_url",
								                "url":"https://www.google.com",
								                "title":"View Website"
								              }              
								            ]      
								          }
								          message.attachment.payload.elements.push(temp)
								  })
									// {
								 //    "attachment":{
								 //      "type":"template",
								 //      "payload":{
								 //        "template_type":"generic",
								 //        "elements":[
								 //           {
								 //            "title":msg.title,
								 //            "image_url":msg.img_url,
								 //            "subtitle":msg.subtitle,
								 //            "default_action": {
								 //              "type": "web_url",
								 //              "url": msg.defaulturl,
								 //              "messenger_extensions": true,
								 //              "webview_height_ratio": "tall"
								 //            },
								 //            "buttons":[
								 //              {
								 //                "type":"web_url",
								 //                "url":"https://petersfancybrownhats.com",
								 //                "title":"View Website"
								 //              },{
								 //                "type":"postback",
								 //                "title":"Start Chatting",
								 //                "payload":"DEVELOPER_DEFINED_PAYLOAD"
								 //              }              
								 //            ]      
								 //          }
								 //        ]
								 //      }
								 //    }}
								 
								    break
		case "List": console.log("in list")
						var message ={
								    "attachment":{
								      "type":"template",
								      "payload":{
								        "template_type":"list",
								        "elements":[
								          
								        ]
								      }
								    }
								  }

								  msg.listelement.forEach(function(item,index){
								  	 var temp = {
								            "title":item.Title,
								            "image_url":item.img_url,
								            "subtitle":item.subtitle,
								            "default_action": {
								              "type": "web_url",
								              "url": item.defaulturl,
								              "messenger_extensions": false,
								              "webview_height_ratio": "tall"
								              },
								            "buttons":[
								              {
								                "type":"web_url",
								                "url":"https://www.google.com",
								                "title":"View Website"
								              }              
								            ]      
								          }
								     message.attachment.payload.elements.push(temp)

								  })
								  break
		case "quickreplies": var message = {text:msg.text,
											quick_replies:[]
							}
							msg.quickreplies.forEach(function(item,index){
								var temp={
								       "content_type": "text",
      								  "title": item.title,
      								  "payload":item.title }
								      
								message.quick_replies.push(temp)
							})
							
							break

		case "typing":var message = null
						break

		default:
				var message = {
				text: msg.text,
				quick_replies:[]}
				if(msg.quickreplies)
				{
				msg.quickreplies.forEach(function(item,index){
								var temp={
								       "content_type": "text",
      								  "title": item,
      								  "payload":item }
								      
								message.quick_replies.push(temp)
							})}
	

}



	if(message)
	{
	opts.form.message = message
}
else
{
	opts.form.sender_action="typing_on"
}

	// if(message.senderaction)
	// {
	// 	opts.form.sender_action=message.senderaction
	// }

		newRequest(opts, function (err, resp, data) {
		if (cb) {
			cb(err || data.error && data.error.message, data)
		}
	})
}

var getMessageEntry = function (body) {
	var val = body.object === 'page' &&
						body.entry &&	 
						Array.isArray(body.entry) &&
						body.entry.length > 0 &&
						body.entry[0] &&
						body.entry[0].messaging &&
						Array.isArray(body.entry[0].messaging) &&
						body.entry[0].messaging.length > 0 &&
						body.entry[0].messaging[0]
	return val || null
}

module.exports = {
	getDetails:getDetails,
	newRequest: newRequest,
	newMessage: newMessage,
	getMessageEntry: getMessageEntry,
}
