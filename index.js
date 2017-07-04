
var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')


var Config = require('./config')
var FB = require('./facebook')
var Bot = require('./bot')

var app = express()
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

//set up server
app.listen(app.get('port'), function () {
  console.log('app listening to port', app.get('port'))
})

app.get('/',function(req,res){
res.send("Hi server is running")
})

app.get('/webhooks', function (req, res) {
  if (req.query['hub.verify_token'] === Config.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge'])
  }
  //set welcome screen
  res.send('Error, wrong token')
})


app.post('/webhooks', function (req, res) {
  console.log("webhooks post hit")

  var entry = FB.getMessageEntry(req.body)
  // IS THE ENTRY A VALID MESSAGE?
  if (entry && entry.message) {    if (entry.message.attachments) {
      // NOT SMART ENOUGH FOR ATTACHMENTS YET
      FB.newMessage(entry.sender.id, "That's interesting!")
    } else {
      // SEND TO BOT FOR PROCESSING
      Bot.read(entry.sender.id, entry.message.text, function (sender, reply) {
        FB.newMessage(sender, reply)
      })
    }
  }

  res.sendStatus(200)
})