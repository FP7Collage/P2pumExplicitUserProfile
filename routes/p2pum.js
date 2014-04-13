var failed = function(res){

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        connected:false
    }));
};


exports.connect = function(req,res){

    var peer = req.query.peer;
    req.user.linkedinId = req.query.id;

    req.user.save(function(err){

        return res.redirect("/");
    });

};


exports.persist = function(req, res){

    if(!req.body.property || !req.body.value){
        return failed(res);
    }else{

        User.findOne({username:req.user.username},function(err,user){
            if(!user){
                return failed(res);
            }

            user[req.body.property]=req.body.value;
            user.save(function(err){
                if(err){
                    failed(res);
                }else{
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({
                        connected:true
                    }));
                }
            })
        });
    }
};


exports.facebook = function(req, res){
    User.findOne({username:req.user.username},function(err,user){
        //we need to check the status of the user
        if(!user || !user.fbid){
            return res.render("");
        }
        var facebookId = user.fbid;

        var async = require("async");
        var udum = require('../controllers/udum.js').udum(facebookId);

        async.parallel([
            function(callback){
                udum.getTemplate(udum.templates.facebook.social,function(fbsocial){
                    callback(null,fbsocial);
                });
            },
            function(callback){
                udum.getTemplate(udum.templates.facebook.tags,function(fbsocial){
                    callback(null,fbsocial);
                });
            }
        ],
            function(err,results){
                res.render("agents/_facebook.twig",{data:results});
            }
        );
    });
};

exports.twitter= function(req, res){

    User.findOne({username:req.user.username},function(err,user){
        //we need to check the status of the user
        if(!user || !user.twitterId){
            return res.render("");
        }
        var id = user.twitterId;

        var async = require("async");
        var udum = require('../controllers/udum.js').udum(null,id);

        async.parallel([
            function(callback){
                udum.getTemplate(udum.templates.twitter.social,function(data){
                    callback(null,data);
                });
            },
            function(callback){
                udum.getTemplate(udum.templates.twitter.tags,function(data){
                    callback(null,data);
                });
            }
        ],
            function(err,results){
                res.render("agents/_twitter.twig",{data:results});
            }
        );
    });
};

exports.linkedin= function(req, res){

    User.findOne({username:req.user.username},function(err,user){
        //we need to check the status of the user
        if(!user || !user.linkedinId){
            return res.render("");
        }
        //we need to check the status of the user
        var linkedInId= user.linkedinId;


        var async = require("async");
        var p2pum = require('../controllers/p2pum.js').udum(null,null,linkedInId);

        async.parallel([
            function(callback){
                udum.getTemplate(udum.templates.linkedIn.social,function(fbsocial){
                    callback(null,fbsocial);
                });
            },
            function(callback){
                udum.getTemplate(udum.templates.linkedIn.tags,function(fbsocial){
                    callback(null,fbsocial);
                });
            }
        ],
            function(err,results){
                res.render("agents/_linkedin.twig",{data:results});
            }
        );
    });
};