export default class BitArray {
  constructor(buf) {
    if (!(buf instanceof ArrayBuffer) && typeof buf === 'number') {
      this.buffer = new ArrayBuffer(buf / 8);
    }  else {
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
      }
    });
  }

  getBit(idx) {
    var v = this.u8[idx >> 3];
    var off = idx & 0x7;
    return (v >> (7 - off)) & 1;
  }

  get length() {
    return this.u8.byteLength * 8;
  }

  setBit(idx, val) {
    var off = idx & 0x7;
    if (val) {
      this.u8[idx >> 3] |= (0x80 >> off);
    } else {
      this.u8[idx >> 3] &= ~(0x80 >> off);
    }
  }

  setArray(array) {
    for (let i = 0, len = array.length; i < len; i++) {
      this.setBit(i, array[i]);
    }
  }

  subarray(start, stop) {
    let sub = [];
    start = start || 0;
    stop = stop || this.length;
    stop = stop > this.length ? this.length : stop;
    for (let i = start; i < stop; i++) {
      sub.push(this.getBit(i));
    }
    return sub;
  }
}
