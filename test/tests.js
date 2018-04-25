/**
 * @license
 * File: tests.js
 * Copyright (c) 2012-2017, LGS Innovations Inc., All rights reserved.
 *
 * This file is part of SigPlot.
 *
 * Licensed to the LGS Innovations (LGS) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  LGS licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* globals QUnit, sigfile, equal, test, strictEqual, asyncTest, notEqual, alert, start, ok */

var fixture = document.getElementById("qunit-fixture");
QUnit.module('bluefile', {
    setup: function() {},
    teardown: function() {}
});
asyncTest('int data', function() {
    var bfr = new sigfile.bluefile.BlueFileReader();
    bfr.read_http("dat/ramp.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        equal(hdr.buf.byteLength, 2560, "buf correct size");
        //equal( Object.prototype.toString.call(hdr.dview), "[object Float64Array]", "dview created");
        equal(hdr.dview.length, 1024, "dview correct size");
        strictEqual(hdr.file_name, "ramp.tmp", "correct file name");
        strictEqual(hdr.version, "BLUE", "correct version");
        strictEqual(hdr.headrep, "EEEI", "correct header rep");
        strictEqual(hdr.datarep, "EEEI", "correct data rep");
        strictEqual(hdr.timecode, 0, "correct timecode");
        strictEqual(hdr.type, 1000, "correct type");
        strictEqual(hdr["class"], 1, "correct class");
        strictEqual(hdr.format, "SI", "correct format");
        strictEqual(hdr.spa, 1, "correct spa");
        strictEqual(hdr.bps, 2, "correct bps");
        strictEqual(hdr.bpa, 2, "correct bpa");
        strictEqual(hdr.ape, 1, "correct ape");
        strictEqual(hdr.bpe, 2, "correct bpe");
        strictEqual(hdr.size, 1024, "correct size");
        strictEqual(hdr.xstart, 0.0, "correct xstart");
        strictEqual(hdr.xdelta, 1.0, "correct xdelta");
        strictEqual(hdr.xunits, 1, "correct xunits");
        strictEqual(hdr.subsize, 1, "correct subsize");
        equal(hdr.ystart, undefined);
        equal(hdr.yelta, undefined);
        equal(hdr.yunits, 0);
        strictEqual(hdr.data_start, 512.0, "correct data_start");
        strictEqual(hdr.data_size, 2048, "correct data_size");
        equal(hdr.dview[0], 0);
        equal(hdr.dview[1], 1);
        equal(hdr.dview[2], 2);
        equal(hdr.dview[1021], 1021);
        equal(hdr.dview[1022], 1022);
        equal(hdr.dview[1023], 1023);
        start();
    });
});
asyncTest('Ascii Keywords', function() {
    var bfr = new sigfile.bluefile.BlueFileReader();
    bfr.read_http("dat/lots_of_keywords.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        var i = 1;
        var strpad = "";
        while (i <= 100) {
            if (i <= 100) {
                strpad = "                                ";
            }
            if (i <= 30) {
                strpad = "                ";
            }
            if (i <= 20) {
                strpad = "";
            }
            var str = "" + i;
            var keypad = "000";
            var ans = keypad.substring(0, keypad.length - str.length) + str;
            var key = "KEYWORD_" + ans;
            var value = "[value___" + ans + strpad + "]";
            if ((i > 50) && (i <= 100)) {
                value += " ";
            }
            equal(
                hdr.ext_header[key],
                value,
                key + " = " + hdr.ext_header[key]
            );
            i++;
        }
        start();
    });
});
asyncTest('All Keywords as JSON (default)', function() {
    var bfr = new sigfile.bluefile.BlueFileReader(); //defaults are to use dict
    bfr.read_http("dat/keyword_test_file.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
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
            equal(
                hdr.ext_header[prop],
                keywords[prop],
                "Keyword " + prop + " correct = " + keywords[prop]
            );
        }
        start();
    });
});
asyncTest('All Keywords as JSON (json)', function() {
    var bfr = new sigfile.bluefile.BlueFileReader({
        ext_header_type: "json"
    });
    bfr.read_http("dat/keyword_test_file.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
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
            equal(
                hdr.ext_header[prop],
                keywords[prop],
                "Keyword " + prop + " correct = " + keywords[prop]
            );
        }
        start();
    });
});
asyncTest('All Keywords as JSON (dict)', function() {
    var bfr = new sigfile.bluefile.BlueFileReader({
        ext_header_type: "dict"
    });
    bfr.read_http("dat/keyword_test_file.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
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
            equal(
                hdr.ext_header[prop],
                keywords[prop],
                "Keyword " + prop + " correct = " + keywords[prop]
            );
        }
        start();
    });
});
asyncTest('All Keywords as JSON ({})', function() {
    var bfr = new sigfile.bluefile.BlueFileReader({
        ext_header_type: {}
    });
    bfr.read_http("dat/keyword_test_file.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
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
            equal(
                hdr.ext_header[prop],
                keywords[prop],
                "Keyword " + prop + " correct = " + keywords[prop]
            );
        }
        start();
    });
});
asyncTest('All Keywords as Array (list)', function() {
    var bfr = new sigfile.bluefile.BlueFileReader({
        ext_header_type: "list"
    });
    bfr.read_http("dat/keyword_test_file.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        var keywords = [{
            "tag": "B_TEST",
            "value": 123
        }, {
            "tag": "I_TEST",
            "value": 1337
        }, {
            "tag": "L_TEST",
            "value": 113355
        }, {
            "tag": "X_TEST",
            "value": 987654321
        }, {
            "tag": "F_TEST",
            "value": 0.12345000356435776
        }, {
            "tag": "D_TEST",
            "value": 9.87654321
        }, {
            "tag": "O_TEST",
            "value": 255
        }, {
            "tag": "STRING_TEST",
            "value": "Hello World"
        }, {
            "tag": "B_TEST2",
            "value": 99
        }, {
            "tag": "STRING_TEST2",
            "value": "Goodbye World"
        }];
        for (var i = 0; i < keywords.length; i++) {
            equal(hdr.ext_header[i].tag, keywords[i].tag, "Keyword " + i + " tag " + hdr.ext_header[i].tag + " = " + keywords[i].tag);
            equal(hdr.ext_header[i].value, keywords[i].value, "Keyword " + i + " value " + hdr.ext_header[i].value + " = " + keywords[i].value);
        }
        start();
    });
});
asyncTest('double data', function() {
    var bfr = new sigfile.bluefile.BlueFileReader();
    bfr.read_http("dat/sin.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        equal(hdr.buf.byteLength, 33280, "buf correct size");
        //equal( Object.prototype.toString.call(hdr.dview), "[object Float64Array]", "dview created");
        equal(hdr.dview.length, 4096, "dview correct size");
        strictEqual(hdr.file_name, "sin.tmp", "correct file name");
        strictEqual(hdr.version, "BLUE", "correct version");
        strictEqual(hdr.headrep, "EEEI", "correct header rep");
        strictEqual(hdr.datarep, "EEEI", "correct data rep");
        strictEqual(hdr.timecode, 0, "correct timecode");
        strictEqual(hdr.type, 1000, "correct type");
        strictEqual(hdr["class"], 1, "correct class");
        strictEqual(hdr.format, "SD", "correct format");
        strictEqual(hdr.spa, 1, "correct spa");
        strictEqual(hdr.bps, 8, "correct bps");
        strictEqual(hdr.bpa, 8, "correct bpa");
        strictEqual(hdr.ape, 1, "correct ape");
        strictEqual(hdr.bpe, 8, "correct bpe");
        strictEqual(hdr.size, 4096, "correct size");
        strictEqual(hdr.xstart, 0.0, "correct xstart");
        strictEqual(hdr.xdelta, 1.0, "correct xdelta");
        strictEqual(hdr.xunits, 0, "correct xunits");
        strictEqual(hdr.subsize, 1, "correct subsize");
        equal(hdr.ystart, undefined);
        equal(hdr.yelta, undefined);
        equal(hdr.yunits, 0);
        strictEqual(hdr.data_start, 512.0, "correct data_start");
        strictEqual(hdr.data_size, 32768, "correct data_size");
        equal(hdr.dview[0], 1);
        equal(hdr.dview[1], 0.9980267284282716);
        equal(hdr.dview[2], 0.9921147013144778);
        equal(hdr.dview[4093], 0.9048270524660175);
        equal(hdr.dview[4094], 0.9297764858882493);
        equal(hdr.dview[4095], 0.9510565162951516);
        start();
    });
});
asyncTest('complex float data', function() {
    var bfr = new sigfile.bluefile.BlueFileReader();
    bfr.read_http("dat/pulse_cx.tmp", function(hdr) {
        //equal( Object.prototype.toString.call(hdr.buf), "[object ArrayBuffer]", "buf created");
        equal(hdr.buf.byteLength, 131584, "buf correct size");
        //equal( Object.prototype.toString.call(hdr.dview), "[object Float64Array]", "dview created");
        equal(hdr.dview.length, 400, "dview correct size");
        strictEqual(hdr.file_name, "pulse_cx.tmp", "correct file name");
        strictEqual(hdr.version, "BLUE", "correct version");
        strictEqual(hdr.headrep, "EEEI", "correct header rep");
        strictEqual(hdr.datarep, "EEEI", "correct data rep");
        strictEqual(hdr.timecode, 0, "correct timecode");
        strictEqual(hdr.type, 1000, "correct type");
        strictEqual(hdr["class"], 1, "correct class");
        strictEqual(hdr.format, "CF", "correct format");
        strictEqual(hdr.spa, 2, "correct spa");
        strictEqual(hdr.bps, 4, "correct bps");
        strictEqual(hdr.bpa, 8, "correct bpa");
        strictEqual(hdr.ape, 1, "correct ape");
        strictEqual(hdr.bpe, 8, "correct bpe");
        strictEqual(hdr.size, 200, "correct size");
        strictEqual(hdr.xstart, 0.0, "correct xstart");
        strictEqual(hdr.xdelta, 1.0, "correct xdelta");
        strictEqual(hdr.xunits, 1, "correct xunits");
        strictEqual(hdr.subsize, 1, "correct subsize");
        equal(hdr.ystart, undefined);
        equal(hdr.yelta, undefined);
        equal(hdr.yunits, 0);
        strictEqual(hdr.data_start, 512.0, "correct data_start");
        strictEqual(hdr.data_size, 1600, "correct data_size");
        start();
    });
});
