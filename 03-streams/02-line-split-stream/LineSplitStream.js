const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.array = [];
  }

  _transform(chunk, encoding, callback) {
    // 1) работает, но тесты не проходит
    // this.array = chunk.toString().split(os.EOL);
    //
    // if (this.array.length > 1) {
    //   this.array.forEach((str) => this.push(`${str}${os.EOL}`));
    // }
    // callback();

    // 2) не работает, ругается на ERR_MULTIPLE_CALLBACK
    // this.array = chunk.toString().split(os.EOL);
    //
    // if (this.array.length > 1) {
    //   this.array.forEach((str) => {
    //     callback(null, `${str}${os.EOL}`);
    //     this.pause();
    //     this.once('drain', () => {
    //       this.resume();
    //     });
    //   },
    //   );
    // }
  }

  _flush(callback) {
    callback();
    // callback(this.array[0]);
    // if (this.array.length === 1) {
    //   callback(null, this.array[0]);
    // }
  }
}

module.exports = LineSplitStream;
