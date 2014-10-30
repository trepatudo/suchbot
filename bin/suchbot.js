var winston  = require('winston'),
    fs       = require('fs'),
    yaml     = require('js-yaml'),
    Dogecoin = require('../lib/dogecoin/app'),
    IRC      = require('../lib/irc/app'),
    Currency = require('../lib/currency/app'),
    webadmin = require('../lib/webadmin/app');

// Global promise
global.Q    = require('q');

var app = {};

/*
/**
 * Configuration
 * Initialize all configuration
 */

    // load settings
    var settings = yaml.load(fs.readFileSync('./config/config.yml', 'utf-8'));

    // load winston's cli defaults
    winston.cli();

    // write logs to file
    if (settings.app.log.file) {
        winston.add(winston.transports.File, {
            filename: settings.app.log.file,
            level:    'debug'
        });
    }

    // check if the config file exists
    if (!fs.existsSync('./config/config.yml')) {
        winston.error('Configuration file doesn\'t exist! Please read the README.md file first.');
        process.exit(1);
    }

    app.console = winston;
    global.app = app;

/**
 * Init
 * Start all needed modules
 */
    // Track coins and currency
    app.currency = new Currency(settings.currency.coins, settings.currency.poll);

    // Initialize dogecoin
    app.dogecoin = new Dogecoin(settings.dogecoin);

    // Initialize IRC
    app.irc = new IRC(settings.irc, winston);

