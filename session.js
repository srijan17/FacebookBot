var sessions = {}
var findOrCreateSession = function (fbid) {
  var sessionId

  // DOES USER SESSION ALREADY EXIST?
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // YUP
      sessionId = k
    }
  })

  // No session so we will create one
  if (!sessionId) {
    sessionId = new Date().toISOString()
    sessions[sessionId] = {
      fbid: fbid,
      context: {
      	sessionId:sessionId,
        _fbid_: fbid
      }
    }
  }

  return sessionId
}

var setsession = function(sessionId,context)
{
	console.log('here')
	//sessions[sessionId].context=context
}

module.exports = {
sessions:sessions,
findOrCreateSession:findOrCreateSession

}

