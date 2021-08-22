describe('ResponseMock', () => {

  const ResponseMock = require('./ResponseMock');

  it('should emit data', (done) => {

    const response = new ResponseMock(200);

    expect(response.statusCode).toEqual(200);

    response.on('data', chunk => {

      expect(chunk).toEqual('value');
      done();
    });

    response.emit('data', 'value');
  });

  it('should emit end', (done) => {

    const response = new ResponseMock(400);

    response.on('end', value => {

      expect(response.statusCode).toEqual(400);
      done();
    });

    response.emit('end');
  });

  it('should implement setEncoding', () => {

    const response = new ResponseMock(200);

    expect(typeof response.setEncoding).toEqual('function');
  });
});