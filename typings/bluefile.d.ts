/**
 * Modified from https://github.com/Geontech/sigplot/tree/develop-2.0-ts/typings
 *
 * @author Thomas Goodwin https://github.com/btgoodwin
 */
declare module "bluefile" {

  import { BaseFileReader } from "./basefilereader";
  import { BitArray } from "./bitarray";

  export class BlueHeaderOptions {
    version?: string;
    headrep?: string;
    datarep?: string;
    ext_start?: number;
    ext_size?: number;
    type?: number;
    class?: number;
    format?: string;
    timecode?: number;

    xstart?: number;
    xdelta?: number;
    xunits?: number;
    ystart?: number;
    ydelta?: number;
    yunits?: number;
    subsize?: number;

    data_start?: number;
    data_size?: number;
    pipesize?: number;
    ext_header?: object;

    spa?: number;
    bps?: number;
    bpa?: number;
    ape?: number;
    bpe?: number;
    size?: number;
    dview?: DataView;
  }

  export class BlueHeader {

    // Created in the constructor
    options: BlueHeaderOptions;
    file: Blob;
    file_name: string;
    offset: number;
    buf: ArrayBuffer; // Note: only supports valid or null in code
    version: string;
    headrep: string;
    datarep: string;
    ext_start: number;
    ext_size: number;
    type: number;
    class: number; // Note: options.type / 1000 in constructor
    format: string;
    timecode: number;

    // Class 1 & 2 check (like SRI)
    xstart: number;
    xdelta: number;
    xunits: number;
    ystart: number;
    ydelta: number;
    yunits: number;
    subsize: number;

    data_start: number;
    data_size: number;
    ext_header: object;

    // Created in the setData
    spa: number;
    bps: number;
    bpa: number;
    ape: number;
    bpe: number;
    dview: DataView;
    size: number;

    constructor(
      buf: ArrayBuffer,
      options: BlueHeaderOptions
    );

    setHeader(): void;

    setData(
      buf: ArrayBuffer,
      offset: number,
      data_end: boolean,
      littleEndian?: boolean
    );

    unpack_keywords(
      buf: ArrayBuffer,
      lbuf: number,
      offset: number,
      littleEndian: boolean
    );

    // FIXME: TypedArray -- need to declare/find return type.
    createArray(
      buf: ArrayBuffer,
      offset: number,
      length: number
    ): BitArray | Uint8Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array;
  }

  export class BlueFileReader extends BaseFileReader {
    constructor(options: BlueHeaderOptions);

    readheader(
      theFile: Blob,
      onload: ((hdr: BlueHeader) => void)
    );

    read(
      theFile: Blob,
      onload: ((hdr: BlueHeader) => void)
    );

    read_http(
      href: string,
      onload: ((hdr: BlueHeader) => void)
    );
  }

}
