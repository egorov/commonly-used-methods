'use strict';

module.exports = async function execute_http_request(state) {

  if(state.error) return;

  try{
    state.http_response_body = void 0;

    const request = 
      state.http_transport.request(state.http_request_url, state.http_request_options);

    await new Promise((resolve, reject) => {

      state.resolve = resolve;
      state.reject = reject;

      request.on('response', response => {

        state.http_response = response;

        if(typeof state.http_request_encoding === 'string')
          state.http_response.setEncoding(state.http_request_encoding);

        state.http_response_chunks = [];

        implement_response_chunks_handling(state);
      });      

      request.on('error', error => reject(error));
      request.on('timeout', () => reject(new Error('Request timed out!')));

      if(Buffer.isBuffer(state.http_request_body))
        request.write(state.http_request_body);

      if(typeof state.http_request_body === 'object')
        request.write(JSON.stringify(state.http_request_body));
      
      if(typeof state.http_request_body === 'string')
        request.write(state.http_request_body);

      request.end();  
    });
  }
  catch(error) {
    state.error = error;
  }
};

function implement_response_chunks_handling(state) {
  
  let handler = get_handler(state);

  if(handler === null)
    handler = state.http_response;
  else
    state.http_response.pipe(handler);

  handler.on('data', chunk => {
    state.http_response_chunks.push(chunk);
  });

  handler.on('end', () => {

    if(typeof state.http_request_encoding === 'string')
      state.http_response_body = state.http_response_chunks.join('');
    else
      state.http_response_body = Buffer.concat(state.http_response_chunks);
    
    state.resolve(state);
  });

  handler.on('error', error => state.reject(error));
}

function get_handler(state) {
  
  if(!state.http_response.headers) 
    return null;
  
  const encoding = state.http_response.headers['content-encoding'];

  if(typeof encoding !== 'string')
    return null;

  const make_handler = factories[encoding];

  if(typeof make_handler !== 'function')
    return null;

  return make_handler();
}

const zlib = require('zlib');
const factories = {
  br: zlib.createBrotliDecompress,
  deflate: zlib.createInflate,
  gzip: zlib.createGunzip
};