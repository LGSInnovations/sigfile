SigFile
======================

SigFile provides MATLAB file parsing and XMIDAS Bluefile parsing in JS.

## Installation

```
npm install git+https://git@github.com/LGSinnovations/sigfile.git
```

## Example

### Extracting the header from a Bluefile

```
var sigfile = require('sigfile');
var fs = require('fs');

fs.readFile('../test/dat/ramp.tmp', function(err, buf) {
    let header = new sigfile.bluefile.BlueHeader(buf.buffer);
    console.log(header);
});
```
