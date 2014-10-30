var request = require('request'),
    coin    = require('node-dogecoin');


module.exports = function (settings) {

    /**
     * Balance
     */
    this.getBalance = function(user) {
        client.getBalance(settings.rpc.prefix + user, settings.coin.min_confirmations, function (err, balance) {
            if (err) {
                winston.error('Error in !balance command', err);
                client.say(channel, settings.messages.error.expand({name: from}));
                return;
            }

            var balance = typeof(balance) == 'object' ? balance.result : balance;

            coin.getBalance(settings.rpc.prefix + user, 0, function (err, unconfirmed_balance) {
                if (err) {
                    winston.error('Error in !balance command', err);
                    client.say(channel, settings.messages.balance.expand({balance: balance, name: user}));
                    return;
                }

                var unconfirmed_balance = typeof(unconfirmed_balance) == 'object' ? unconfirmed_balance.result : unconfirmed_balance;

                client.say(channel, settings.messages.balance_unconfirmed.expand({
                    balance: balance,
                    name:    user,
                    unconfirmed: unconfirmed_balance - balance
                }));
            })
        });
    }

    /**
     * main()
     */
    var client = coin({
        host: settings.rpc.host,
        port: settings.rpc.port,
        user: settings.rpc.user,
        pass: settings.rpc.pass
    });

    client.getBalance(function(err, balance) {

        if(err) {
            app.console.error('Could not connect to %s RPC API! ', settings.coin.full_name, err);
            process.exit(1);
            return;
        }

        var balance = typeof(balance) == 'object' ? balance.result : balance;
        app.console.info('Connected to JSON RPC API. Current total balance is %d' + settings.coin.short_name, balance);
    })

};
