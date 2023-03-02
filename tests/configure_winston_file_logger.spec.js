describe('configure_winston_file_logger', () => {

  const make_sample_valid_state = require('./make_sample_valid_state');
  const configure_winston_file_logger = require('../src/configure_winston_file_logger');

  it('should attach logger to state', () => {

    const state = make_sample_valid_state();

    delete state.logger;

    configure_winston_file_logger(state);

    expect(state.error).toBeUndefined();

    expect(state.logger.log).toBeInstanceOf(Function);
  });

  it('should do nothing if state error', () => {

    const state = make_sample_valid_state();

    delete state.logger;
    state.error = new Error('Bang!');

    configure_winston_file_logger(state);

    expect(state.error).toEqual(new Error('Bang!'));

    expect(state.logger).toBeUndefined();
  });

  it('should set error state of environment', () => {

    const state = make_sample_valid_state();

    delete state.environment.LOG_FILE_NAME;
    delete state.logger;

    configure_winston_file_logger(state);

    expect(state.error).toEqual(new Error('Не установлена переменная среды LOG_FILE_NAME!'));

    expect(state.logger).toBeUndefined();
  });

  it('should set error state of logger factory', () => {

    const state = make_sample_valid_state();

    delete state.make_winston_logger;
    delete state.logger;

    configure_winston_file_logger(state);

    expect(state.error).toEqual(new Error('В контейнере состояния отсутствует функция make_winston_logger!'));

    expect(state.logger).toBeUndefined();
  });

  it('should set error state of winston transport constructor', () => {

    const state = make_sample_valid_state();

    delete state.winston_logger_transport_constructor;
    delete state.logger;

    configure_winston_file_logger(state);

    expect(state.error).toEqual(new Error('В контейнере состояния отсутствует функция winston_logger_transport_constructor!'));

    expect(state.logger).toBeUndefined();
  });
});