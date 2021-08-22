describe('requestMock', () => {

  const RequestMock = require('./RequestMock');

  it('end call should emit response', (done) => {

    const value = 'value';
    const request = new RequestMock(value);

    request.on('response', response => {

      expect(response).toEqual(value);
      done();
    }); 

    request.end();
  });

  it('should implement write method', () => {

    const request = new RequestMock('value');

    expect(typeof request.write).toEqual('function');
  });
});