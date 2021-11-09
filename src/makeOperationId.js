'use strict';

module.exports = function makeOperationId(state) {

  if(state.error) return;

  try {

    if(typeof state.randomBytes !== 'function')
      throw new Error('В контейнере состояния отсутствует функция randomBytes!');
 
    const size = getSize(state);
    const buffer = state.randomBytes(size);

    state.operationId = buffer.toString('hex');
  }
  catch(error) {
    state.error = error;
  }
}

function getSize(state) {

  const DEFAULT_SIZE = 12;

  if(!state.environment) 
    return DEFAULT_SIZE;

  if(typeof state.environment.OPERATION_ID_SIZE !== 'string')
    return DEFAULT_SIZE;

  const value = Number.parseInt(state.environment.OPERATION_ID_SIZE);

  if(Number.isNaN(value)) 
    return DEFAULT_SIZE;

  return Math.floor(value / 2);
}