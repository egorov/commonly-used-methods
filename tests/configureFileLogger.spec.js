describe('configureFileLogger', () => {

  const configure = require('../src/configureFileLogger');

  it('should attach logger instance to state', async () => {

    const state = {
      environment: {
        LOG_FILE_NAME: '%DATE%-current.log',
        LOG_FOLDER: '/var/log/fcm-gate',
        LOG_LEVEL: 'debug',
        LOG_MAX_SIZE: '20m'
      },
      makeLogger(options) {
        return { 
          level: options.level,
          transports: options.transports
        };
      },
      LogTransport: function LogTransport(options) {
        this.filename = options.filename;
        this.maxSize = options.maxSize;
      }
    };

    await configure(state);

    expect(state.error).toBeUndefined();
    expect(state.logger).toEqual({
      level: state.environment.LOG_LEVEL,
      transports: [
        new state.LogTransport({
          filename: `${state.environment.LOG_FOLDER}/${state.environment.LOG_FILE_NAME}`,
          maxSize: state.environment.LOG_MAX_SIZE
        })
      ]
    });
  });

  describe('should validate environment variable', () => {

    let state = null;

    beforeEach(() => {
      state = {
        environment: {
          LOG_FILE_NAME: 'current.log',
          LOG_FOLDER: '/var/log/fcm-gate',
          LOG_LEVEL: 'debug',
          LOG_MAX_SIZE: '20m'
        },
        makeLogger() {},
        LogTransport: function LogTransport() {}
      };
    });

    it('LOG_FILE_NAME', async () => {

      state.environment.LOG_FILE_NAME = void 0;
 
      await configure(state);
  
      expect(state.error).toEqual(
        new Error('Не установлена переменная среды LOG_FILE_NAME!')
      );
    });
    
    it('LOG_FOLDER', async () => {

      state.environment.LOG_FOLDER = void 0;
 
      await configure(state);
  
      expect(state.error).toEqual(
        new Error('Не установлена переменная среды LOG_FOLDER!')
      );
    });
    
    it('LOG_LEVEL', async () => {

      state.environment.LOG_LEVEL = void 0;
 
      await configure(state);
  
      expect(state.error).toEqual(
        new Error('Не установлена переменная среды LOG_LEVEL!')
      );
    });

    it('LOG_MAX_SIZE', async () => {

      state.environment.LOG_MAX_SIZE = void 0;
 
      await configure(state);
  
      expect(state.error).toEqual(
        new Error('Не установлена переменная среды LOG_MAX_SIZE!')
      );
    });
  });

  describe('should validate method', () => {

    let state = null;

    beforeEach(() => {
      state = {
        environment: {
          LOG_FILE_NAME: '%DATE%-current.log',
          LOG_FOLDER: '/var/log/fcm-gate',
          LOG_LEVEL: 'debug',
          LOG_MAX_SIZE: '20m'
        },
        makeLogger(options) {
          return { 
            level: options.level,
            transports: options.transports
          };
        },
        LogTransport: function LogTransport(options) {
          this.filename = options.filename;
          this.maxSize = options.maxSize;
        }
      };
    });

    it('makeLogger', async () => {

      state.makeLogger = void 0;

      await configure(state);
  
      expect(state.error).toEqual(
        new Error('В контейнере состояния отсутствует функция makeLogger!')
      );
    });

    it('LogTransport', async () => {

      state.LogTransport = void 0;
      
      await configure(state);
  
      expect(state.error).toEqual(
        new Error('В контейнере состояния отсутствует функция LogTransport!')
      );
    });    
  });
});