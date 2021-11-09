const EventEmitter = require('events');

class ResponseMock extends EventEmitter {

  constructor(statusCode) {
    super();

    this.statusCode = statusCode;
  }

  setEncoding() {}
}

module.exports = ResponseMock;