var Command = require('../core/Command');


var balance = new Command('balance', {channel: true, pm: true}, 0);
balance.run = function (from, channel, message) {
    // Parse the stuff
    this.handle(from, channel, message)
        .then(function (from) {
            // Get DOGE balance
            return app.dogecoin.getBalance(from.account);
        }.bind(this))
        .then(function (value) {
            app.irc.client.say(channel, app.lang.parse('messages.balance', value) + this.getCurrentRate('usd',value.balance));
        }.bind(this))
        // Handle ANY error
        .catch(this.error);
};

module.exports = balance;