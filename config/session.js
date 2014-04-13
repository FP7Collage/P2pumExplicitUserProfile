
exports.redis = function(app){

    var  express = require('express');
    var redisOpts ={};
    if(process.env['REDIS_URL']){

        console.log("We are on okeanos");
        var url = require('url').parse(process.env['REDIS_URL'])
        redisOpts ={
            port: url.port
            ,host: url.hostname
        }

    }else{

        redisOpts = {
            port:'6379'
            ,host: 'localhost'
        }

    }

    var RedisStore = require('connect-redis')(express);

    return new RedisStore(redisOpts);

};

