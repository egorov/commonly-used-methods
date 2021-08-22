const util = require('util');
const emitter = require('events');

function RequestMock(emitOnResponse) {

  this._emitOnResponse = emitOnResponse;

  emitter.call(this);
}

util.inherits(RequestMock, emitter);

RequestMock.prototype.end = function() {
  this.emit('response', this._emitOnResponse);  
};

RequestMock.prototype.write = function() {};

module.exports = RequestMock;