declare module "util" {
  type OnComplete = (buf: ArrayBuffer) => void;

  export class URLObject {
    source: string;
    protocol: string;
    host: string;
    port: number;
    query: string;
    params: {[key: string]: string};
    file: string;
    hash: string;
    path: string;
    relative: string;
    segments: string[];
  }

  export function endianness(): string;

  export function update(dst: object, src: object): object;

  export function getInt64(dataView: DataView, index: number, littleEndian: boolean): number;

  export function applySupportsTypedArray(): boolean;

  export function ab2str(buf: ArrayBuffer, apply?: boolean): string;

  export function str2ab(str: string): ArrayBuffer;

  export function pow2(n: number): number;

  export function parseURL(url: string): URLObject;

  export function text2buffer(text: string, oncomplete: OnComplete, blocksize?: number): void;
}
