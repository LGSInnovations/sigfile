import { expect } from 'chai';
import {
  update,
  getInt64,
  ab2str,
  str2ab,
  pow2,
  parseURL,
  text2buffer,
} from '../src/util';

describe('update', () => {
  it('should handle empty objects', () => {
    const dst = {};
    const src = {};
    const result = update(dst, src);
    expect(result).to.eql({});
  });

  it('should handle filled and nested objects', () => {
    const dst = {
      c: {
        d: {
          e: {
            f: 5,
          },
        },
      },
    };
    const src = {
      a: 1,
      b: 'foo',
    };
    const result = update(dst, src);
    expect(result).to.eql({
      a: 1,
      b: 'foo',
      c: {
        d: {
          e: {
            f: 5,
          },
        },
      },
    });
  });

  it('should handle the same object', () => {
    const dst = {
      a: 1,
      b: 'foo',
    };
    const src = {
      a: 1,
      b: 'foo',
    };
    const result = update(dst, src);
    expect(result).to.eql(src);
    expect(result).to.eql(dst);
  });
});

describe('getInt64', () => {
  it('should handle empty input', () => {
    const buffer = new ArrayBuffer(8);
    const dv = new DataView(buffer);
    const result = getInt64(dv, 0, true);
    expect(result).to.equal(0);
  });

  it('should handle little endian', () => {
    const buffer = new ArrayBuffer(8);
    const dataView = new DataView(buffer);
    dataView.setInt32(0, 256);
    dataView.setInt32(4, 0);
    const result = getInt64(dataView, 0, true);
    expect(result).to.equal(65536);
  });

  it('should handle big endian', () => {
    const buffer = new ArrayBuffer(8);
    const dataView = new DataView(buffer);
    dataView.setInt32(0, 256);
    dataView.setInt32(4, 0);
    const result = getInt64(dataView, 0, false);
    expect(result).to.equal(1099511627776);
  });

  it('should return Infinity safely', () => {
    const buffer = new ArrayBuffer(8);
    const dataView = new DataView(buffer);
    dataView.setInt32(0, 2);
    dataView.setInt32(4, 1337);
    const result = getInt64(dataView, 0, true);
    expect(result).to.equal(Infinity);
  });
});

describe('ab2str', () => {
  it('should handle an empty buffer', () => {
    expect(ab2str(new ArrayBuffer(0))).to.eql('');
  });

  it('should be the somewhat the inverse of str2ab', () => {
    expect(ab2str(str2ab('abcd'))).to.eql('a\u0000b\u0000c\u0000d\u0000');
  });

  it('should convert with apply', () => {
    const buf = new ArrayBuffer(3);
    const arr = new Uint8Array(buf);
    arr[0] = 97;
    arr[1] = 98;
    arr[2] = 99;
    const result = ab2str(buf);
    expect(result).to.eql('abc');
  });

  it('should convert with apply with true', () => {
    const buf = new ArrayBuffer(3);
    const arr = new Uint8Array(buf);
    arr[0] = 97;
    arr[1] = 98;
    arr[2] = 99;
    const result = ab2str(buf, true);
    expect(result).to.eql('abc');
  });

  it('should convert without apply with false', () => {
    const buf = new ArrayBuffer(3);
    const arr = new Uint8Array(buf);
    arr[0] = 97;
    arr[1] = 98;
    arr[2] = 99;
    const result = ab2str(buf, false);
    expect(result).to.eql('abc');
  });
});

describe('str2ab', () => {
  it('should handle the empty string', () => {
    const result = str2ab('');
    const expected = new ArrayBuffer(0);
    expect(result).to.be.empty;
    expect(result).to.eql(expected);
  });

  it('should correctly parse a string', () => {
    const result = str2ab('abc');
    const expected = new ArrayBuffer(6);
    const arr = new Uint16Array(expected);
    arr[0] = 97;
    arr[1] = 98;
    arr[2] = 99;
    expect(result).to.eql(expected);
  });
});

describe('pow2', () => {
  it('should handle negative numbers', () => {
    const result = pow2(-2);
    expect(result).to.equal(0.25);
  });

  it('should handle positive numbers within 0 <= n < 31', () => {
    const result = pow2(30);
    expect(result).to.equal(1073741824);
  });

  it('should handle n > 31', () => {
    const result = pow2(32);
    expect(result).to.equal(4294967296);
  });
});

