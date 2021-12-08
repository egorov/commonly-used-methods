const { Stream } = require('stream');

class ResponseMock extends Stream {

  constructor(statusCode) {
    super();

    this.statusCode = statusCode;
  }

  setEncoding() {}

  setHeaders(value) {
    this.headers = value;
  }
}

module.exports = ResponseMock;