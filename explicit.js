
/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , register = require('./routes/register')
    , skills = require('./routes/skills')
    , p2pumr = require('./routes/p2pum')
    , flash = require('connect-flash')
    , fs = require('fs')
    , http = require('http')
    , nunjucks=require('nunjucks')
    , passport = require('passport')
    , util = require('util')
    , path = require('path');


mongoose = require('mongoose');

var app = express();

var env = {
    peers:{
        linkedin: (process.env['p2pum_linkedin'] ? process.env['p2pum_linkedin'] : "http://linkedin.p2pum.fotis:3004/")
    }
};

console.log(env);
app.locals(env);


p2pum = require("./controllers/p2pum").setup(app);

mailer = require('./config/mailer').mailer();
utils = require('./config/utils');

var MongoStore = require('connect-mongo')(express);
//var rstore = require('./config/session.js').redis(app);

require('./config/view.js').views(app,nunjucks);

require('./model/User');

var p = require('./config/passport.js');
collage = require('./controllers/collage');
p.passport(app,collage,passport);


var store = {};
var connection = require('./config/db.js').connection();
console.log(connection.url);

// all environments
app.set('port', process.env.PORT || 3008);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('explicit-peer') );
app.use(express.session(
        {   secret: 'explicit-peer',
            store: new MongoStore({
                mongoose_connection: connection.db
            })
        })
    );

// use passport session
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));





// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


app.get('/', p.ensureAuthenticated("/login",passport), routes.index);
app.get('/logout', routes.logout);
app.get('/login',routes.login);

app.all('/register',register.index);
app.all('/register/validate',register.registerValidate);

app.all('/skills', p.ensureAuthenticated("/login",passport),skills.index);

app.get('/connect',p.ensureAuthenticated("/login",passport),p2pumr.connect);



app.post('/login',
    passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true })
);


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});



if ('development' == app.get('env')) {

    https = require('https');
    https.createServer({
        key: fs.readFileSync('/private/etc/apache2/ssl/server.key'),
        cert: fs.readFileSync('/private/etc/apache2/ssl/server.crt')
    },app).listen(7008,function(){
        console.log('Express server listening on port 7008 (ssl)')
    });


}
