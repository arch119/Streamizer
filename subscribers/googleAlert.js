let gApi = require('../lib/googleapi');
const utils = require('../lib/utils');

function sendAlert(gmail, events, config){
    let subject = `${events.length} new alerts from craigslist`;//todo

    function genHtmlUlFromEvents(){
        let result = '<ul>';
        events.forEach((event)=>{
            result += `<li> ${event.toHtmlString()} </li>`;
        });
        result += '</ul>';
        return result;
    }

    let msgBody = `<html><head></head><body>${genHtmlUlFromEvents()}</body>`;

    const headers = {
        'To': config.subscribers.gmailAlerter.to,
        'Subject': subject,
        'Message-Id': Date.now() + ' ' + utils.getRandomInt(0, 10000000000) + '@localhost.com',
        'Content-Type': 'text/html'
    };

    gmail.sendMail(headers, msgBody);
}

module.exports = {
    subscribe: function(subject, config){
        gApi.initGoogleApi( config.baseDir , config.clientSecretFileName )
        .then((auth)=>{
            return new gApi.Gmail(auth);
        })
        .then((gmail)=>{
            subject.bufferWithTime(config.subscribers.gmailAlerter.bufferInterval)
                    .subscribe((events)=>{
                        if(events.length > 0){
                            console.log("Gmail: Received new events");
                            sendAlert(gmail, events, config);
                        }
                    });
        })
        .catch((err)=>console.log(err));
    }
};

