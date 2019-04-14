import { expect } from 'chai';
import { readFile } from 'fs';
import { bluefile } from '../js/index';

describe('keyword_test_file', () => {
    it('should load correctly', () => {
        const BlueHeader = bluefile.BlueHeader;
        readFile("./dat/keyword_test_file.tmp", (err, data) => {
            if (err) {
                throw err;
            }
            const buf = data.buffer.slice(data.byteOffset, data.byteLength);
            const hdr = new BlueHeader(buf, {});
            expect(hdr.type).to.equal(1000);
            expect(hdr.format).to.equal('SB');
            expect(hdr.size).to.equal(0);
            expect(hdr.ext_start).to.equal(1);
            expect(hdr.ext_size).to.equal(224);
            expect(hdr.data_start).to.equal(512);
            expect(hdr.data_size).to.equal(0);

            const keywords = {
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
            for (let prop in keywords) {
                expect(hdr.ext_header[prop]).to.equal(keywords[prop]);
            }
        });
    });
    it('should read bluefile int data from HTTP', () => {
        const bfr = new bluefile.BlueFileReader();
        bfr.read_http("dat/ramp.tmp", (hdr) => {
            expect(hdr.buf.byteLength).to.equal(2560);
            expect(hdr.dview.length).to.equal(1024);
            expect(hdr.file_name).to.equal("ramp.tmp");

            expect(hdr.version).to.equal("BLUE");
            expect(hdr.headrep).to.equal("EEEI");
            expect(hdr.datarep).to.equal("EEEI");
            expect(hdr.timecode).to.equal(0);
            expect(hdr.type).to.equal(1000);
            expect(hdr["class"]).to.equal(1);
            expect(hdr.format).to.equal("SI");
            expect(hdr.spa).to.equal(1);
            expect(hdr.bps).to.equal(2);
            expect(hdr.bpa).to.equal(2);
            expect(hdr.ape).to.equal(1);
            expect(hdr.bpe).to.equal(2);
            expect(hdr.size).to.equal(1024);
            expect(hdr.xstart).to.equal(0.0);
            expect(hdr.xdelta).to.equal(1.0);
            expect(hdr.xunits).to.equal(1);
            expect(hdr.subsize).to.equal(1);
            expect(hdr.ystart).to.equal(undefined);
            expect(hdr.ydelta).to.equal(undefined);
            expect(hdr.yunits).to.equal(0);
            expect(hdr.data_start).to.equal(512.0);
            expect(hdr.data_size).to.equal(2048);
            expect(hdr.dview[0]).to.equal(0);
            expect(hdr.dview[1]).to.equal(1);
            expect(hdr.dview[2]).to.equal(2);
            expect(hdr.dview[1021]).to.equal(1021);
            expect(hdr.dview[1022]).to.equal(1022);
            expect(hdr.dview[1023]).to.equal(1023);
        });
    });
    it('should read bluefile ascii Keywords', () => {
        const bfr = new bluefile.BlueFileReader();
        bfr.read_http("dat/lots_of_keywords.tmp", (hdr) => {
            let i = 1;
            let strpad = "";
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
                let str = "" + i;
                let keypad = "000";
                let ans = keypad.substring(0, keypad.length - str.length) + str;
                let key = "KEYWORD_" + ans;
                let value = "[value___" + ans + strpad + "]";
                if ((i > 50) && (i <= 100)) {
                    value += " ";
                }
                expect(hdr.ext_header[key]).to.equal(value);
                i++;
            }
        });
    });
    it('should read all keywords as JSON (default) from HTTP', () => {
        const bfr = new bluefile.BlueFileReader(); //defaults are to use dict
        bfr.read_http("dat/keyword_test_file.tmp", (hdr) => {
            let keywords = {
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
            for (let prop in keywords) {
                expect(hdr.ext_header[prop]).to.equal(keywords[prop]);
            }
        });
    });
    it('All Keywords as JSON (json) from HTTP', () => {
        const bfr = new bluefile.BlueFileReader({
            ext_header_type: "json"
        });
        bfr.read_http("dat/keyword_test_file.tmp", (hdr) => {
            let keywords = {
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
            for (let prop in keywords) {
                expect(hdr.ext_header[prop]).to.equal(keywords[prop]);
            }
        });
    });
    it('All Keywords as JSON (dict)', () => {
        const bfr = new bluefile.BlueFileReader({
            ext_header_type: "dict"
        });
        bfr.read_http("dat/keyword_test_file.tmp", (hdr) => {
            let keywords = {
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
            for (let prop in keywords) {
                expect(hdr.ext_header[prop]).to.equal(keywords[prop]);
            }
        });
    });
    it('All Keywords as JSON ({})', () => {
        const bfr = new bluefile.BlueFileReader({
            ext_header_type: {}
        });
        bfr.read_http("dat/keyword_test_file.tmp", (hdr) => {
            let keywords = {
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
            for (let prop in keywords) {
                expect(hdr.ext_header[prop]).to.equal(keywords[prop]);
            }
        });
    });
    it('All Keywords as Array (list)', () => {
        const bfr = new bluefile.BlueFileReader({
            ext_header_type: "list"
        });
        bfr.read_http("dat/keyword_test_file.tmp", (hdr) => {
            let keywords = [{
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
            for (let i = 0; i < keywords.length; i++) {
                expect(hdr.ext_header[i].tag).to.equal(keywords[i].tag);
                expect(hdr.ext_header[i].value).to.equal(keywords[i].value);
            }
        });
    });
    it('double data', () => {
        const bfr = new bluefile.BlueFileReader();
        bfr.read_http("dat/sin.tmp", (hdr) => {
            expect(hdr.buf.byteLength).to.equal(33280);
            expect(hdr.dview.length).to.equal(4096);
            expect(hdr.file_name).to.equal("sin.tmp");
            expect(hdr.version).to.equal("BLUE");
            expect(hdr.headrep).to.equal("EEEI");
            expect(hdr.datarep).to.equal("EEEI");
            expect(hdr.timecode).to.equal(0);
            expect(hdr.type).to.equal(1000);
            expect(hdr["class"]).to.equal(1);
            expect(hdr.format).to.equal("SD");
            expect(hdr.spa).to.equal(1);
            expect(hdr.bps).to.equal(8);
            expect(hdr.bpa).to.equal(8);
            expect(hdr.ape).to.equal(1);
            expect(hdr.bpe).to.equal(8);
            expect(hdr.size).to.equal(4096);
            expect(hdr.xstart).to.equal(0.0);
            expect(hdr.xdelta).to.equal(1.0);
            expect(hdr.xunits).to.equal(0);
            expect(hdr.subsize).to.equal(1);
            expect(hdr.ystart).to.equal(undefined);
            expect(hdr.ydelta).to.equal(undefined);
            expect(hdr.yunits).to.equal(0);
            expect(hdr.data_start).to.equal(512.0);
            expect(hdr.data_size).to.equal(32768);
            expect(hdr.dview[0]).to.equal(1);
            expect(hdr.dview[1]).to.equal(0.9980267284282716);
            expect(hdr.dview[2]).to.equal(0.9921147013144778);
            expect(hdr.dview[4093]).to.equal(0.9048270524660175);
            expect(hdr.dview[4094]).to.equal(0.9297764858882493);
            expect(hdr.dview[4095]).to.equal(0.9510565162951516);
        });
    });
    it('complex float data', () => {
        const bfr = new bluefile.BlueFileReader();
        bfr.read_http("dat/pulse_cx.tmp", (hdr) => {
            expect(hdr.buf.byteLength).to.equal(131584);
            expect(hdr.dview.length).to.equal(400);
            expect(hdr.file_name).to.equal("pulse_cx.tmp");
            expect(hdr.version).to.equal("BLUE");
            expect(hdr.headrep).to.equal("EEEI");
            expect(hdr.datarep).to.equal("EEEI");
            expect(hdr.timecode).to.equal(0);
            expect(hdr.type).to.equal(1000);
            expect(hdr["class"]).to.equal(1);
            expect(hdr.format).to.equal("CF");
            expect(hdr.spa).to.equal(2);
            expect(hdr.bps).to.equal(4);
            expect(hdr.bpa).to.equal(8);
            expect(hdr.ape).to.equal(1);
            expect(hdr.bpe).to.equal(8);
            expect(hdr.size).to.equal(200);
            expect(hdr.xstart).to.equal(0.0);
            expect(hdr.xdelta).to.equal(1.0);
            expect(hdr.xunits).to.equal(1);
            expect(hdr.subsize).to.equal(1);
            expect(hdr.ystart).to.equal(undefined);
            expect(hdr.ydelta).to.equal(undefined);
            expect(hdr.yunits).to.equal(0);
            expect(hdr.data_start).to.equal(512.0);
            expect(hdr.data_size).to.equal(1600);
        });
    });
});
