
exports.index = function(req, res){

   if(!req.user.formCompleted){
       return res.redirect("/skills");
   }

    User.findById(req.user._id,function(err,object){
        res.render('index.twig',{profile:object,app_url: utils.absoluteUrl("/",{},req)});
    });
};


exports.login = function (req, res) {

    var message = req.session.messages;
    req.session.messages = null;
    res.render('login.twig',{messages:message,app_url: utils.absoluteUrl("/",{},req)});
};

exports.logout = function (req, res) {

    req.logout();
    return res.redirect("/");
};
