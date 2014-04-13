exports.connection = function(){

    var url = 'mongodb://localhost/p2pum-explicit';

    if(process.env.NODE_ENV=='production' || process.env.NODE_ENV=='test'){
        url = 'mongodb://admin:peekadmin@paulo.mongohq.com:10091/peekintoo';
    }

    mongoose.connect(url);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("Mongoose open");
    });

    return {
        db: db,
            url: url
    }
};
