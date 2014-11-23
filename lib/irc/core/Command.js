/**
 * Parse all stuff from a command on IRC
 * @param name
 * @param allow
 * @param arguments
 */
var Command = function (name, allow, argc) {
    /**
     * Vars
     * Setup needed stuff
     */
    var argv = [];
    var from = {
        account: false,
        nick: false
    };
    var exec = {};

    /**
     * Getters
     * Return info
     */
    this.allowChannel = function () { return allow.channel || false; };
    this.allowPM = function () { return allow.pm || false; };
    this.getName = function () { return name; };
    this.getArguments = function () { return argv; };
    this.getExec = function () { return exec; }

    /**
     * Main handler
     * Parse input
     */

    this.handle = function(from, channel, message) {
        //var deferred = Q.defer();

        // Save exec variables
        exec = {
            from: { name: from },
            channel: channel
        };

        // Log
        app.console.info('Running: %s', this.getName(), arguments);

        // Parse arguments
        argv = message.split(' ');
        if ((argv.length - 1) != argc)
            Q.reject({error:'command.'+ this.getName() +'.syntax'});

        // Never accept unidentified dudes
        return this.isAuthed(from, true);
    }
    /**
     * Check auth of user
     */
    this.isAuthed = function (from, myself) {
        var deferred = Q.defer();

        // Default error is for sender
        error = myself ? 'irc.not_identified' : 'irc.recv_not_found';

        app.irc.client.isIdentified(from, function (name) {
            // check if the sending user is logged in (identified) with nickserv
            if (!name)  deferred.reject({error: error, to: from});
            else {
                // Save on exec
                if (myself)
                    exec.from = {nick: from, account: name};
                // Resolve
                deferred.resolve({nick: from, account: name});
            }
        });

        return deferred.promise;
    }

    /**
     * Error handler
     */

    this.error  = function (e) {
        console.log(arguments, exec);
        // Error found
        if (e.error) {
            // Add info
            e.name = typeof(exec.from) == "object"? exec.from.nick : exec.from;
            app.irc.client.say(exec.channel, app.lang.error(e));
        }

        // Debug
        app.console.error(e.error);
    }

    /**
     * An helper to parse current price
     * TODO: coin as array to allow multiple introductions
     */
    this.getCurrentRate = function (coin, amount) {
        var info = app.currency.getCurrentRate(coin, amount);
        return ' [\0034\002'+ info.symbol +'\002\0039 '+ info.value  +'\003]';
    }
};

module.exports = Command;