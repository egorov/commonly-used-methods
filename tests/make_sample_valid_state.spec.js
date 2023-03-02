describe('make_sample_valid_state', () => {
  
  const make = require('./make_sample_valid_state');

  it('should retusn valid state object', () => {

    const state = make();

    expect(state.environment).toEqual({
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
  });
});