# My commonly used methods  

Detailed usage instructions are in project's `tests` folder.

### executeHttpRequest  

```javascript

const execute = require('commonly-used-methods').executeHttpRequest;
const state = {
  httpTransport: require('https'),
  httpRequestUrl: 'https://egorov.space/api/user/login',
  httpRequestOptions: {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    }
  },
  httpRequestEncoding: 'utf-8',
  httpRequestBody: {
    login: 'jack',
    password: 'P@ssw0rd'
  }
};

await execute(state);

const value = JSON.parse(state.httpResponseBody);

expect(typeof value.access_token).toEqual('string');
expect(value.userName).toEqual('jack');

```