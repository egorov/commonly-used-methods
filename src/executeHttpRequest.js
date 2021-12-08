'use strict';

module.exports = async function executeHttpRequest(state) {

  if(state.error) return;

  try{
    state.httpResponseBody = void 0;

    const request = 
      state.httpTransport.request(state.httpRequestUrl, state.httpRequestOptions);

    await new Promise((resolve, reject) => {

      state.resolve = resolve;
      state.reject = reject;

      request.on('response', response => {

        state.httpResponse = response;

        if(typeof state.httpRequestEncoding === 'string')
          state.httpResponse.setEncoding(state.httpRequestEncoding);

        state.chunks = [];

        implementResponseDataHandling(state);
      });      

      request.on('error', error => reject(error));
      request.on('timeout', () => reject(new Error('Request timed out!')));

      if(typeof state.httpRequestBody === 'object')
        request.write(JSON.stringify(state.httpRequestBody));
      
      if(typeof state.httpRequestBody === 'string')
        request.write(state.httpRequestBody);

      request.end();  
    });
  }
  catch(error) {
    state.error = error;
  }
};

function implementResponseDataHandling(state) {
  
  let convertor = getConvertor(state);

  if(convertor === null)
    convertor = state.httpResponse;
  else
    state.httpResponse.pipe(convertor);

  convertor.on('data', chunk => {
    state.chunks.push(chunk);
  });

  convertor.on('end', () => {

    state.httpResponseBody = state.chunks.join('');
    
    state.resolve(state);
  });

  convertor.on('error', error => state.reject(error));
}

function getConvertor(state) {
  
  if(!state.httpResponse.headers) 
    return null;
  
  const encoding = state.httpResponse.headers['content-encoding'];

  if(typeof encoding !== 'string')
    return null;

  const makeConvertor = factories[encoding];

  if(typeof makeConvertor !== 'function')
    return null;

  return makeConvertor();
}

const zlib = require('zlib');
const factories = {
  br: zlib.createBrotliDecompress,
  deflate: zlib.createInflate,
  gzip: zlib.createGunzip
};