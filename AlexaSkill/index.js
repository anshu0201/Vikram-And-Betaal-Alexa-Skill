const Alexa = require('alexa-sdk');
const stories = require('./stories.js');

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context, callback);
  alexa.appId ='amzn1.ask.skill.51d47033-1b49-488f-add8-599342f3e407';

  alexa.registerHandlers(handlers);
  alexa.execute();
};
var handlers ={
  'LaunchRequest':function()
  {

  this.attributes.where=0;
  this.attributes.add='<audio src="https://s3.amazonaws.com/vikraam/title2.mp3"/>';
  this.attributes.noofsteps=0;
  this.attributes.storyno= -1;
  this.attributes.result="inital";
this.attributes.stop=0;
    let speech="Hello King Vikram, you are on your mission to get Betaal for the sage seeking occult powers. It is a dark moonless night and it is raining intermittently . The only source of light is sporadic flashes of lightning. Making the atmosphere more eerie, are the howls of jackals. You are unmindful of your surroundings and focused only on your aim of carrying out the sage’s wish. You mounted Betaal on your shoulders and started walking towards the cremation ground, where the sage is waiting for him. Enroute, the spirit of Betaal  will be narrating  a story to you and after completing the story Betaal would pose a query that if you ,The king knew the answer, you will be bound to respond otherwise he will break your head into thousand pieces. But if you  speak out, you would break the vow of silence and Betaal would fly back to the treetop, leaving you inches short of your destination! . So King Vikram say start to take your first step towards the  the cremation ground.   ";
  this.response.speak('<audio src="https://s3.amazonaws.com/vikraam/title2.mp3"/>'+  speech )
              .shouldEndSession(false);
          this.emit(':responseReady');
  },
'StartIntent':function()
{
  this.attributes.where=1;
   this.attributes.storyno=this.attributes.storyno+1;
  console.log(stories[this.attributes.storyno].parts);
  this.attributes.noofsteps=stories[this.attributes.storyno].parts;
  var speech;
    if(this.attributes.stop==1)
  {
    this.attributes.stop=0;
    speech="lets continue the journey. spirit of betaal is narrating a story to you <break time='1s'/>";
  }
  else{
    speech =stories[this.attributes.storyno].continueadd;
  }
  for (var i=1;i<=this.attributes.noofsteps;i++)
  {
   speech=speech + stories[this.attributes.storyno][i] ;
 }
 console.log(speech);
 if(this.attributes.storyno<=7)
 {
   //speech =stories[7].continueadd;
    this.response.speak(speech)
  .shouldEndSession(false);
this.emit(':responseReady');
}
else {

}

},
'AnswerIntent':function()
{

this.attributes.where=2;
  if (this.event.request.intent.slots) {
           if (this.event.request.intent.slots.answer.resolutions.resolutionsPerAuthority[0].status.code == 'ER_SUCCESS_NO_MATCH') {
           this.response.speak('sorry i did not get you')
             .listen();
           this.emit(':responseReady');
}

         else {
           console.log(this.event.request.intent.slots.answer.resolutions.resolutionsPerAuthority[0].values[0].value.id);
        this.attributes.result = this.event.request.intent.slots.answer.resolutions.resolutionsPerAuthority[0].values[0].value.id.toLowerCase();
    }
  }
  //var result = this.event.request.intent.slots.answer.resolutions.resolutionsPerAuthority[0].values[0].value.id.toLowerCase();
  if(this.attributes.result.toLowerCase()===stories[this.attributes.storyno].answer)
  {
    this.attributes.add="good ,right answer .";
  }
  else {
    this.attributes.add="sorry ,wrong answer. " + stories[this.attributes.storyno].answeradd;
  }
  if(this.attributes.storyno<7)
  {
          this.response.speak(this.attributes.add + stories[this.attributes.storyno].explain)
              .shouldEndSession(false);
           this.emit(':responseReady');}
           else {
             this.response.speak(this.attributes.add + stories[this.attributes.storyno].explain)
                 .shouldEndSession(true);
              this.emit(':responseReady');
           }
},
'CatchHimIntent':function()
{
  if(this.attributes.storyno<=6)
  this.emitWithState('StartIntent');
  else {
    this.attributes.storyno=-1;
  }
},
'Unhandled':function()
{
  if(this.attributes.where==0)
  {
    this.response.speak("Sorry, I didn't get you .please say start to take your first step towards the  the cremation or else say stop to exit . ")
              .shouldEndSession(false);
           this.emit(':responseReady');

  }
  else if(this.attributes.where==1)
  {
    this.response.speak("Sorry, I didn't get you .please say repeat question if you want me to repeat the question or else say no idea for help with the answer.  ")
              .shouldEndSession(false);
           this.emit(':responseReady');
  }
  else if(this.attributes.where==2)
  {
    this.response.speak("Sorry, I didn't get you . please say catch  to catch betaal again and take him to the sage who is waiting for him or else say stop to exit . ")
                   .shouldEndSession(false);
                   this.emit(':responseReady');
  }
},
'RepeatIntent':function()
{
  var rep;
  if (this.event.request.intent.slots)
  {
           if (this.event.request.intent.slots.repeat.resolutions.resolutionsPerAuthority[0].status.code == 'ER_SUCCESS_NO_MATCH')
           {
           this.response.speak('sorry i did not get you')
             .listen();
           this.emit(':responseReady');
            }

         else {
           console.log(this.event.request.intent.slots.repeat.resolutions.resolutionsPerAuthority[0].values[0].value.id);
           rep = this.event.request.intent.slots.repeat.resolutions.resolutionsPerAuthority[0].values[0].value.id.toLowerCase();
              }
  }
  if(rep=='q')
  {
    this.attributes.repeatques=1;
    this.response.speak(stories[this.attributes.storyno].repeatques)
                .listen();
                this.emit(':responseReady');
  }
  else if(rep=='s')
  {
    var speech=" ";
    for (var i=1;i<=this.attributes.noofsteps;i++)
    {
     speech=speech + stories[this.attributes.storyno][i] ;
    }
   console.log(speech);
      this.response.speak(speech)
    .shouldEndSession(false);
   this.emit(':responseReady');
  }
  else{}
},
'AMAZON.CancelIntent':function()
{if(this.attributes.where==1)
{
  this.attributes.stop=1;
  this.attributes.storyno=this.attributes.storyno-1;
this.response.speak('Goodbye!')
.shouldEndSession(true);
this.emit(':responseReady');

}
else if(this.attributes.where==0){
this.attributes.stop=2;
this.attributes.storyno=-1;
this.response.speak('Goodbye!')
.shouldEndSession(true);
this.emit(':responseReady');

}
},

'AMAZON.HelpIntent':function()
{
  if(this.attributes.where==0)
  {
    this.response.speak("please say start to take  your first step towards the  the cremation.  Enroute, the spirit of Betaal  will be narrating  a story to you and after completing the story Betaal would pose a query , which you need to answer .")
                 .shouldEndSession(false);
    this.emit(':responseReady');

  }
  else if(this.attributes.where==1)
  {
    this.response.speak("say repeat quesion to repeat the question or say repeat story if you want me to repeat the story for you . say no idea if you want  help with the answer")
                 .shouldEndSession(false);
    this.emit(':responseReady');
  }
  else if(this.attributes.where==2)
  {
    this.response.speak("please say  catch betaal to catch him again and take him to the sage who is waiting for him or else say stop to exit .")
                 .shouldEndSession(false);
    this.emit(':responseReady');
  }
  else {

  }
},
'NoIdeaIntent':function()
{
  this.attributes.where=2;
  this.response.speak(stories[this.attributes.storyno].answeradd + stories[this.attributes.storyno].explain)
                .shouldEndSession(false);
  this.emit(':responseReady');
},
'AMAZON.StopIntent':function()
{
  if(this.attributes.where==1)
  {
    this.attributes.stop=1;
    this.attributes.storyno=this.attributes.storyno-1;
  this.response.speak('Goodbye!')
.shouldEndSession(true);
this.emit(':responseReady');

}
else if(this.attributes.where==0){
  this.attributes.stop=2;
  this.attributes.storyno=-1;
this.response.speak('Goodbye!')
.shouldEndSession(true);
this.emit(':responseReady');

}
else {
  this.response.speak('Goodbye!')
  .shouldEndSession(true);
  this.emit(':responseReady');

}
},
'StartAgainIntent':function()
{
  for(var key in this.attributes){
    delete this.attributes[key];
    console.log(this.attributes[key]+' is deleted');
  }
  console.log("startagain intent");
  console.log("going to launch request");
  this.emit('LaunchRequest');
}
};
