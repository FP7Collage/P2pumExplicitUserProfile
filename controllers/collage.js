
exports.getUserInfo=function(token,callback){

    var restler = require("restler");

    var esb="http://192.168.14.78:8081/"
//    var esb="http://esb.exactls.com/collage/"

    restler.get(esb+"cas/user?token="+token).on('complete',function(data){
        console.log(data);
        callback(token,data,null);
    });
}