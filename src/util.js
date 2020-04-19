/**
 * Returns the endianness of the browser
 *
 * Source: https://gist.github.com/TooTallNate/4750953
 *
 * @memberof util
 * @private
 */
function endianness() {
  const b = new ArrayBuffer(4);
  const a = new Uint32Array(b);
  const c = new Uint8Array(b);
  a[0] = 0xdeadbeef;
  if (c[0] === 0xef) {
    return 'LE';
  } else if (c[0] === 0xde) {
    return 'BE';
  } else {
    throw new Error('unknown endianness');
  }
}

/**
 * JS implementation of Python's dict.update method.
 * This updates object `dst` with the properties in `src`.
 *
 * Note: This has been deprecated in v0.1.4 in favor
 * of the faster `Object.assign(target, source)`.
 *
 * @deprecated since v0.1.4
 *
 * @memberOf util
 * @param {object} dst  The object that will be updated
 * @param {object} src  The object whose properties will be added to `dst`
 * @returns {object}    The updated `dst`
 */
function update(dst, src) {
  for (let prop in src) {
    if (Object.prototype.hasOwnProperty.call(src, prop)) {
      const val = src[prop];
      if (typeof val === 'object') {
        // recursive
        if (dst[prop] === undefined) {
          dst[prop] = {};
        }
        update(dst[prop], val);
      } else {
        dst[prop] = val;
      }
    }
  }
  return dst; // return dst to allow method chaining
}

/**
 * Returns the 64-bit integer from the data buffer at
 * the requested offset.
 *
 * @memberOf util
 * @param {DataView} dataView  Data buffer
 * @param {number} index  The byte offset into the data buffer
 * @param {boolean} littleEndian  The endianness of the data
 * @returns {number} The 64-bit integer from the `dataView`
 */
function getInt64(dataView, index, littleEndian) {
  const MAX_INT = Math.pow(2, 53);
  const [highIndex, lowIndex] = littleEndian ? [4, 0] : [0, 4];
  const high = dataView.getInt32(index + highIndex, littleEndian);
  const low = dataView.getInt32(index + lowIndex, littleEndian);
  const rv = low + pow2(32) * high;
  if (rv >= MAX_INT) {
    console.warn('Int is bigger than JS can represent.');
    return Infinity;
  } else {
    return rv;
  }
}

/**
 * Determine whether `String.fromCharCode.apply` supports
 * typed arrays as input.
 *
 * @memberOf util
 * @returns {boolean} Whether `String.fromCharCode.apply` supports typed arrays
 */
function applySupportsTypedArray() {
  try {
    const uintbuf = new Uint8Array(new ArrayBuffer(4));
    uintbuf[0] = 66;
    uintbuf[1] = 76;
    uintbuf[2] = 85;
    uintbuf[3] = 69;
    const test = String.fromCharCode.apply(null, uintbuf);
    if (test !== 'BLUE') {
      return false;
    }
  } catch (error) {
    return false;
  }
  return true;
}

/**
 * Convert an ArrayBuffer to a string
 *
 * @memberOf util
 * @param   {ArrayBuffer | Array} buf Data buffer
 * @param   {boolean} [apply=undefined] whether or not apply supports typed arrays
 * @returns {string}  The string representation of the data buffer
 */
function ab2str(buf, apply) {
  const uintbuf = new Uint8Array(buf);
  // Set `_applySupportsTypedArray` as static variable
  if (typeof ab2str._applySupportsTypedArray == 'undefined') {
    // It has not... perform the initialization
    if (apply !== undefined) {
      ab2str._applySupportsTypedArray = apply;
    } else {
      ab2str._applySupportsTypedArray = applySupportsTypedArray();
    }
  }
  // Firefox 3.6 nor iOS devices can use ArrayBuffers with .apply
  if (ab2str._applySupportsTypedArray) {
    return String.fromCharCode.apply(null, uintbuf);
  } else {
    return uintbuf.reduce((prev, curr) => {
      return prev + String.fromCharCode(curr);
    }, '');
  }
}

/**
 * Convert a string to an ArrayBuffer
 *
 * @memberOf util
 * @param {string} str  The string being turning into an ArrayBuffer
 * @returns {ArrayBuffer} The ArrayBuffer representation of the string
 */
function str2ab(str) {
  const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

/**
 * Calculate $2^n$
 *
 * If 31 > n >= 0 then a left-shift is used, otherwise Math.pow is used.
 *
 * @memberOf util
 * @param {number} n  The exponent that we're raising 2 to -- i.e., 2^n
 * @returns {number}  The result of 2^n
 */
function pow2(n) {
  return n >= 0 && n < 31 ? 1 << n : pow2[n] || (pow2[n] = Math.pow(2, n));
}

/**
 * Internal method to create a new anchor element and uses location
 * properties (inherent) to get the desired URL data. Some String
 * operations are used (to normalize results across browsers).
 *
 * @memberOf util
 * @param   {string} url  Properly formatted URL
 * @returns {object}  Object containing URL pieces parsed out
 *
 * @see http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
 */
function parseURL(url) {
  const a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      const ret = {},
        seg = a.search.replace(/^\?/, '').split('&'),
        len = seg.length;
      for (let i = 0; i < len; i++) {
        if (!seg[i]) {
          continue;
        }
        let s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^/?#]+)$/i) || [null, ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^/]+(.+)/) || [null, ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/'),
  };
}

/**
 * Internal method to convert text from an HTTP response
 * into an ArrayBuffer.
 *
 * @memberOf util
 * @param {string}  text  Text from HTTP response being converted
 * @param {function}  oncomplete  Callback that will run after text is converted
 * @param {number}  [blocksize=1024]  How much data we're expecting
 */
function text2buffer(text, oncomplete, blocksize) {
  blocksize = blocksize || 1024;
  let i = 0;
  const arrayBuffer = new ArrayBuffer(text.length);
  const bufView = new Uint8Array(arrayBuffer);
  const worker = () => {
    const end = i + blocksize;
    for (; i < end; i++) {
      bufView[i] = text.charCodeAt(i) & 0xff;
    }
    if (i >= text.length) {
      oncomplete(arrayBuffer);
    } else {
      setTimeout(worker, 0);
    }
  };
  setTimeout(worker, 0);
}

export {
  endianness,
  update,
  getInt64,
  ab2str,
  str2ab,
  pow2,
  parseURL,
  text2buffer,
};
