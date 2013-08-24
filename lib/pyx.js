var sax = require("sax"),
strict = true, // set to false for html-mode
parser = sax.parser(strict);

function escape_chars(str) {
    return str.replace(/\n/g, '\n').replace(/\t/g, '\t').replace(/\\\\/g, '\\\\');
}
module.exports = {
    xml2pyx : function(string, callback) {
        var pyx = [];
        var cdata = "";
        var error = null;
        parser.onopentag = function (tag) {
            pyx.push("(" + tag.name);
            Object.keys(tag.attributes).forEach(function (x) {
                return pyx.push("A" + x + " " + tag.attributes[x]);
            });
            return;
        };
        parser.ontext = function (text) {
            pyx.push("-" + escape_chars(text));
            return;
        };
        parser.onclosetag = function (tagName) {
            pyx.push(")" + tagName);
            return;
        };
        parser.ondoctype = function (doctype) {
            pyx.push("D" + doctype);
            return;
        };
        parser.onprocessinginstruction = function (obj) {
            pyx.push("?" + obj.name + " " + obj.body);
            return;
        };
        parser.oncdata = function (text) {
            cdata += escape_chars(text);
            return;
        };
        parser.onclosecdata = function () {
            pyx.push("[" + cdata);
            cdata = "";
            return;
        };
        parser.onend = function () {
            callback(error, pyx.join("\n"));
        };
        parser.onerror = function (err) {
            error = err;
        };
        parser.write(string).close();
    }
};

