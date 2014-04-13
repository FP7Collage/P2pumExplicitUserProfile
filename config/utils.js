exports.absoluteUrl=function(path,query,req){

    var url =require('url');

    //http://stackoverflow.com/questions/10183291/how-to-get-the-full-url-in-express-js
    //http://nodejs.org/api/url.html#url_url_format_urlobj
    var opts = {

        protocol:req.protocol,
        host: req.get('host'),
        pathname: path
    };

    if(query){
        opts.query = query
    }

    return url.format(opts);

};