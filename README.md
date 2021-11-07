# My commonly used methods  

Detailed usage instructions are in project's `tests` folder.

### configureFileLogger  

Do not forget to set environment variables:  
 - LOG_FILE_NAME="%DATE%-current.log"  
 - LOG_FOLDER="/var/log/service"  
 - LOG_LEVEL="debug"  
 - LOG_MAX_SIZE="20m"  

```javascript  
const winston = require('winston');
const configureFileLogger = require('commonly-used-methods').configureFileLogger;
const state = {
  environment: process.env,
  makeLogger: winston.createLogger,
  LogTransport: require('winston-daily-rotate-file')
};

await configureFileLogger(state);

state.logger.log('info', 'It works fine!');
```  

### commitTransaction  

Fires if there are non completed transaction and no error in state container.

```javascript  
const createTransaction = require('commonly-used-methods').createTransaction;
const commitTransaction = require('commonly-used-methods').commitTransaction;
const state = {
  makeTransaction: knex.transactionProvider()
};

createTransaction(state);

// Here use transaction to operate with database

await commitTransaction(state);

expect(state.transactionResult).not.toBeUndefined();
```  

### createTransaction  

```javascript  
const createTransaction = require('commonly-used-methods').createTransaction;
const state = {
  makeTransaction: knex.transactionProvider()
};

createTransaction(state);

expect(state.error).toBeUndefined();
expect(typeof state.transaction).toEqual('function');
```  

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

### getUserFromCache  

It expects connected `Redis` client in state.  

```javascript

const getUserFromCache = require('commonly-used-methods').getUserFromCache;
const state = {
  cache: require('redis').createClient({ host: 'x_redis' })
};

await getUserFromCache(state);

expect(state.error).toBeUndefined();
expect(state.user).toEqual({ email: 'joe@doe.com' });

```  

### getUserPermissionsFromCacheAndVerify  

It expects connected `Redis` client in state.  

```javascript

const execute = 
  require('commonly-used-methods').getUserPermissionsFromCacheAndVerify;
const state = {
  cache: require('redis').createClient({ host: 'x_redis' }),
  permission: 'Включать свет',
  user: {
    user_id: '88bc23a8af0'
  }
};

await execute(state);

expect(state.error).toBeUndefined();

```  

### makeOperationId  

Generates configurable length random string. Default string length 24 characters. Requires `randomBytes` method attached to state container.

```javascript

const makeOperationId = require('commonly-used-methods').makeOperationId;
const state = {
  environment: {
    OPERATION_ID_SIZE: '32'
  },
  randomBytes: require('crypto').randomBytes
};

makeOperationId(state);

expect(state.error).toBeUndefined();
expect(sate.operationId.length).toEqual(32);

```  

### rollbackTransaction  

Fires if there are non completed transaction and error set in state container.

```javascript  
const createTransaction = require('commonly-used-methods').createTransaction;
const rollbackTransaction = require('commonly-used-methods').rollbackTransaction;
const state = {
  makeTransaction: knex.transactionProvider()
};

createTransaction(state);

state.error = new Error('Что-то пошло не так!');

await rollbackTransaction(state);

expect(state.transactionResult).not.toBeUndefined();
```  