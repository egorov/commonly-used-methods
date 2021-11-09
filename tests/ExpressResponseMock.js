'use strict';

class ExpressResponseMock {
  constructor() {
    this.sent = [];
    this.statuses = [];
  }

  end() {
    return this;
  }

  send(body) {
    this.sent.push(body);

    return this;
  }

  status(number) {
    this.statuses.push(number);
    
    return this;
  }
}

module.exports = ExpressResponseMock;