var Command = require('../core/Command');


var tip = new Command('doge', {channel: true, pm: true}, 2);
tip.run = function (from, channel, message) {
    // Parse the stuff
    this.handle(from, channel, message)
        .then(function (from) {
            /**
             * Argument check
             */
            var argv = this.getArguments();

            var amount    = argv[1];
            var coin      = argv[2];

            return app.irc.client.say(channel, 'such\002\0037 '+ amount +' DOGE\003\002 = such '+ this.getCurrentRate(coin, amount));
        }.bind(this))
        .catch(this.error);
};

module.exports = tip;