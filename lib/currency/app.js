'use strict';

var request = require('request');

var Currency = function (coins, poll) {
    // Cache coin values
    // TODO: pass it to a decent dictionary
    var symbol = {
        'USD': '$',
        'EUR': '€',
        'BTC': '฿'
    };
    var values = {};
    var buffer = {};

    /**
     * Get currency values
     * @returns {{BTC: number, USD: number, EUR: number}}
     */
    this.getCoins = function () {
        return values;
    }

    /**
     * Get current value for a coin
     */
    this.getCurrentRate = function (coin, amount) {
        // Uppercase, always!
        coin = coin.toUpperCase();
        console.log(values, amount);
        // Fallback to 0 if not defined
        if (!values[coin]) return { symbol: 'ERR', value: 'Value missing'};

        // Such calc
        return { symbol: symbol[coin], value: values[coin] * amount};
    }

    /**
     * Request to dogecoinaverage.com
     * Get all information for coins needed
     */
    this.getPrice = function (coin) {
        return Q.Promise(function (resolve, reject, notify) {
            request('http://dogecoinaverage.com/' + coin + '.json', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // Coins info
                    try {
                        var result = JSON.parse(body);
                        values[coin] = Number(result.vwap);
                    } catch(e) {};

                    resolve();
                }
                else
                    reject(new Error('Impossible to get ' + coin + ' price'));
            });
        });
    };

    /**
     * Prepare sequentially queries to dogecoinaverage.com
     * Parse and finalize all data
     */
    this.updateCoins = function () {
        // Coins to request
        var requests = [];
        coins.forEach(function (coin) {
            requests.push(this.getPrice(coin));
        }, this);

        // Info about update
        Q.all(requests).then(function (value) {
            //foreach
            //if ()
            //app.console.info('All coins updated', values);
        }).done();

        // Pool it again
        setTimeout(this.updateCoins.bind(this), poll * 1000);
    };

    // Start it
    this.updateCoins();
};

module.exports = Currency;