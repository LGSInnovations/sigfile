declare module 'sigfile' {
  export class BlueFileReader {
  }

  export class BlueHeader {
    static ARRAY_BUFFER_ENDIANNESS: string;
    static _SPA: { [key: string]: string; };
    static _BPS: { [key: string]: string; };
    static _XM_TO_TYPEDARRAY: { [key: string]: string; };
    static _XM_TO_DATAVIEW: { [key: string]: string; };

    options: { [key: string]: any };

    constructor(buf: ArrayBuffer, options: object);
  }
}
