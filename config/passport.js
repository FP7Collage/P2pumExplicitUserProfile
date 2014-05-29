exports.passport = function(app,collage,passport){

   var LocalStrategy = require('passport-local').Strategy;

    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({ username: username }, function(err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { messages: {type:'warning',text:'Incorrect login.'} });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, { messages: {type:'warning',text:'Incorrect login.'} });
                }

                if(!user.isActive){
                    return done(null, false, { messages: {type:'warning',text:'Your account has not been activated yet'} });
                }
                return done(null, user);
            });
        }
    ));


    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {

        User.findOne({username: obj.username},function(err,user){
            if(err){
                done(null, obj);
            }else{
                done(null,user);
            }
        });
    });



};

exports.ensureAuthenticated = function(url,passport) {


    return function(req, res, next){

        if(req.query.ticket){
            collage.getUserInfo(req.query.ticket,function(token,data,err){

                console.log("Data reached! ",data);

                //check to see if we have a user name
                if(!err && data.username ){
                    User.findOne({$and:[{ username: data.username},{isActive:true}]}, function(err, user) {
                        if (err ) { return res.redirect(url) }

                        if(!user){

                            var u = new User();

                            u.username = data.username;
                            u.name = data.username;
                            u.email  = data.email;

                            u.save(function(err){
                                req.logIn(u,function(err){
                                    return next();
                                });
                            });
                        }else{

                            req.logIn(user, function (err) {
                                if(!err){
                                    return next();
                                }else{
                                    res.redirect(url);
                                }
                            });
                        }


                    });
                }else{
                    return res.redirect(url);
                }
            });
        }else if (req.isAuthenticated()) {
                return next();
        }else{
            return res.redirect(url)
        }

    }
};