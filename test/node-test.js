var chai = require('chai');
var assert = chai.assert;

describe('sigfile.js', function() {
  describe('keyword_test_file', function() {
    it('should load correct', function() {
      var fs = require("fs");
      var sigfile = require("../js/sigfile");
      var BlueHeader = sigfile.bluefile.BlueHeader;
      var file = fs.readFileSync("./test/dat/keyword_test_file.tmp");
// if the test is failing because of an invalid header, uncomment this
// to see if it's fixed.
//      for (var iii=0; iii<32; ++iii) {
//        console.log(file[iii]);
//      }
      hdr = new BlueHeader(file.buffer.slice(file.byteOffset, file.byteLength),{});
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
