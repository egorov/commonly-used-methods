describe('configure_pg_clients', () => {

  const make_valid_state = require('./make_sample_valid_state');
  const make_pg_connections_configurations = require('../src/make_pg_connections_configurations');
  const configure_pg_clients = require('../src/configure_pg_clients');
  
  it('should attach single client to state', async () => {

    const state = make_valid_state();

    make_pg_connections_configurations(state);
    await configure_pg_clients(state);

    expect(state.error).toBeUndefined();
    
    expect(state.pg_client_reports.configuration).toEqual({
      user: 'joe',
      password: 'P@ssw0rd',
      host: 'remote.database',
      database: 'reports',
      port: 3988
    });
  });

  it('should attach multiple client to state', async () => {

    const state = make_valid_state();

    state.environment.PG_CONNECTIONS = 'reports,sales';
    state.environment.SALES_PGHOST = 'another_host';
    state.environment.SALES_PGDATABASE = 'sales';
    state.environment.SALES_PGUSER = 'jane';
    state.environment.SALES_PGPASSWORD = 'Dr0wss@p';
    state.environment.SALES_PGPORT = '5462';  

    make_pg_connections_configurations(state);
    await configure_pg_clients(state);

    expect(state.error).toBeUndefined();

    expect(state.pg_client_reports.configuration).toEqual({
      user: 'joe',
      password: 'P@ssw0rd',
      host: 'remote.database',
      database: 'reports',
      port: 3988
    });

    expect(state.pg_client_sales.configuration).toEqual({
      user: 'jane',
      password: 'Dr0wss@p',
      host: 'another_host',
      database: 'sales',
      port: 5462
    });
  });

  it('should do nothing if state error', async () => {

    const state = make_valid_state();

    state.error = new Error('Bang!');

    make_pg_connections_configurations(state);
    await configure_pg_clients(state);

    expect(state.error).toEqual(new Error('Bang!'));

    expect(state.pg_client_reports).toBeUndefined();
  });

  it('should do nothing no any configurations', async () => {

    const state = make_valid_state();

    await configure_pg_clients(state);

    expect(state.error).toBeUndefined();

    expect(state.pg_client_reports).toBeUndefined();
  });
});