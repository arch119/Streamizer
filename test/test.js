function Test(){
    this.x = 5;
}

Test.prototype.test = function(x){
    console.log(x);
    console.log(this.x);
};

module.exports = Test;