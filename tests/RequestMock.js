const EventEmitter = require('events');

class RequestMock extends EventEmitter {
  
  constructor(emitOnResponse) {
    super();
    this._emitOnResponse = emitOnResponse;
  }

  end() {
    this.emit('response', this._emitOnResponse);
  }

  write() {}
}

module.exports = RequestMock;