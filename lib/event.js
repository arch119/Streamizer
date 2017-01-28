const _ = require('lodash');


function Event(data, baseUrl){
    _.assign(this, _.cloneDeep(data));
    this.url = baseUrl + this.url;
};

Event.prototype.toHtmlString = function(){
    return `<a href=${this.url}> ${this.title} </a>`;
}

module.exports = Event;