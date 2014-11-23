var request = require('request'),
    coin    = require('node-dogecoin');


module.exports = function (settings) {

    /**
     * main()
     */
    var client = coin({
        host: settings.rpc.host,
        port: settings.rpc.port,
        user: settings.rpc.user,
        pass: settings.rpc.pass
    });

    client.getBalance(function (err, balance) {

        if (err) {
            app.console.error('Could not connect to %s RPC API! ', settings.coin.full_name, err);
            process.exit(1);
            return;
        }

        var balance = typeof(balance) == 'object' ? balance.result : balance;

        app.console.info('Connected to JSON RPC API. Current total balance is %d' + settings.coin.short_name, balance);
    })


    /*
     * Balance
     */
    this.getBalance = function (user) {

        var deferred = Q.defer();

        client.getBalance(settings.rpc.prefix + user, settings.coin.min_confirmations, function (err, balance) {
            if (err) {
                deferred.reject(err);
                return;
            }
            var balance = typeof(balance) == 'object' ? balance.result : balance;

            deferred.resolve({
                name:    user,
                balance: Number(balance)
            });

            /*client.getBalance(settings.rpc.prefix + user, 0, function (err, unconfirmed_balance) {
             if (err) {
             deferred.reject(err);
             return;
             }

             var unconfirmed_balance = typeof(unconfirmed_balance) == 'object' ? unconfirmed_balance.result : unconfirmed_balance;

             deferred.resolve({
             name:    user,
             balance: balance,
             unconfirmed: unconfirmed_balance - balance
             });
             })*/
        });

        return deferred.promise;

    }

    /**
     * Transfer
     */
    this.transfer = function (from, to, amount, ignoreSettings) {
        console.log(arguments);
        var deferred = Q.defer();

        // Checks
        if (!ignoreSettings) {
            // Random tip?
            if ((amount + '').toLowerCase() == "random") {
                var min = settings.coin.min_tip;
                var max = amount;
                amount = Math.floor(Math.random() * (max - min + 1)) + min;
            }

            // To int!
            amount = parseInt(amount);

            if (amount < settings.coin.min_tip) {
                return Q.reject({error: 'command.tip.too_small', to: to, amount: amount, min_tip: settings.coin.min_tip});
            }
        }

        // Get FROM balance
        this.getBalance(from)
            .then(function (info) {


                // Have enough?
                if (info.balance >= amount) {
                    client.send('move', settings.rpc.prefix + from, settings.rpc.prefix + to, amount, function (err, reply) {
                        // Error
                        if (err || !reply) {
                            console.log(err);
                            deferred.reject(err);
                        }

                        // Moved
                        deferred.resolve({
                            from:   from,
                            to:     to,
                            amount: amount
                        });
                    });
                }
                // Nein!
                else {
                    console.log("NOP");
                    deferred.reject({
                        error:   'command.tip.no_funds',
                        from:    info.user,
                        balance: info.balance,
                        short: amount - info.balance,
                        amount:  amount
                    });
                }

            });

        return deferred.promise;
    }

    /**
     * Address
     */
    this.getAddress = function (user) {
        var deferred = Q.defer();

        client.send('getaccountaddress', settings.rpc.prefix + user, function (err, address) {
            if (err) {
                deferred.reject(err);
                return;
            }
            deferred.resolve({
                name:    user,
                address: address
            });

        });

        return deferred.promise;
    }

    /**
     * Tip
     * Same as move but with all checks
     */

    /**
     * Withdraw
     */
    this.withdraw = function (from, address, amount) {
        // @TODO: LAZY ASS.
    }

}

