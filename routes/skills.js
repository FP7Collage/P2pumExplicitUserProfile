exports.index = function(req,res){

    var forms  = require("../lib/forms");
    var my_form = forms.skills();

    var doForm = function(connected,skills){
        my_form.handle(req, {
            success: function (form) {


                req.user.department = form.data.department;
                req.user.funct = form.data.func;
                req.user.tools = form.data.tools ;
                req.user.skills = form.data.skills ;

                req.user.save(function(err){

                    if(err){
                        console.log("Error saving",err);
                        req.session.messages = [{type:'error',text:'There was an error saving your profile, please try again later'}];
                        req.user.formCompleted = false;

                        return;
                    }

                    req.user.formCompleted=true;

                    return req.user.save(function(err){
                        return res.redirect("/");
                    });

                });

            },
            other: function (form) {
                // the data in the request didn't validate,
                // calling form.toHTML() again will render the error messages
                res.render("skills.twig",
                    {
                        isLinkedInConnected:connected,
                        skills:skills,
                        my_form: forms.toHTML(form),
                        app_url: utils.absoluteUrl("/",{},req)
                    });//function (name, object) { return bootstrap_field(name, object); })});
            }
        });
    };

    if(req.user.linkedinId){
        p2pum.status(req.user.linkedinId,"linkedin",function(data){

            if(data.connected){
                p2pum.template(req.user.linkedinId,"linkedin","tags",function(data){
                    doForm(true,data.tags);
                });

            }else{
                doForm(false);
            }
        });
    }else{
      doForm(false);
    }

};

