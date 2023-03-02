'use strict';

module.exports = function configure_winston_file_Logger(state) {

  if(state.error) return;

  try {

    validate_environment_variables(state);
    is_required_methods_in(state);

    const filename = 
      `${state.environment.LOG_FOLDER}/${state.environment.LOG_FILE_NAME}`;
    const maxSize = state.environment.LOG_MAX_SIZE;
    const transport = new state.winston_logger_transport_constructor({ filename, maxSize });
    const level = state.environment.LOG_LEVEL;
    
    state.logger = state.make_winston_logger({ level, transports: [ transport ] });

    state.logger.log({
      level: 'debug',
      operation_id: state.operation_id,
      timestamp: new Date(),
      __filename,
      message: 'Выполнена настройка файлового журнализатора winston',
      filename,
      maxSize,
      level
    });
  }
  catch(exception) {
    state.error = exception;
  }
}

function validate_environment_variables(state) {

  if(!state.environment)
    throw new Error('Отсутствует контейнер переменных среды выполнения!');

  const keys = [
    'LOG_FILE_NAME',
    'LOG_FOLDER',
    'LOG_LEVEL',
    'LOG_MAX_SIZE'
  ];

  for(const key of keys) {

    if(typeof state.environment[key] !== 'string')
      throw new Error(`Не установлена переменная среды ${key}!`);          
  }
}

function is_required_methods_in(state) {

  const keys = [
    'make_winston_logger',
    'winston_logger_transport_constructor'
  ];

  for(const key of keys) {

    if(typeof state[key] !== 'function')
      throw new Error(`В контейнере состояния отсутствует функция ${key}!`);
  }  
}