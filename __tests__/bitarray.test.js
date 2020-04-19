import 'jest';
import { expect } from 'chai';
import BitArray from '../src/bitarray';

describe('BitArray class', () => {
  it('should construct with a passed in ArrayBuffer', () => {
    const buf = new Uint8Array([15, 15]);
    const arr = new BitArray(buf.buffer);
    expect(arr.buffer.byteLength).to.eql(2);
    expect(arr.u8.length).to.eql(2);
  });
  it('should construct with a passed in number of bits', () => {
    const arr = new BitArray(32);
    expect(arr.buffer.byteLength).to.eql(4);
    expect(arr.u8.length).to.eql(4);
  });
  it('should return its length', () => {
    const buf = new Uint8Array([15, 15]);
    const arr = new BitArray(buf.buffer);
    expect(arr.length).to.eql(16);
  });
  it('should get a bit value at a specific bit index', () => {
    const buf = new Uint8Array([255, 0]);
    const arr = new BitArray(buf.buffer);
    for (let i = 0; i < 8; ++i) {
      expect(arr.getBit(i)).to.eql(1);
    }
    for (let i = 8; i < 16; ++i) {
      expect(arr.getBit(i)).to.eql(0);
    }
  });
  it('should get a bit value at a specific bit index with []', () => {
    const buf = new Uint8Array([255, 0]);
    const arr = new BitArray(buf.buffer);
    for (let i = 0; i < 8; ++i) {
      expect(arr[i]).to.eql(1);
    }
    for (let i = 8; i < 16; ++i) {
      expect(arr[i]).to.eql(0);
    }
  });
  it('should set a bit value to 1 at a specific bit index', () => {
    const buf = new Uint8Array([0, 0]);
    const arr = new BitArray(buf.buffer);
    expect(arr.getBit(0)).to.eql(0);
    arr.setBit(0, 1);
    expect(arr.getBit(0)).to.eql(1);
  });
  it('should set a bit value to 0 at a specific bit index', () => {
    const buf = new Uint8Array([255, 255]);
    const arr = new BitArray(buf.buffer);
    expect(arr.getBit(0)).to.eql(1);
    arr.setBit(0, 0);
    expect(arr.getBit(0)).to.eql(0);
    arr.setBit(0, 0);
    expect(arr.getBit(0)).to.eql(0);
  });
  it('should set multiple bits from an input array', () => {
    const buf = new Uint8Array([0, 0]);
    const arr = new BitArray(buf.buffer);
    const newArr = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1];
    for (let i = 0; i < arr.length; ++i) {
      expect(arr.getBit(i)).to.eql(0);
    }
    arr.setArray(newArr);
    for (let i = 0; i < 8; ++i) {
      expect(arr.getBit(i)).to.eql(0);
    }
    for (let i = 8; i < arr.length; ++i) {
      expect(arr.getBit(i)).to.eql(1);
    }
  });
  it('should set multiple bits from an input array from empty', () => {
    const arr = new BitArray(16);
    const newArr = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1];
    for (let i = 0; i < arr.length; ++i) {
      expect(arr.getBit(i)).to.eql(0);
    }
    arr.setArray(newArr);
    for (let i = 0; i < 8; ++i) {
      expect(arr.getBit(i)).to.eql(0);
    }
    for (let i = 8; i < arr.length; ++i) {
      expect(arr.getBit(i)).to.eql(1);
    }
  });
  it('should return a subarray', () => {
    const buf = new Uint8Array([255, 0]);
    const arr = new BitArray(buf.buffer);
    const newArr = arr.subarray(5, 10);
    expect(newArr[0]).to.eql(1);
    expect(newArr[1]).to.eql(1);
    expect(newArr[2]).to.eql(1);
    expect(newArr[3]).to.eql(0);
    expect(newArr[4]).to.eql(0);
  });
  it('should return a subarray in bounds with bad input', () => {
    const buf = new Uint8Array([255, 0]);
    const arr = new BitArray(buf.buffer);
    const newArr = arr.subarray(-100, 100000);
    expect(newArr.length).to.eql(arr.length);
  });
  it('should return a subarray in bounds with no input', () => {
    const buf = new Uint8Array([255, 0]);
    const arr = new BitArray(buf.buffer);
    const newArr = arr.subarray();
    expect(newArr.length).to.eql(arr.length);
  });
});
