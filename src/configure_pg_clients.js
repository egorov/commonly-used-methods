'use strict';

module.exports = async function configure_pg_clients(state) {

  if(state.error) return;

  if(!state.pg_connections_configurations) return;

  try {

    for(const key of Object.keys(state.pg_connections_configurations)) {

      const configuration = state.pg_connections_configurations[key];
      const client_name = `pg_client_${key}`;

      state[client_name] = new state.pg_client_constructor(configuration);

      await state[client_name].connect();

      state.logger.log({
        level: 'debug',
        operation_id: state.operation_id,
        timestamp: new Date(),
        __filename,
        message: 'Выполнено подключение к серверу баз данных PostgreSQL',
        client_name
      });
    }
  }
  catch(exception) {
    state.error = exception;
  }
}