declare module "basefilereader" {
  // TODO: Determine the right type for `hdr` in below callback
  export type ReadCallback = (hdr: any) => void;

  export class BaseFileReader {
    header_class: BaseFileReader;
    options: { [key: string]: any };

    // TODO: Determine the right type for `options`
    constructor(header_class: BaseFileReader, options: { [key: string]: any });

    private _read(theFile: Blob, onload: ReadCallback): void;

    readheader(theFile: Blob, onload: ReadCallback): void;

    read(theFile: Blob, onload: ReadCallback): void;

    read_http(url: string, onload: ReadCallback): void;
  }
}
