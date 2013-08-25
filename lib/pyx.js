var sax = require("sax"),
strict = true, // set to false for html-mode
parser = sax.parser(strict);

function escape_chars(str) {
    return str.replace(/\\/gm, "\\\\").replace(/\n/gm, "\\n").replace(/\t/g, "\\t");
}
function unescape_chars(str) {
    return str.replace(/\\\\/g, "\\").replace(/\\t/g, "\t").replace(/\\n/g, "\n");
}
function xmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
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
        parser.oncomment = function (text) {
            pyx.push("C" + escape_chars(text));
            return;
        };
        parser.onend = function () {
            callback(error, pyx.join("\n"));
        };
        parser.onerror = function (err) {
            error = err;
        };
        parser.write(string).close();
    },
    pyx2xml : function(string,callback) {
        setTimeout(function() {
            var lines = string.split("\n").map(function (x) {
                var splited =  x.split(/^(.)/);
                splited.shift();
                return splited;
            });
            var xml = "";
            var ontag = false;
            lines.forEach(function(x) {
                switch(x[0]) {
                    case "(" :
                        ontag = true;
                        xml += "<" + x[1];
                        break;
                    case ")" :
                        xml += (ontag) ? "/>" : "</" + x[1] + ">";
                        ontag = false;
                        break;
                    case "-" :
                        var closetag = (ontag) ? ">" : "";
                        ontag = false;
                        xml += closetag + xmlEntities(unescape_chars(x[1]));
                        break;
                    case "A" :
                        var part = x[1].split(" ", 2);
                        xml += " " + part[0] + "=\"" + xmlEntities(unescape_chars(part[1])) + "\"";
                        break;
                    case "C" :
                        xml += "<!--" + unescape_chars(x[1]) + "-->";
                        break;
                    case "[" :
                        xml += "<![CDATA[" + unescape_chars(x[1]) + "]]>";
                        break;
                    case "?" :
                        xml += "<?" + x[1] + "?>";
                        break;
                }
            });
            callback(null, xml);
        },0);
    }
};

