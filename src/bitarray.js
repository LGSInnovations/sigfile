import * as sigplot_bitarray from 'sigplot-bitarray';
const BA = sigplot_bitarray.BitArray;

/**
 * BitArray class implementing the JS `TypedArray` interface
 * for a binary array.
 */
class BitArray {
  /**
   * Constructor for `BitArray`
   *
   * This allows you to provide either an `ArrayBuffer` with pre-existing
   * data or a requested bit-size of the BitArray.
   *
   * @example <caption>Setting up BitArray with requested number of bits</caption>
   * const arr = new BitArray(32);
   *
   * @example <caption>Setting up BitArray from another ArrayBuffer</caption>
   * const u8_arr = new Uint8Array([255, 230]);
   * const arr = new BitArray(u8_arr.buffer);
   *
   * @memberOf BitArray
   * @param {ArrayBuffer|number} buf - Either an existing buffer containing data
   *                                   or a number indicating the size of the BitArray
   * @returns {BitArray}
   */
  constructor(buf) {
    if (!(buf instanceof ArrayBuffer) && typeof buf === 'number') {
      this.bitarray = BA.new_with_length(buf);
    } else {
      this.buffer = buf;
      this.bitarray = BA.new_with_offset_and_length(buf, 0, buf.byteLength);
    }
    return new Proxy(this, {
      get(obj, prop) {
        if (!obj[prop]) {
          return obj.getBit(prop);
        } else {
          return obj[prop];
        }
      },
      set(obj, prop, value) {
        const propInt = parseInt(prop);
        if (isNaN(propInt)) {
          return false;
        } else {
          obj.setBit(prop, value);
          return true;
        }
      },
    });
  }

  /**
   * Wrapper around `BitArray.setArray` to ensure further
   * compliance to TypedArray interface.
   *
   * @param {ArrayLike|Array} array
   * @see {@link setArray} for further information.
   */
  set(array) {
    this.bitarray.setArray(array);
  }

  /**
   * Get the bit (0 or 1) at bit index `idx`
   *
   * @example <caption>Getting a bit at index 0 with getBit</caption>
   * // returns 1
   * const u8_arr = new Uint8Array([255, 0]);
   * const arr = new BitArray(u8_arr.buffer);
   * arr.getBit(0)
   *
   * @example <caption>Getting a bit at index 0 with []</caption>
   * // returns 1
   * const u8_arr = new Uint8Array([255, 0]);
   * const arr = new BitArray(u8_arr.buffer);
   * arr[0]
   *
   * @memberOf BitArray
   * @param {number} idx - Bit index
   * @returns {number} 0 or 1 depending on if bit at `idx` is set
   */
  getBit(idx) {
    return this.bitarray.get_bit(idx);
  }

  /**
   * Size of `BitArray`
   *
   * @example <caption>Getting the length of BitArray</caption>
   * // returns 16
   * const u8_arr = new Uint8Array([255, 0]);
   * const arr = new BitArray(u8_arr.buffer);
   * arr.length
   *
   * @memberOf BitArray
   * @returns {number} The size of `BitArray` in number of bits
   */
  get length() {
    return this.bitarray.length;
  }

  /**
   * Set the bit at bit index `idx`
   *
   * Note: Non-zero `val` will set the bit to 1. 0 or undefined
   * `val` will set the bit to 0.
   *
   * @example <caption>Set the bit at index 0 to 1</caption>
   * const u8_arr = new Uint8Array([255, 0]);
   * const arr = new BitArray(u8_arr.buffer);
   * arr.setBit(0, 1);
   *
   * @memberOf BitArray
   * @param {number} idx - Bit index to set bit
   * @param {number?} val Value of bit to set (0 or 1)
   */
  setBit(idx, val) {
    this.bitarray.setBit(idx, val);
  }

  /**
   * Set the BitArray to `array`
   *
   * @example <caption>Set the BitArray to another binary array</caption>
   * const arr = new BitArray(4);
   * arr.setArray([1, 0, 0, 0);
   *
   * @memberOf BitArray
   * @param {ArrayLike|number[]|BitArray} array - An array of binary data
   */
  setArray(array) {
    this.bitarray.setArray(array);
  }

  /**
   * Returns the binary array from [start, stop)
   *
   * Note: if `start` and `stop` aren't provided,
   * this will return the entire array from [0, array.length].
   *
   * @example <caption>Get the subarray from 0 to 4</caption>
   * // returns [1, 1, 1, 1]
   * const u8_arr = new Uint8Array([255, 0]);
   * const arr = new BitArray(u8_arr);
   * arr.subarray(0, 4);
   *
   * @memberOf BitArray
   * @param {number?} start - Start bit index
   * @param {number?} stop - Stop bit index
   * @returns {Uint8Array} Binary array in [`start`, `stop`)
   */
  subarray(start, stop) {
    return this.bitarray.subarray(start, stop);
  }
}

export default BitArray;
