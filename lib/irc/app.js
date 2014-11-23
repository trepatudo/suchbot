var irc = require('./core/irc');


module.exports = function (settings) {

    /**
     * Initial setup
     * Define the commands and handlers to load
     */

    // Vars
    var lastCommand = {};

    // Handlers
    var handlers = {};
    handlers.nickserv = require('./handlers/nickserv');

    // Commands
    var commands = {};
    ['balance','tip','address','doge'].forEach(function (cmd) {
        commands[cmd] = require ('./commands/'+ cmd);
    }, this);

    /**
     * main()
     * Connect to the server
     */

    app.console.info('Connecting to the server...');
    this.client = new irc.Client(settings.connection.host, settings.login.nickname, {
        port:   settings.connection.port,
        secure: settings.connection.secure,

        userName: settings.login.username,
        realName: settings.login.realname,

        debug: settings.connection.debug
    });

    /**
     * Functions
     */

    this.joinChannels = function () {
        settings.channels.forEach(function (channel) {
            app.console.info('Joining: %s', channel);
            this.client.join(channel);
        }, this);
    }

    /**
     * Handlers for listeners
     * Messages, notices
     */
    var handleMessage = function (from, channel, message) {
        // Register last input from user
        lastCommand[from] = Date.now();

        // Parse input
        var match = message.match(/^(\.?)(\S+)/);
        if (match == null) return;
        var prefix = match[1];
        var command = match[2];


        // Find respective command
        if (commands[command]) {
            if (channel == this.client.nick && commands[command].allowPM() === false) {
                app.console.info('No PM allowed');
                return;
            }
            if (channel != this.client.nick && (commands[command].allowChannel() === false || prefix != '.'))  {
                app.console.info('No chan allowed');
                return;
            };

            // if pms, make sure to respond to pms instead to itself
            if (channel == this.client.nick) channel = from;

            commands[command].run(from, channel, message);

        }
    };

    var handleNotice = function (nick, to, text, message) {
        // There should be a nick?
        if (!nick) return;

        // Find respective handler
        nick = nick.toLowerCase();
        if (handlers[nick])
            handlers[nick].handle(to, text, message);

    };

    /**
     * Listeners
     * Setup the main listeners
     */

        // On server connection
    this.client.addListener('registered', function (message) {
        // Log
        app.console.info('Connected to %s.', message.server);
        // Auth
        handlers.nickserv.auth(settings.login.nickserv_login, settings.login.nickserv_password);
    });

    // On server error
    this.client.addListener('error', function (message) {
        // Log
        app.console.error('Received an error from IRC network: ', message);
    });

    // General speak
    this.client.addListener('message', handleMessage.bind(this));
    this.client.addListener('notice', handleNotice.bind(this));
};

