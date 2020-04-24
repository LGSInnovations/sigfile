declare module "matfile" {
  export class MatHeader {
    file: Blob;
    file_name: string;
    buf: ArrayBuffer;
    headerStr: string;
    datarep: string;

    headerList: string[];
    matfile: string;
    platform: string;
    createdOn: string;
    subsystemOffset: string;
    version: number;
    versionName: string;

    dataType: number;
    dataTypeName: string;
    arraySize: number;

    // Created in setData
    dview: number[];

    constructor(buf: ArrayBuffer);

    setData(buf: ArrayBuffer, dvhdr: DataView, currIndex: number, littleEndian: boolean);
  }

  export class MatFileReader {
    constructor(options: { [key: string]: string });

    readheader(theFile: Blob, onload: ((hdr: MatHeader) => void));

    read(theFile: Blob, onload: ((hdr: MatHeader) => void));

    read_http(href: string, onload: ((hdr: MatHeader) => void));
  }
}
