
const ds = require('./datasource');
const cl = require('./craigslist');
const _ = require('lodash');



function PollingTarget(data){
    _.assign(this, _.cloneDeep(data));    
    this.type = 0;
    this.lastDataId = -1;
    this.lastRetrieved = -1;
    this._retrieving = false;
    this.hadError = false;
}

PollingTarget.prototype.fetchLatest = function(){
    this._retrieving = true;
    console.log(`Fetching latest for ${this.url}: ${this.lastDataId}`);
    return new Promise((resolve, reject)=>{
        ds.getUrl(this.url)
            .then((data)=>{
                const results = cl.getAllResults(data);
                const newResults = results.filter((x)=>x.dataId > this.lastDataId );
                const maxId = Math.max(...(results.map((x)=>x.dataId)));

                resolve(newResults);
                this.lastDataId = maxId;
                this._retrieving = false;
            })
            .catch((err)=>{
                reject(err);
                this._retrieving = false;
                this.hadError = true;
            });
    });
}


module.exports = PollingTarget;
