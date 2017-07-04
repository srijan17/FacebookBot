'use strict'

var Config = require('./config')
var wit = require('./wit-actions').getWit()
var session = require('./session')

// LETS SAVE USER SESSIONS





var read = function (sender, message, reply) {
	if (message === 'hello') {
		// Let's reply back hello
		console.log("I entered read")
		message = 'Hello There!'

		reply(sender, message)
	} else {
		var sessionId = session.findOrCreateSession(sender)
		wit.runActions(
			sessionId, // the user's current session by id
			message,  // the user's message
			session.sessions[sessionId].context)
		
	}
}





module.exports = {
	
	
	read: read
}