describe('parseURL', () => {
  it('should handle the empty string', () => {
    const result = parseURL('');
    expect(result.source).to.equal('');
    expect(result.protocol).to.equal('http');
    expect(result.host).to.equal('localhost');
    expect(result.port).to.equal('');
    expect(result.query).to.equal('');
    expect(result.params).to.eql({});
    expect(result.file).to.equal('');
    expect(result.hash).to.equal('');
    expect(result.path).to.equal('/');
    expect(result.relative).to.equal('/');
    expect(result.segments).to.eql(['']);
  });

  it('should handle a normal URL without query params', () => {
    const result = parseURL('https://google.com');
    expect(result.source).to.equal('https://google.com');
    expect(result.protocol).to.equal('https');
    expect(result.host).to.equal('google.com');
    expect(result.port).to.equal('');
    expect(result.query).to.equal('');
    expect(result.params).to.eql({});
    expect(result.file).to.equal('');
    expect(result.hash).to.equal('');
    expect(result.path).to.equal('/');
    expect(result.relative).to.equal('/');
    expect(result.segments).to.eql(['']);
  });

  it('should handle different protocols and ports', () => {
    const result = parseURL('ws://google.com:1337');
    expect(result.source).to.equal('ws://google.com:1337');
    expect(result.protocol).to.equal('ws');
    expect(result.host).to.equal('google.com');
    expect(result.port).to.equal('1337');
    expect(result.query).to.equal('');
    expect(result.params).to.eql({});
    expect(result.file).to.equal('');
    expect(result.hash).to.equal('');
    expect(result.path).to.equal('/');
    expect(result.relative).to.equal('');
    expect(result.segments).to.eql(['']);
  });

  it('should handle query parameters', () => {
    const result = parseURL('https://google.com?q=foo&bar=baz');
    expect(result.source).to.equal('https://google.com?q=foo&bar=baz');
    expect(result.protocol).to.equal('https');
    expect(result.host).to.equal('google.com');
    expect(result.port).to.equal('');
    expect(result.query).to.equal('?q=foo&bar=baz');
    expect(result.params).to.eql({
      q: 'foo',
      bar: 'baz',
    });
    expect(result.file).to.equal('');
    expect(result.hash).to.equal('');
    expect(result.path).to.equal('/');
    expect(result.relative).to.equal('/?q=foo&bar=baz');
    expect(result.segments).to.eql(['']);
  });

  it('should handle hashes', () => {
    const result = parseURL('https://google.com#foo');
    expect(result.source).to.equal('https://google.com#foo');
    expect(result.protocol).to.equal('https');
    expect(result.host).to.equal('google.com');
    expect(result.port).to.equal('');
    expect(result.query).to.equal('');
    expect(result.params).to.eql({});
    expect(result.file).to.equal('');
    expect(result.hash).to.equal('foo');
    expect(result.path).to.equal('/');
    expect(result.relative).to.equal('/#foo');
    expect(result.segments).to.eql(['']);
  });

  it('should handle segments', () => {
    const result = parseURL('https://google.com/foo/bar');
    expect(result.source).to.equal('https://google.com/foo/bar');
    expect(result.protocol).to.equal('https');
    expect(result.host).to.equal('google.com');
    expect(result.port).to.equal('');
    expect(result.query).to.equal('');
    expect(result.params).to.eql({});
    expect(result.file).to.equal('bar');
    expect(result.hash).to.equal('');
    expect(result.path).to.equal('/foo/bar');
    expect(result.relative).to.equal('/foo/bar');
    expect(result.segments).to.eql(['foo', 'bar']);
  });
});

describe('text2buffer', () => {
  it('should handle empty text', (done) => {
    text2buffer('', (buf) => {
      expect(buf.byteLength).to.eql(0);
      done();
    });
  });

  it('should handle no-provided blocksize', (done) => {
    text2buffer('abc', (buf) => {
      expect(buf.byteLength).to.eql(3);
      done();
    });
  });

  it('should handle provided blocksize', (done) => {
    text2buffer(
      'abc',
      (buf) => {
        expect(buf.byteLength).to.eql(3);
        done();
      },
      3
    );
  });
});
