const Rx = require('rx');
const Event = require('./event');
const PollingTarget = require('./pollingtarget');

function Api(config){
    this.config = config;
    this.subject = new Rx.Subject();
    this.pollingTargets = new Map();
}

Api.prototype.init = function(map){
    for(let v of map){
        this.pollingTargets.set(v[0], new PollingTarget({url: this.config.baseUrl + v[1]}));
    }
    return this;
};

Api.prototype.startPolling = function(){
    Rx.Observable.interval(this.config.pollInterval)
    .subscribe((x)=>{
        for(let [key, val] of this.pollingTargets){
            if(!val._retrieving){
                val.fetchLatest()
                    .then((newResults)=>{
                        newResults.forEach((x)=>this.subject.onNext(new Event(x, this.config.baseUrl)));
                    })
                    .catch((err)=>console.log(err));
            }
        }
    });
};

exports.Api = Api;
exports.Event = Event;