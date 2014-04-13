exports.views=function(app,nunjucks){
    nunjucks.configure('views', {
        autoescape: true,
        express: app
    });
};