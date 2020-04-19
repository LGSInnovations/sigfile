export default class BitArray {
  /**
   * Constructor for `BitArray`
   *
   * This allows you to provide either an `ArrayBuffer` with pre-existing
   * data or a requested bit-size of the BitArray.
   *
   * @param {ArrayBuffer|number} buf  Either an existing buffer containing data
   *                                  or a number indicating the size of the BitArray
   * @returns {BitArray}
   */
  constructor(buf) {
    if (!(buf instanceof ArrayBuffer) && typeof buf === 'number') {
      this.buffer = new ArrayBuffer(buf / 8);
      this.u8 = new Uint8Array(this.buffer);
    } else {
      this.buffer = buf;
      this.u8 = new Uint8Array(buf);
    }
    return new Proxy(this, {
      get(obj, prop) {
        if (!obj[prop]) {
          return obj.getBit(prop);
        } else {
          return obj[prop];
        }
      },
    });
  }

  /**
   * Get the bit (0 or 1) at bit index `idx`
   *
   * @param {number} idx  Bit index
   * @returns {number}  0 or 1 depending on if bit at `idx` is set
   */
  getBit(idx) {
    const v = this.u8[idx >> 3];
    const off = idx & 0x7;
    return (v >> (7 - off)) & 1;
  }

  /**
   * Size of `BitArray`
   *
   * @returns {number}  The size of `BitArray` in number of bits
   */
  get length() {
    return this.u8.byteLength * 8;
  }

  /**
   * Set the bit at bit index `idx`
   *
   * Note: Non-zero `val` will set the bit to 1. 0 or undefined
   * `val` will set the bit to 0.
   *
   * @param {number} idx  Bit index to set bit
   * @param {number?} val Value of bit to set (0 or 1)
   */
  setBit(idx, val) {
    const off = idx & 0x7;
    if (val) {
      this.u8[idx >> 3] |= 0x80 >> off;
    } else {
      this.u8[idx >> 3] &= ~(0x80 >> off);
    }
  }

  /**
   * Set the BitArray to `array`
   *
   * @param {ArrayLike|number[]|BitArray} array   An array of binary data
   */
  setArray(array) {
    for (let i = 0, len = array.length; i < len; i++) {
      this.setBit(i, array[i]);
    }
  }

  /**
   * Returns the binary array from [start, stop)
   *
   * @param {number?} start  Start bit index
   * @param {number?} stop   Stop bit index
   * @returns {Array} Binary array in [`start`, `stop`)
   */
  subarray(start, stop) {
    let sub = [];
    start = start || 0;
    start = start < 0 ? 0 : start;
    stop = stop || this.length;
    stop = stop > this.length ? this.length : stop;
    for (let i = start; i < stop; i++) {
      sub.push(this.getBit(i));
    }
    return sub;
  }
}
