
var http = require('http');
var restler = require('restler');

var peers =function(id) {


    return  {'facebook': {
        status: {
            host: 'localhost',
            port: 3002,
            path: "/udum/status/" + id},
        social: {
            host: 'localhost',
            port: 3002,
            path: "/udum/social/" + id},
        tags: {
            host: 'localhost',
            port: 3002,
            path: "/udum/tags/" + id}
    },
        'twitter': {
            status: {
                host: 'localhost',
                port: 3003,
                path: "/udum/status/" + id},
            social: {
                host: 'localhost',
                port: 3003,
                path: "/udum/social/" + id},
            tags: {
                host: 'localhost',
                port: 3003,
                path: "/udum/tags/" + id}
        },
        'linkedin': {
            status: {
                host: 'linkedin.p2pum.fotis',
                port: 3004,
                path: "/udum/status/" + id},
            social: {
                host: 'linkedin.p2pum.fotis',
                port: 3004,
                path: "/udum/social/" + id},
            tags: {
                host: 'linkedin.p2pum.fotis',
                port: 3004,
                path: "/udum/tags/" + id},
            template:function(template){

                return {

                    host: 'linkedin.p2pum.fotis',
                    port: 3004,
                    path: "/p2pum/"+ id+"/"+template}



            }
        }
    }
};


exports.status=function(id,peer,callback){

    var from  = peers(id)[peer].status;

    restler.get("http://"+from.host+":"+from.port+from.path,{timeout: 1000})
        .on('complete',function(data,response){

            if(typeof(data) == 'Error'){
                callback(null);
            }else{
                callback(data);
            }
        });



};

exports.template=function(id,peer,templates,callback){

    var from = peers(id)[peer].template(templates);


    restler.get("http://"+from.host+":"+from.port+from.path,{timeout: 1000})
        .on('complete',function(data,response){

            if(typeof(data) == 'Error'){
                callback(null);
            }else{
                callback(data);
            }
        });
};



exports.p2pum = function(facebook,twitter,linkedin){

    var http = require('http');
    var restler = require('restler');

    return {
        templates:{
            'facebook':{
                status:{
                    host:'localhost',
                    port:3002,
                    path:"/udum/status/"+facebook},
                social:     {
                    host:'localhost',
                    port:3002,
                    path:"/udum/social/"+facebook},
                tags:{
                    host:'localhost',
                    port:3002,
                    path:"/udum/tags/"+facebook}
            },
            'twitter':{
                status:{
                    host:'localhost',
                    port:3003,
                    path:"/udum/status/"+twitter},
                social:     {
                    host:'localhost',
                    port:3003,
                    path:"/udum/social/"+twitter},
                tags:{
                    host:'localhost',
                    port:3003,
                    path:"/udum/tags/"+twitter}
            },
            'linkedIn':{
                status:{
                    host:'localhost',
                    port:3004,
                    path:"/udum/status/"+linkedin},
                social:     {
                    host:'localhost',
                    port:3004,
                    path:"/udum/social/"+linkedin},
                tags:{
                    host:'localhost',
                    port:3004,
                    path:"/udum/tags/"+linkedin}
            }
        },

        getTemplate:function(from,callback){

            restler.get("http://"+from.host+":"+from.port+from.path,{timeout: 1000})
            .on('complete',function(data,response){

                    if(typeof(data) == 'Error'){
                        callback(null);
                    }else{
                        callback(data);
                    }
            });
        }
    }
};