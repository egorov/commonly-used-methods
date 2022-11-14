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

  it('should deal with binary body', (done) => {

    const response = new ResponseMock(200);
    const state = {
      httpRequestBody: Buffer.from('binary content'),
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

  it('should deal with request timeout', (done) => {
    
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

        expect(state.error).toEqual(new Error('Request timed out!'));
        expect(state.httpResponse).toEqual(response);
        expect(state.httpResponseBody).toBeUndefined();

        done();
      });

    request.emit('timeout');
  });

  if('should do nothing if error already set', (done) => {

    const error = new Error('Something wrong!');
    const response = new ResponseMock(200);
    const state = {
      error,
      httpRequestBody: { a: 'a' },
      httpTransport: {
        request: () => new RequestMock(response)
      }
    };
 
    executeHttpRequest(state)
      .then(() => {

        expect(state.error).toEqual(error);
        expect(state.httpResponse).toBeUndefined();
        expect(state.httpResponseBody).toBeUndefined();
       
        done();
      });

    response.emit('data', JSON.stringify(expected));
    response.emit('end');
  });

  it('should unpack gunzipped response', (done) => {

    const { gzip } = require('zlib');
    const content = JSON.stringify(expected);
    const buffer = Buffer.from(content);
    const response = new ResponseMock(200);
    const state = {
      httpRequestBody: { a: 'a' },
      httpTransport: {
        request: () => new RequestMock(response)
      }
    };

    response.setHeaders({
      'content-encoding': 'gzip'
    })

    gzip(buffer, (error, compressed) => {

      expect(error).toBeNull();

      executeHttpRequest(state)
      .then(() => {

        expect(state.error).toBeUndefined();
        expect(state.httpResponse).toEqual(response);

        const body = JSON.parse(state.httpResponseBody);

        expect(body).toEqual(expected);
        
        done();
      });

      response.emit('data', compressed);
      response.emit('end');      
    });    
  });

  it('should unpack brottli packed response', (done) => {

    const { brotliCompress } = require('zlib');
    const content = JSON.stringify(expected);
    const buffer = Buffer.from(content);
    const response = new ResponseMock(200);
    const state = {
      httpRequestBody: { a: 'a' },
      httpTransport: {
        request: () => new RequestMock(response)
      }
    };

    response.setHeaders({
      'content-encoding': 'br'
    })

    brotliCompress(buffer, (error, compressed) => {

      expect(error).toBeNull();

      executeHttpRequest(state)
      .then(() => {

        expect(state.error).toBeUndefined();
        expect(state.httpResponse).toEqual(response);

        const body = JSON.parse(state.httpResponseBody);

        expect(body).toEqual(expected);
        
        done();
      });

      response.emit('data', compressed);
      response.emit('end');      
    });    
  });

  it('should unpack deflate packed response', (done) => {

    const { deflate } = require('zlib');
    const content = JSON.stringify(expected);
    const buffer = Buffer.from(content);
    const response = new ResponseMock(200);
    const state = {
      httpRequestBody: { a: 'a' },
      httpTransport: {
        request: () => new RequestMock(response)
      }
    };

    response.setHeaders({
      'content-encoding': 'deflate'
    })

    deflate(buffer, (error, compressed) => {

      expect(error).toBeNull();

      executeHttpRequest(state)
      .then(() => {

        expect(state.error).toBeUndefined();
        expect(state.httpResponse).toEqual(response);

        const body = JSON.parse(state.httpResponseBody);

        expect(body).toEqual(expected);
        
        done();
      });

      response.emit('data', compressed);
      response.emit('end');      
    });    
  });  
});