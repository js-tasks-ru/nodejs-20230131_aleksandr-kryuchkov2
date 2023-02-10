const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.str = '';
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.str += chunk.toString();

    if (Buffer.from(this.str).length < this.limit + 1) {
      callback(null, chunk);
    } else {
      callback(new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
