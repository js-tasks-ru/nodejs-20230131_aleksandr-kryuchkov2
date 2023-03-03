const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.lastStrWithoutEol = '';
  }

  _transform(chunk, encoding, callback) {
    const chunkStr = chunk.toString();
    const arr = chunkStr.split(os.EOL);

    const pushData = (array) => array.forEach((str) => this.push(str));

    if (chunkStr.endsWith(os.EOL)) {
      pushData(arr);
      this.lastStrWithoutEol = '';
    } else {
      if (this.lastStrWithoutEol !== '') {
        arr[0] = this.lastStrWithoutEol + arr[0];
      };
      this.lastStrWithoutEol = arr.pop();
      pushData(arr);
    }
    callback();
  }

  _flush(callback) {
    if (this.lastStrWithoutEol !== '') {
      callback(null, this.lastStrWithoutEol);
    } else {
      callback();
    }
  }
}

module.exports = LineSplitStream;
