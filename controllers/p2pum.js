exports.setup=function(app) {

    var http = require('http');
    var restler = require('restler');

    return {

        status: function (id, peer, callback) {

            var from = app.locals.peers[peer] + "p2pum/status/" + id;

            restler.get(from, {timeout: 1000})
                .on('complete', function (data, response) {

                    if (typeof(data) == 'Error') {
                        callback(null);
                    } else {
                        callback(data);
                    }
                });


        },
        template : function (id, peer, templates, callback) {

            var from = app.locals.peers[peer] + "p2pum/" + id + "/" + templates;

            restler.get(from, {timeout: 1000})
                .on('complete', function (data, response) {

                    if (typeof(data) == 'Error') {
                        callback(null);
                    } else {
                        callback(data);
                    }
                });
        }
    }

};



