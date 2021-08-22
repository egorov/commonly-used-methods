describe('executeHttpRequest', () => {

  const executeHttpRequest = require('../src/executeHttpRequest');
  const RequestMock = require('./RequestMock');
  const ResponseMock = require('./ResponseMock');
  const expected = {
    id: 39012,
    name: 'Jack'
  };

  it('should set httpResponseBody state', (done) => {

    const response = new ResponseMock(200);
    const state = {
      httpRequestBody: { a: 'a' },
      httpTransport: {
        request: () => new RequestMock(response)
      }
    };
 
    executeHttpRequest(state)
      .then(() => {

        expect(state.error).toBeUndefined();
        expect(state.httpResponse).toEqual(response);

        const body = JSON.parse(state.httpResponseBody);

        expect(body).toEqual(expected);
        
        done();
      });

    response.emit('data', JSON.stringify(expected));
    response.emit('end');
  });

  it('should deal with response error', (done) => {
    
    const response = new ResponseMock(200);
    const state = {
      httpRequestBody: { a: 'a' },
      httpTransport: {
        request: () => new RequestMock(response)
      }
    };
 
    executeHttpRequest(state)
      .then(() => {

        expect(state.error).toEqual(new Error('Response failed!'));
        expect(state.httpResponse).toEqual(response);
        expect(state.httpResponseBody).toBeUndefined();

        done();
      });

    response.emit('error', new Error('Response failed!'));
  });

  it('should deal with request error', (done) => {
    
    const response = new ResponseMock(200);
    const request = new RequestMock(response);
    const state = {
      httpRequestBody: { a: 'a' },
      httpTransport: {
        request: () => request
      }
    };
 
    executeHttpRequest(state)
      .then(() => {

        expect(state.error).toEqual(new Error('Request failed!'));
        expect(state.httpResponse).toEqual(response);
        expect(state.httpResponseBody).toBeUndefined();

        done();
      });

    request.emit('error', new Error('Request failed!'));
  });  
});