var redis = require("redis");
var scb = require('beervana-scraper');

module.exports = async function (context, myTimer) {
    // Add your cache name and access key.
    var client = redis.createClient({
        host: process.env.REDISCACHEHOSTNAME,
        port: process.env.REDISCACHEPORT,
        password: process.env.REDISCACHEKEY,
        tls: {
            servername: process.env.REDISCACHEHOSTNAME
        }
    });

    client.on("error", function (err) {
        context.log("Error " + err);
    });

    scb().then(page => {
        if (page.data.beer.count === 12) { //currently we expect 12 beers on tap
            client.set(process.env.BEERVANACACHEOBJECTNAME, JSON.stringify(page.data.beer), redis.print);
        }
    });

    context.log('savingDataToRedis finished');
};