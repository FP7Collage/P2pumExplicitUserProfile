/**
 * Module dependencies.
 */
var passport = require('passport')
  , util = require('util')


/**
 * `Strategy` constructor.
 *
 * The me2day authentication strategy authenticates requests using
 * me2day authentication process.
 * It's like OAuth but not same.
 *
 * Applications must supply a `verify` callback which accepts a `userKey`,
 * and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `userKey`        identifies client to me2day
 *   - `nonce`          your own 8 digit of HEX code. (ex: '1234ABCD')
 *   - `callbackURL`    URL to which me2day will redirect the user after obtaining authorization
 *
 * Examples:
 *
 *     passport.use(new Me2dayStrategy({
 *         userKey: '--insert-me2day-user-key-here--'
 *         , nonce: '--insert-me2day-nonce-here--'
 *         , callbackURL: "http://127.0.0.1:3000/auth/me2day/callback"
 *       },
 *       function(userKey, profile, done) {
 *         User.findOrCreate(profile, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
    options = options || {};



    if (!options.esb) throw new Error('We need a ESB URL');
    if (!options.callbackURL) throw new Error('We need a callback URL');


    passport.Strategy.call(this, options, verify);

}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);


/**
 * Authenticate request by delegating to me2day
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, done) {
    options = options || {};

    var self = this;

    if (req.query && req.query['token']) {

        collage.getUserInfo(req.query['token'],function(token,data,err){

            console.log("Data reached! ",data);

            //check to see if we have a user name
            if(data.username){
                User.findOne({ username: data.username }, function(err, user) {

                    if (err || !user ) { return self.error(err); }

                    var profile = JSON.parse(data);

                    self._verify(userKey, profile, function (err, user, info) {
                        if (err) { return self.error(err); }
                        if (!user) { return self.fail(info); }
                        self.success(user, info);
                    });

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
    } else {
        return self.error("No token provided");
    }
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;

/**
 *
 * @type {*}
 */
module.exports = Strategy;
