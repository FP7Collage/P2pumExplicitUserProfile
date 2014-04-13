
exports.index = function(req, res){

   if(!req.user.formCompleted){
       return res.redirect("/skills");
   }

    User.findById(req.user._id,function(err,object){
        res.render('index.twig',{profile:object});
    });
};


exports.login = function (req, res) {

    res.render('login.twig',{messages:req.session.messages});
};

exports.logout = function (req, res) {

    req.logout();
    return res.redirect("/");
};
