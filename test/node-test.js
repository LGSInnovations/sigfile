var chai = require('chai');
var assert = chai.assert;

function ab2str(buf) {
    var uintbuf = new Uint8Array(buf);
    var str = "";
    for (var i = 0; i < uintbuf.length; i++) {
        str += String.fromCharCode(uintbuf[i]);
    }
    return str;
}

describe('sigfile.js', function() {
  describe('keyword_test_file', function() {
    it('should load correct', function() {
      var fs = require("fs");
      var sigfile = require("../js/sigfile");
      var BlueHeader = sigfile.bluefile.BlueHeader;
      var file = fs.readFileSync("./test/dat/keyword_test_file.tmp");
      console.log(file);
      console.log("BUFFER", file.buffer.slice(file.byteOffset, file.byteLength));
      var buf = file.buffer.slice(file.byteOffset, file.byteLength)
      console.log(ab2str(buf.slice(4, 8)));
      var hdr = new BlueHeader(buf, {});
      assert.equal(hdr.type, 1000);
      assert.equal(hdr.format, 'SB');
      assert.equal(hdr.size, 0);
      assert.equal(hdr.ext_start, 1);
      assert.equal(hdr.ext_size, 224);
      assert.equal(hdr.data_start, 512);
      assert.equal(hdr.data_size, 0);

      var keywords = {
          B_TEST: 123,
          I_TEST: 1337,
          L_TEST: 113355,
          X_TEST: 987654321,
          F_TEST: 0.12345000356435776,
          D_TEST: 9.87654321,
          O_TEST: 255,
          STRING_TEST: "Hello World",
          B_TEST2: 99,
          STRING_TEST2: "Goodbye World"
      };
      for (var prop in keywords) {
          assert.equal(
              hdr.ext_header[prop],
              keywords[prop]
          );
      }
    });
  });
});
