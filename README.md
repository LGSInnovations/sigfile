SigFile
======================

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![Build Status](https://travis-ci.org/LGSInnovations/sigfile.svg?branch=master)](https://travis-ci.org/LGSInnovations/sigfile) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](.github/CONTRIBUTING.md#pull-requests) [![npm version](https://badge.fury.io/js/sigfile.svg)](https://badge.fury.io/js/sigfile)

SigFile provides MATLAB file parsing and XMIDAS Bluefile parsing in JS.

## Installation

```
npm i sigfile
```

## Example

### Extracting the header from a Bluefile

```javascript
var sigfile = require('sigfile');
var fs = require('fs');

fs.readFile('../test/dat/ramp.tmp', function(err, buf) {
    let header = new sigfile.bluefile.BlueHeader(buf.buffer);
    console.log(header);
});
```
