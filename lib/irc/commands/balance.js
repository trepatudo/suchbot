var Command = require('../core/Command');


var balance = new Command('balance', {channel: true, pm: true}, 0);
balance.run = function (from, channel, message) {
    // Log
    app.console.info('Running: %s', 'balance');
    // Parse the stuff
    this.handle(from, channel, message)
        .then(function (from) {
            // Get doge balance
            app.dogecoin.getBalance(from.account)
                .then(function (value) {
                    app.irc.client.say(channel, 'You ('+ from.account +') have '+ value);
                }).catch(function (e) {

                    app.irc.client.say(channel, 'Error');
                });


        }.bind(this)).
        catch(function (e) {
            console.log('error: ' + e);
        });
};

module.exports = balance;
/*
 var user = from.toLowerCase();
 break;*/