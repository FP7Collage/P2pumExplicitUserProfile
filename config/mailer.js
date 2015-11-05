var _constants = require('./constants.js');

exports.mailer=function(){

    var nodemailer = require("nodemailer");
    var xtend = require("xtend");
    var nunjucks = require("nunjucks");



// setup e-mail data with unicode symbols
    var mailOptions = {
        from: "The COLLAGE Autobot <noreply@existanze.com>"
    };


    return  {
        send : function(template,options,callback){

            //TODO move this to app.js or to a module
            var transport = nodemailer.createTransport("SMTP", {
                service: "Mandrill", // hostname
                auth: {
                    user: "fotis@existanze.com",
                    pass: "ojgp86moJKAY_RGlRA5ghw"
                }
            });

            var opts = xtend(mailOptions,options);

            opts.html =  nunjucks.render("emails/"+template,options);

            // send mail with defined transport object
            transport.sendMail(opts, function(error, response){
                console.log("Email send action taken");
                if(error){
                    console.log(error);
                    callback(error);
                }else{
                    callback(null);
                }

                transport.close();

            });
        }
    };
};
