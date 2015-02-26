exports.templates=function(){

    var async =require("async");
    var _ =require("underscore");

    return {
        status:{
            determine:function(username,done){
              User.findByUsername(username,function(person){
                    done({connected:person?true:false})
                });
            }
        },
        skills:{
            translate:function(username,done){

                User.findByUsername(username,function(person){

                    if(!person){
                        done(null);
                    }else{


                        var choices= ['Google','Blogs','Bing', 'Yahoo!','Social Media'];
                        var tools = _.map(person.tools,function(t){
                          return choices[t];
                        });

                        var response = {
                            "name":person.name,
                            "username":person.username,
                            "email":person.email,
                            "formCompleted":person.formCompleted,
                            "skills":person.skills,
                            "tools":tools,
                            "department":person.department,
                            "function":person.funt
                        };

                        done(response);

                    }

                });
            }
        }
    }
};