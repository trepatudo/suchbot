'use strict';
var fs       = require('fs'),
    yaml = require('js-yaml');

String.prototype.expand = function (expandReplace, expandGlobals) {
    return this.replace(/%([a-zA-Z_]+)%/g, function (str, variable) {
        return typeof(expandReplace[variable]) == 'undefined' ?
                (typeof(expandGlobals[variable]) == 'undefined' ?
                    str : expandGlobals[variable]) : expandReplace[variable];
    });
};


var lang = function (language, globals) {
    // load dictionary
    var dictionary = yaml.load(fs.readFileSync('./lang/en.yml', 'utf-8'));

    this.parse = function(variable, values) {
        return eval('dictionary.' + variable).expand(values, globals);
    }

    // Error dictionary
    this.error = function (values) {
        return eval('dictionary.errors.' + values.error).expand(values, globals);
    }
};

module.exports = lang;