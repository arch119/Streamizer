const fs = require('fs');

const ds = require('./lib/datasource');
const cl = require('./lib/craigslist');
const utils = require('./lib/utils');
const api = require('./lib/api');
const config = require('./config/config');
const Test = require('./test/test');


function startPublisher(apiObj){
    const localFile = './top.html';

    const craigsListBase = config.baseUrl;
    const queryParams = config.baseUrlQueryParams;
    const craigsListBaseUrl = `${craigsListBase}/${queryParams}`;
    
    //let p = ds.getUrl(craigsListBaseUrl);

    const topicsMap = ds.getFile(localFile)
        .then((data)=>{                
            const topics = cl.getAllTopics(data);
            return new Map(topics.map((val)=>[val.text, val.url]));

        })
        .catch((err)=>console.log(err));

    topicsMap.then((data)=>{
        let initData = utils.mapMultipleKeys(data,config.topicsOfInterest);
        config.urlsOfInterest.forEach((entry)=>initData.set(entry.name, entry.url));

        apiObj.init(initData).startPolling();
    });
}

function startSubscribers(apiObj){
    for(const sub in config.subscribers){
        console.log(`Starting subscriber ${sub}`);
        debugger;
        config.subscribers[sub].subscriber.subscribe(apiObj.subject, config);
    }
}


const apiObj = new api.Api(config);
startSubscribers(apiObj);
startPublisher(apiObj);

