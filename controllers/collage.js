
exports.getUserInfo=function(token,callback){

    var restler = require("restler");

    var esb="http://esb.exactls.com/collage/";
//    var esb="http://esb.exactls.com/collage/"

    restler.get(esb+"cas/user?ticket="+token).on('complete',function(data){
        console.log(data);
        callback(token,data,null);
    });
}