const compression = process.argv[2];
const known = [ 'br', 'gzip', 'deflate' ];
const usageErrorMessage =     
  "\t\n" +
  "\tusage: node download.js {compression}" +
  "\n\twhere {compression} must be one of 'br', 'gzip' or 'deflate'" +
  "\t\n";

if(typeof compression !== 'string') {
  
  console.log(usageErrorMessage);
  
  return;
}

if(known.indexOf(compression) === -1) {

  console.log(usageErrorMessage);

  return;
}
  
const executeHttpRequest = require('../src/executeHttpRequest');
const state = {
  httpTransport: require('https'),
  httpRequestUrl: 'https://egorov.space',
  httpRequestOptions: {
    method: 'GET',
    headers: {
      'accept-encoding': compression
    }
  },
  httpRequestEncoding: 'utf-8'
};
const assert = require('assert');

(async () => {

  await executeHttpRequest(state);

  assert(state.httpResponseBody.includes('My Own Space'));

  console.log('Success!');
})();