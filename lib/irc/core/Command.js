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
    }

    /**
     * Getters
     * Return info
     */
    this.allowChannel = function () { return allow.channel || false; };
    this.allowPM = function () { return allow.pm || false; };
    this.getArguments = function () { return argv; };

    /**
     * Main handler
     * Parse input
     */

    this.handle = function(from, channel, message) {
        var deferred = Q.defer();

        // Never accept unidentified dudes
        app.irc.client.isIdentified(from, function (name) {
            // check if the sending user is logged in (identified) with nickserv
            if (!name)  deferred.reject('NO-AUTH');
            else        deferred.resolve({nick: from, account: name});
        });

        return deferred.promise;
    }
};

module.exports = Command;