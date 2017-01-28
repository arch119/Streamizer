

let request = require('request');
let fs = require('fs');

exports.getUrl = function(url){

    return new Promise(
        function(resolve, reject){
            request.get(url)
                .on('response', (resp)=>{
                    let result = '';
                    resp.on('data', (chunk)=>{result += chunk.toString('utf-8')})
                        .on('end', ()=>resolve(result));
                })
                .on('error', (err)=>{
                    reject(err);
                });
        }
    );

};

exports.saveUrl = function(url,fileName){
    exports.getUrl(url)
        .then((data)=>{
            fs.writeFile(fileName, data, 'utf8', (err)=>{
                if (err) throw err;
            })
        }).catch((err)=>{
            throw err;
        });
};

exports.getFile = function(fileName){
    return new Promise(
        function(resolve, reject){
            fs.readFile(fileName, (err, data)=>{
                if(err) reject(err);
                resolve(data);
            });
        }
    );

};