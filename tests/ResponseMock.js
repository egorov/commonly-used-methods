const util = require('util');
const emitter = require('events');

function ResponseMock(statusCode) {

  this.statusCode = statusCode;  

  emitter.call(this);
}

util.inherits(ResponseMock, emitter);

ResponseMock.prototype.setEncoding = function() {}

module.exports = ResponseMock;