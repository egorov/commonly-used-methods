module.exports = async function configureFileLogger(state) {

  if(state.error) return;

  try{

    validateEnvironment(state);
    validateMethods(state);

    const filename = 
      `${state.environment.LOG_FOLDER}/${state.environment.LOG_FILE_NAME}`;
    const maxSize = state.environment.LOG_MAX_SIZE;
    const transport = new state.LogTransport({ filename, maxSize });
    const level = state.environment.LOG_LEVEL;
    
    state.logger = state.makeLogger({ level, transports: [ transport ] });
  }
  catch(error) {
    state.error = error;
  }
}

function validateEnvironment(state) {

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

function validateMethods(state) {

  const keys = [
    'makeLogger',
    'LogTransport'
  ];

  for(const key of keys) {

    if(typeof state[key] !== 'function')
      throw new Error(`В контейнере состояния отсутствует функция ${key}!`);
  }  
}