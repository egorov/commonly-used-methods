describe('make_sample_valid_state', () => {
  
  const make = require('./make_sample_valid_state');

  it('should retusn valid state object', () => {

    const state = make();

    expect(state.environment).toEqual({
      LOG_FILE_NAME: '%DATE%-current.log',
      LOG_FOLDER: '/var/log/folder',
      LOG_LEVEL: 'debug',
      LOG_MAX_SIZE: '2m',
      OPERATION_ID_LENGTH: '6',
      PG_CONNECTIONS: 'reports',
      REPORTS_PGHOST: 'remote.database',
      REPORTS_PGDATABASE: 'reports',
      REPORTS_PGUSER: 'joe',
      REPORTS_PGPASSWORD: 'P@ssw0rd',
      REPORTS_PGPORT: '3988'
    });
    
    expect(state.logger).toBeInstanceOf(Object);
    expect(state.logger.log).toBeInstanceOf(Function);
    expect(Object.keys(state.logger)).toEqual(['log']);

    expect(state.configure_pg_client).toBeInstanceOf(Function);
    expect(state.configure_pg_client({}).connect).toBeInstanceOf(Function);

    expect(state.make_random_bytes).toBeInstanceOf(Function);
    expect(state.make_winston_logger).toBeInstanceOf(Function);
  });

  describe('make_random_bytes', () => {

    it('should always return same array', () => {

      const state = make();
      const gauge = Buffer.from([ 0, 1, 2, 3, 4, 5 ]);

      expect(state.make_random_bytes(6)).toEqual(gauge);
    });
  });
});