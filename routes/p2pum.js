var udum =require('../controllers/template.js').templates();

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

exports.fetchTemplate = function(req,res){

  var t = req.params.template;
  var id = req.user.username;

  if(udum[t] !=undefined){

    udum[t].translate(id,function(object){
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(object));
    });

  }else{
    res.setHeader('Content-Type', 'application/json');
    res.end("{}");
  }

};

exports.fetchStatus = function(req,res){

  res.setHeader('Content-Type', 'application/json');

  if(! req.user.id){
    res.end(null);
  }
  udum.status.determine(req.params.id,function(object){
    res.end(JSON.stringify(object));
  })

};

exports.fetchAuthTemplate = function(req,res){

  if(!req.query.ticket){
    res.setHeader('Content-Type', 'application/json');
    res.status(401).send('{error: "Invalid Ticket"}');
    return;
  }

  if(!req.params.id || !req.params.template || udum[req.params.template] ==undefined){
    res.setHeader('Content-Type', 'application/json');
    res.status(404).send('{error: "Not enough parameters (/p2pum/:template/:id?ticket=) "}');
    return;
  }


  var collage = require("../controllers/collage");


  collage.getUserInfo(req.query.ticket,function(token,data,err){

    if(err){
      res.setHeader('Content-Type', 'application/json');
      res.status(401).send('{error: "Invalid Authentication"}');
      return;
    }

   if(data.role.indexOf("USER_MANAGER") < 0){
      res.setHeader('Content-Type', 'application/json');
      res.status(401).send('{error: "Invalid Authentication"}');
      return;
    }



    var t = req.params.template;
    var id = req.params.id;

    console.log("Getting",t," information for",t,"by",data.username);
    udum[t].translate(id,function(object){
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(object));
    });

  });

};



exports.fetchStatus = function(req,res){

  res.setHeader('Content-Type', 'application/json');

  if(! req.user.id){
    res.end(null);
  }
  udum.status.determine(req.params.id,function(object){
    res.end(JSON.stringify(object));
  })

};