'use strict';

module.exports = function make_operation_id(state) {

  if(state.error) return;

  try {

    if(typeof state.make_random_bytes !== 'function')
      throw new Error('В контейнере состояния отсутствует функция make_random_bytes!');
 
    const size = getSize(state);
    const buffer = state.make_random_bytes(size);

    state.operation_id = buffer.toString('hex');

    state.logger.log({
      level: 'debug',
      operation_id: state.operation_id,
      timestamp: new Date(),
      __filename,
      message: 'Выполнена генерация идентификатора операции',
      operation_id: state.operation_id
    });    
  }
  catch(error) {
    state.error = error;
  }
}

function getSize(state) {

  const DEFAULT_SIZE = 12;

  if(!state.environment) 
    return DEFAULT_SIZE;

  if(typeof state.environment.OPERATION_ID_LENGTH !== 'string')
    return DEFAULT_SIZE;

  const value = Number.parseInt(state.environment.OPERATION_ID_LENGTH);

  if(Number.isNaN(value)) 
    return DEFAULT_SIZE;

  return Math.floor(value / 2);
}