declare module "bitarray" {
  export class BitArray {
    buffer: ArrayBuffer;
    u8: Uint8Array;
    readonly length: number;

    constructor(buf: ArrayBuffer | number);

    set(array: Array<number> | BitArray): void;

    getBit(idx: number): number;

    setBit(idx: number, val: number): void;

    setArray(array: Array<number> | BitArray): void;

    subarray(start: number, stop: number): Array<number>;
  }
}
