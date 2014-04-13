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

exports.ensureAuthenticated = function(url) {
    return function(req, res, next){

    //check token
    if(req.session.esbToken){
        return next();
    }else if(req.query.token){
        collage.getUserInfo(req.query.token,function(token,data,err){

            console.log("Data reached! ",data);

            //check to see if we have a user name
            if(data.username){
                User.findOne({$and:[{ username: data.username},{isActive:true}]}, function(err, user) {
                    if (err || !user ) { return res.redirect(url) }
                    req._passport.session.user=user;
                    return next();
                });
            }else{
                return res.redirect(url);
            }
            if(!err){
                req.session.esbToken = token;
                return next();
            }else{
            }
        });
    }else if (req.isAuthenticated()) {
            return next();
        }

        return res.redirect(url)
    }
};