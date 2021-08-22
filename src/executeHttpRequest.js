module.exports = async function executeHttpRequest(state) {

  if(state.error) return;

  try{
    state.httpResponseBody = void 0;

    const request = 
      state.httpTransport.request(state.httpRequestUrl, state.httpRequestOptions);

    await new Promise((resolve, reject) => {

      request.on('response', response => {

        state.httpResponse = response;

        if(typeof state.httpRequestEncoding === 'string')
          response.setEncoding(state.httpRequestEncoding);

        const chunks = [];

        response.on('data', chunk => {
          chunks.push(chunk);
        });
    
        response.on('end', () => {

          state.httpResponseBody = chunks.join('');
          
          return resolve(state);
        });

        response.on('error', error => reject(error));
      });      

      request.on('error', error => reject(error));

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