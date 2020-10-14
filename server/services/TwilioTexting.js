var key = require('../config/keys');

const client = require('twilio')(key.TWILIO_ACCOUNT_SID, key.TWILIO_AUTH_TOKEN);

const TwilioTexting = async (message, telephone) =>{
    client.messages.create({
        to: telephone,
        from: '+12182969527',
        body: message
    
    }).then((message)=>console.log(message.sid));
    await timeout(4000);

}

function timeout(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = TwilioTexting;
