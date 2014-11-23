var Command = require('../core/Command');

var address = new Command('address', {channel: true, pm: true}, 0);
address.run = function (from, channel, message) {
    // Parse the stuff
    this.handle(from, channel, message)
        .then(function (from) {
            // Call DOGE address
            return app.dogecoin.getAddress(from.account);
        }.bind(this))
        // Handle DOGE balance
        .then(function (value) {
            app.irc.client.say(channel, app.lang.parse('messages.deposit_address', value));
        })
        // Handle ANY error
        .catch(this.error);
};

module.exports = address;