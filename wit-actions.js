'use strict'

var Config= require('./config')
var FB = require('./facebook')
var Wit = require('node-wit').Wit
var request = require('request')
var session = require('./session')


var firstEntityValue = function (entities, entity) {
	var val = entities && entities[entity] &&
		Array.isArray(entities[entity]) &&
		entities[entity].length > 0 &&
		entities[entity][0].value

	if (!val) {
		return null
	}
	return typeof val === 'object' ? val.value : val
}


var actions = {
	send(request, response) {
    const {sessionId, context, entities} = request
    // console.log(context)
    // console.log("\n\n")
    // console.log(entities)
    const {text, quickreplies} = response
    console.log('sending...', JSON.stringify(response))
			FB.newMessage(context._fbid_, response)
	
  }, 
  greeting({context,entities})
  { console.log("in greeting")
   delete context.yes
    delete context.no
     delete context.Trains
    delete context.NoofTrains
    delete context.NoTrains
    delete context.source
    delete context.missingsource
    delete context.destination
    delete context.missingdestination
    delete context.datetime
    delete context.missingdatetime

    FB.getDetails(context._fbid_,function (obj){
      console.log("inside")
      console.log(obj)

              context.username = obj.first_name
               var message ={text: "Hi "+context.username+". Im Railway Bot.Happy to help :)",
                            quickreplies:[{title:"Book ticket"},{title:"Transfer to agent"}]
                          }

              FB.newMessage(context._fbid_,message,"quickreplies")

    })
   
      

  },
  confirm({context,entities})
  {
    var answer = firstEntityValue(entities, 'yes_no')
    if(answer=="yes")
    {
      delete context.no
      context.yes=true
    }
    else //if(answer=="no")
    {
    FB.newMessage(context._fbid_,null,"typing")
      delete context.yes
      context.no=true
    }
    
    return context
  },

  getmissing({context,entities})
  {


    var source = firstEntityValue(entities, 'source')// get specific entity
    var destination = firstEntityValue(entities, 'destination') // get specific entity
    var datetime = firstEntityValue(entities, 'datetime') // get specific entity
    console.log("getmissing")
    console.log(context)
	    if(source)
	    {
	    	console.log("source set")
	    	delete context.missingsource   
		    context.source=source
		    	 }
     	if(destination)
	    {
	    	console.log("destination set")

	    context.destination=destination

	    	delete context.missingdestination    } 
	    if(datetime)
	    {
        
	    	console.log("datetime set")

	    	
	    context.datetime=datetime
	    	delete context.missingdatetime    }

        if(context.source&&context.datetime&&context.destination)
        {
          context.confirmation=true
        }
	    	
		 	session.sessions[context.sessionId].context=context
      console.log("ending")
      console.log(context)
	    		    	return context
	  },

  deletetrain({context, entities}) {

  	console.log("in conforma")
    delete context.yes
    delete context.no
     delete context.Trains
    delete context.NoofTrains
    delete context.NoTrains
    delete context.source
    delete context.missingsource
    delete context.destination
    delete context.missingdestination
    delete context.datetime
    delete context.missingdatetime
    delete context.confirmation
    var source = firstEntityValue(entities, 'source') // get specific entity
    var destination = firstEntityValue(entities, 'destination') // get specific entity
    var datetime = firstEntityValue(entities, 'datetime') // get specific entity
    if(source)
    {
      context.source=source
     delete context.missingsource
    }
    else
    {
      context.missingsource=true

    }
    
    if(destination)
    {
      context.destination=destination
       delete context.missingdestination
    }
    else
    {
      context.missingdestination=true
    }
     if(datetime)
    {
      context.datetime=datetime
      delete context.missingdatetime
    }
    else
    {
      context.missingdatetime=true
    }

 
 
	if(context.source&&context.destination&&context.datetime)
	{
    context.confirmation=true

	}
    
  
      console.log("context\n")
	    console.log(context)
		 	session.sessions[context.sessionId].context=context
 

    return context
  },
  

 GetTrains({context, entities}) {
 	console.log("\n\n\ninside get flight")
  
    	context.Trains ={name:" india railway from "+context.source+" to "+context.destination}
  	context.NoofTrains=1
    delete context.NoTrains
   
    delete context.source
    delete context.destination
    delete context.datetime
    delete context.confirmation
	  //session.sessions[context.sessionId].context=context
    console.log(context)
    if(context.NoofTrains>0)
    {
      console.log("trying to print\n")
      var msg ={ listelement:[{text:"train1",
                  defaulturl:"http://www.google.com",
                  Title:"Welcome to railway bot",
                  img_url:"https://dummyimage.com/600x400/000/fff",
                  subtitle:"How may I help you",
                },
                {
                 text: "train 2",
                  defaulturl:"http://www.google.com",
                  Title:"Welcome to railway bot",
                  img_url:"https://dummyimage.com/600x400/000/fff",
                  subtitle:"How may I help you",
                }
                ]
              }

      // var msg = {
      //   text:context.NoofTrains+" Trains Found"
      //         }
      FB.newMessage(context._fbid_,msg,"generic")
    }    
    return context
 	
  }



}

var getWit = function () {

		
	console.log('GRABBING WIT')
	var accessToken=Config.WIT_TOKEN
	const client= new Wit({accessToken, actions})
	return client
}

module.exports = {
	getWit: getWit,
}


