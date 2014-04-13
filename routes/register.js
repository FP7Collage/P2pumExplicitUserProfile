exports.index = function(req,res){

    var crypto = require('crypto');
    var async = require("async");
    var forms  = require("../lib/forms");
    var my_form = forms.register();


    my_form.handle(req, {
        success: function (form) {
            // there is a request and the form is valid
            // form.data contains the submitted data
            User.findOne({ $or:[ {'username':form.data.username}, {'email':form.data.email}]},function(err,result){

                if(err || result){

                    if(result){
                        if(result.username == form.data.username){
                            form.fields.username.error="This username is already used";
                        }

                        if(result.email == form.data.email ){
                            form.fields.email.error="This email is already registered";
                        }

                    }

                    res.render("register.twig",{my_form:forms.toHTML(form)});

                }else{

                    //save
                    var u = new User();
                    u.name = form.data.name;
                    u.username = form.data.username;
                    u.password = form.data.password;
                    u.validationToken =  crypto.createHash('sha256').update(form.data.email+ form.data.username).digest('base64');
                    u.save(function(err){

                        if(err){
                            console.log("Error saving",err);
                            return req.session.messages = [{type:'error',text:'There was an error creating your account, please try again later'}];
                        }


                        mailer.send('register-confirm.twig',{
                            subject: "Thank you for registering - please confirm your account",
                            to: form.data.email,
                            name: form.data.name,
                            url: utils.absoluteUrl("/register/validate",{token: u.validationToken},req)
                        },function(err){
                            if(err){
                                req.session.messages = [{type:'warning',text:'An error occured whilst sending your confirmation e-mail, please try again'}];
                            }else{
                                req.session.messages = [{type:'info',text:'You will receive an e-mail shortly, please confirm your account before proceding'}];
                            }
                            res.redirect("/login");
                        });


                    });

                }

            });
        },
        other: function (form) {
            // the data in the request didn't validate,
            // calling form.toHTML() again will render the error messages
            res.render("register.twig",{my_form: forms.toHTML(form)});//function (name, object) { return bootstrap_field(name, object); })});
        }
    });


};


exports.registerValidate= function(req,res){


    if(!req.query.token){
        return res.redirect("/login");
    }
    //find user by validation token

    User.findOne({validationToken:req.query.token},function(err,result){
        if(err || !result){
            req.session.messages = [{type:'warning',text:'There is no such token or that token has expired'}]
            return res.redirect('/login');
        }


        result.isActive = true;
        result.validationToken = null;

        result.save(function(err){
           if(err){
               console.log("Error saving",err);
           }else{
                req.session.messages = [{type:'success',text:'Thank you for registering, your account is now active'}]
           }
           return res.redirect('/login');
        });

    });

};