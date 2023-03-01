describe('make_pg_connection_configuration', () => {

  const execute = require('../src/make_pg_connection_configuration');
  const valid_state = {
    environment: {
      PG_CONNECTIONS: 'reports',
      REPORTS_PGHOST: 'remote.database',
      REPORTS_PGDATABASE: 'reports',
      REPORTS_PGUSER: 'joe',
      REPORTS_PGPASSWORD: 'P@ssw0rd',
      REPORTS_PGPORT: '3988'
    },
    logger: { log() {} }
  };

  it('should attach configuration', () => {

    const state = Object.assign({}, valid_state);

    execute(state);

    expect(state.error).toBeUndefined();
    expect(state.pg_connections_configurations).toEqual({
      reports: {
        user: 'joe',
        password: 'P@ssw0rd',
        host: 'remote.database',
        database: 'reports',
        port: 3988
      }
    });
  });
});