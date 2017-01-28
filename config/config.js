const path = require('path');

module.exports = {
    baseUrl: 'https://tokyo.craigslist.jp',
    baseUrlQueryParams: '?lang=en&cc=us',

    /*
    ** List the topics of interest. e.g. 'activities', 'real estate for sale' i.e
    ** The actual topic names from the craigslist home page (English version)
    */
    topicsOfInterest: [ 
                    ],

    /*
    ** Some topics, especially those under the "personals" sections can't be specified easily
    ** As they have subtopics and so on. In such cases, just list out the url of the page directly.
    ** It also works for any search results.
    */                    
    urlsOfInterest: [ { name: 'random search', url: '/search/cas?lang=en&cc=us&sort=date&query=w4w'} 
                    ],

    /*
    ** Each topic of interest is polled with this interval. 
    */
    pollInterval : 10*1000, //in ms
    /*
    ** The name of the secret file used by gmail api. Refer to 
    ** https://developers.google.com/gmail/api/quickstart/nodejs
    ** on how to get this.
    */
    clientSecretFileName: __dirname + '/secret.json',

    subscribers: {
        consoleLogger: {
            subscriber: require('../subscribers/console')
        },

        gmailAlerter: {
            subscriber: require('../subscribers/googleAlert'),
            to: '<you>@gmail.com',
            bufferInterval: 10*1000 //aggregate all events received during this interval and send a single email
        }
    },

    baseDir: path.normalize(__dirname+ '/..'),
};
