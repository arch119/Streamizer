
module.exports = {
    subscribe: function(subject, config){
        subject.bufferWithTime(5*1000)
               .subscribe((x)=>{
                   if(x.length > 0){
                       console.log("Console: Received new events");
                       //console.log(x);
                   }
               });
    }
};