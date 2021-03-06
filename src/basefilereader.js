import { parseURL, text2buffer } from './util';

/**
 * Abstract class that should be extended
 */
class BaseFileReader {
  /**
   * Constructs a file reader for specific file types
   *
   * @param {BlueFileHeader|MatFileHeader} header_class
   * @param {object} options
   * @returns {BaseFileReader}
   */
  constructor(header_class, options) {
    this.header_class = header_class;
    this.options = options;
  }

  /**
   * Internal method that will read a file or stop at the header
   *
   * @private
   * @memberof BaseFileReader
   * @param {File} theFile - a File object for the Bluefile or Matfile
   * @param {function} onload - callback when the header has been read
   * @param {boolean} justHeader - Whether or not to only read the header
   */
  _read(theFile, onload, justHeader) {
    const that = this;
    const reader = new FileReader();

    // Note: webkitSlice is Chrome specific and deprecated now.
    // For some backwards-compatibility, we'll continue to support it.
    // In a future version, this will just use `File.slice`.
    const sliceMethod =
      theFile.webkitSlice === undefined ? 'slice' : 'webkitSlice';
    const blob = justHeader ? theFile[sliceMethod](0, 512) : theFile;

    // Closure to capture the file information.
    reader.onloadend = ((theFile) => {
      return function (e) {
        if (e.target.error) {
          onload(null);
          return;
        }
        const raw = reader.result;
        const hdr = new that.header_class(raw, that.options);
        hdr.file = theFile;
        hdr.file_name = theFile.name;
        onload(hdr);
      };
    })(theFile);
    reader.readAsArrayBuffer(blob);
  }

  /**
   * Read only the header from a local {Blue,Mat}file.
   *
   * @memberof BaseFileReader
   * @param {File} theFile - a File object for the Bluefile or Matfile
   * @param {function} onload - callback when the header has been read
   */
  readheader(theFile, onload) {
    this._read(theFile, onload, true);
  }

  /**
   * Read a local Bluefile or Matfile on disk.
   *
   * @memberof BaseFileReader
   * @param {File} theFile - a File object for the Bluefile or Matfile
   * @param {function} onload - callback when the file has been read
   */
  read(theFile, onload) {
    this._read(theFile, onload, false);
  }

  /**
   * Read a Bluefile or Matfile from a URL
   *
   * @memberof BaseFileReader
   * @param {string} href - the URL for the Bluefile or Matfile
   * @param {function} onload - callback when the header has been read
   */
  read_http(href, onload) {
    const that = this;
    const oReq = new XMLHttpRequest();
    oReq.open('GET', href, true);
    oReq.responseType = 'arraybuffer';
    oReq.overrideMimeType('text/plain; charset=x-user-defined');
    oReq.onload = function (_oEvent) {
      if (oReq.readyState === 4) {
        if (oReq.status === 200 || oReq.status === 0) {
          // status = 0 is necessary for file URL
          let arrayBuffer = null; // Note: not oReq.responseText
          if (oReq.response) {
            arrayBuffer = oReq.response;
            const hdr = new that.header_class(arrayBuffer, that.options);
            const fileUrl = parseURL(href);
            hdr.file_name = fileUrl.file;
            onload(hdr);
          } else if (oReq.responseText) {
            text2buffer(oReq.responseText, function (arrayBuffer) {
              const hdr = new that.header_class(arrayBuffer, that.options);
              const fileUrl = parseURL(href);
              hdr.file_name = fileUrl.file;
              onload(hdr);
            });
          }
          return;
        }
      }
      onload(null);
    };
    oReq.onerror = function (_oEvent) {
      onload(null);
    };
    oReq.send(null);
    return oReq;
  }
}

export { BaseFileReader };
