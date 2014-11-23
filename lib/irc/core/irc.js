var irc = require('irc');

// gets user's login status
irc.Client.prototype.isIdentified = function (nickname, callback) {
    // Log
    app.console.debug("Getting whois: %s", nickname);
    // Do it
    this.whois(nickname, function (response) {
        callback(response.account || false);
    });
}

irc.Client.prototype.getNames = function (channel, callback) {
    client.send('NAMES', channel);
    var listener = function (nicks) {
        var names = [];
        for (name in nicks) {
            names.push(name);
        }
        callback(names);
        this.removeListener('names' + channel, listener);
    }

    this.addListener('names' + channel, listener);
}

irc.Client.prototype.getAddress = function (nickname, callback) {
    winston.debug('Requesting address for %s', nickname);
    coin.send('getaccountaddress', settings.rpc.prefix + nickname, function (err, address) {
        if (err) {
            winston.error('Something went wrong while getting address. ' + err);
            callback(err);

            return false;
        }

        callback(false, address);
    });
}

module.exports = irc;