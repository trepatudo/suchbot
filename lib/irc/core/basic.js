/**
 * Basic information on IRC
 */


// gets user's login status
irc.Client.prototype.isIdentified = function (nickname, callback) {
    this.whois(nickname, function (response) {
        if (response.account) {
            callback(true, response.account);
        }
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
    coin.send('getaccountaddress', settings.rpc.prefix + nickname.toLowerCase(), function (err, address) {
        if (err) {
            winston.error('Something went wrong while getting address. ' + err);
            callback(err);

            return false;
        }

        callback(false, address);
    });
}

