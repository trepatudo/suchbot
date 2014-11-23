var Command = require('../core/Command');


var tip = new Command('tip', {channel: true, pm: true}, 2);
tip.run = function (from, channel, message) {
    // Parse the stuff
    this.handle(from, channel, message)
        .then(function (from) {
            /**
             * Argument check
             */
            var argv = this.getArguments();

            var to      = argv[1];
            var amount  = argv[2];


            // Not random neither a number?
            if (isNaN(amount) && (amount + '').toLowerCase() != "random") {
                // Throw wrong amount
                return Q.reject({error: 'command.tip.invalid_amount', amount: amount});
            }

            // Same user
            if (to.toLowerCase() == from.account.toLowerCase()) {
                return Q.reject({error: 'command.tip.same_person', amount: amount});
            }


            // Is the other user authed?
            return this.isAuthed(to);

        }.bind(this))
        .then(function (to) {
            // Prepare arguments
            var exec = this.getExec();
            var argv = this.getArguments();
            var amount  = argv[2];

            // Transfer it
            return app.dogecoin.transfer(exec.from.account, to.account, amount, false);
        }.bind(this))
        .then(function (info) {
            var exec = this.getExec();
            info.from = exec.from.nick;

            app.irc.client.say(channel, app.lang.parse('messages.tipped', info) + this.getCurrentRate('usd',info.amount));
          console.log(info);
        }.bind(this))
        .catch(this.error);
};

module.exports = tip;