var pyx = require('../lib/pyx'),
    fs  = require('fs');

var xml_file = fs.readFileSync('test/resources/test.xml', 'utf8');
var pyx_file = fs.readFileSync('test/resources/test.pyx', 'utf8').slice(0, - 1);
describe('xml2pyx', function() {
    it('should convert test.xml into exactly test.pyx', function(done) {
        pyx.pyx2xml(pyx_file, function(err,data) {
            expect(data).toBe(xml_file);
            done();
        });
    });
});
