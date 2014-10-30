/**
 * Basic information on IRC
 */


var nickserv = {};
nickserv.auth = function (login, password) {
    app.irc.client.say('NickServ', 'IDENTIFY '+ login +' '+ password);
};

nickserv.handle = function (to, text, message) {
    // Authed with success
    if (text.match(/^You are now identified/)) app.irc.joinChannels();
}

// Export
module.exports = nickserv;