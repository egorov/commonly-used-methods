describe('execute_http_request', () => {

  const execute_http_request = require('../src/execute_http_request');
  const RequestMock = require('./RequestMock');
  const ResponseMock = require('./ResponseMock');
  const expected = { id: 39012, name: 'Jack' };

  it('should set response body as string', (done) => {

    const response = new ResponseMock(200);
    const state = {
      http_request_body: { a: 'a' },
      http_request_encoding: 'utf-8',
      http_transport: {
        request: () => new RequestMock(response)
      }
    };
 
    execute_http_request(state)
      .then(() => {

        expect(state.error).toBeUndefined();
        expect(state.http_response).toEqual(response);

        const body = JSON.parse(state.http_response_body);

        expect(body).toEqual(expected);
        
        done();
      });

    response.emit('data', JSON.stringify(expected));
    response.emit('end');
  });

  it('should set response body as buffer', (done) => {

    const response = new ResponseMock(200);
    const state = {
      http_request_body: Buffer.from('binary content'),
      http_transport: {
        request: () => new RequestMock(response)
      }
    };
 
    execute_http_request(state)
      .then(() => {

        expect(state.error).toBeUndefined();
        expect(state.http_response).toEqual(response);

        const body = JSON.parse(state.http_response_body.toString('utf-8'));

        expect(body).toEqual(expected);
        
        done();
      });

    response.emit('data', Buffer.from(JSON.stringify(expected)));
    response.emit('end');
  });

  it('should deal with response error', (done) => {
    
    const response = new ResponseMock(200);
    const state = {
      http_request_body: { a: 'a' },
      http_transport: {
        request: () => new RequestMock(response)
      }
    };
 
    execute_http_request(state)
      .then(() => {

        expect(state.error).toEqual(new Error('Response failed!'));
        expect(state.http_response).toEqual(response);
        expect(state.http_response_body).toBeUndefined();

        done();
      });

    response.emit('error', new Error('Response failed!'));
  });

  it('should deal with request error', (done) => {
    
    const response = new ResponseMock(200);
    const request = new RequestMock(response);
    const state = {
      http_request_body: { a: 'a' },
      http_transport: {
        request: () => request
      }
    };
 
    execute_http_request(state)
      .then(() => {

        expect(state.error).toEqual(new Error('Request failed!'));
        expect(state.http_response).toEqual(response);
        expect(state.http_response_body).toBeUndefined();

        done();
      });

    request.emit('error', new Error('Request failed!'));
  });

  it('should deal with request timeout', (done) => {
    
    const response = new ResponseMock(200);
    const request = new RequestMock(response);
    const state = {
      http_request_body: { a: 'a' },
      http_transport: {
        request: () => request
      }
    };
 
    execute_http_request(state)
      .then(() => {

        expect(state.error).toEqual(new Error('Request timed out!'));
        expect(state.http_response).toEqual(response);
        expect(state.http_response_body).toBeUndefined();

        done();
      });

    request.emit('timeout');
  });

  if('should do nothing if error already set', (done) => {

    const error = new Error('Something wrong!');
    const response = new ResponseMock(200);
    const state = {
      error,
      http_request_body: { a: 'a' },
      http_transport: {
        request: () => new RequestMock(response)
      }
    };
 
    execute_http_request(state)
      .then(() => {

        expect(state.error).toEqual(error);
        expect(state.http_response).toBeUndefined();
        expect(state.http_response_body).toBeUndefined();
       
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
      http_request_body: { a: 'a' },
      http_transport: {
        request: () => new RequestMock(response)
      }
    };

    response.setHeaders({
      'content-encoding': 'gzip'
    })

    gzip(buffer, (error, compressed) => {

      expect(error).toBeNull();

      execute_http_request(state)
      .then(() => {

        expect(state.error).toBeUndefined();
        expect(state.http_response).toEqual(response);

        const body = JSON.parse(state.http_response_body);

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
      http_request_body: { a: 'a' },
      http_transport: {
        request: () => new RequestMock(response)
      }
    };

    response.setHeaders({
      'content-encoding': 'br'
    })

    brotliCompress(buffer, (error, compressed) => {

      expect(error).toBeNull();

      execute_http_request(state)
      .then(() => {

        expect(state.error).toBeUndefined();
        expect(state.http_response).toEqual(response);

        const body = JSON.parse(state.http_response_body);

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
      http_request_body: { a: 'a' },
      http_transport: {
        request: () => new RequestMock(response)
      }
    };

    response.setHeaders({
      'content-encoding': 'deflate'
    })

    deflate(buffer, (error, compressed) => {

      expect(error).toBeNull();

      execute_http_request(state)
      .then(() => {

        expect(state.error).toBeUndefined();
        expect(state.http_response).toEqual(response);

        const body = JSON.parse(state.http_response_body);

        expect(body).toEqual(expected);
        
        done();
      });

      response.emit('data', compressed);
      response.emit('end');      
    });    
  });  
});