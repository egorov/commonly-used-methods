'use strict';

module.exports = function make_pg_connections_configurations(state) {

  if(state.error) return;

  if(typeof state.environment.PG_CONNECTIONS !== 'string') return;

  if(state.environment.PG_CONNECTIONS.length === 0) return;

  try {
    const prefixes = state.environment.PG_CONNECTIONS.trim().split(',');
    const result = {};

    for(const prefix of prefixes) {

      const name = prefix.replace(/\s/g, '_');
      const NAME = name.toUpperCase();
      const rules = make_build_rules(NAME);

      result[name] = {};

      for(const rule of rules) {

        if(typeof state.environment[rule.key] !== 'string')
          throw new Error(`Переменная среды ${rule.key} должна содержать непустую строку!`);
        
        if(state.environment[rule.key].length === 0)
          throw new Error(`Переменная среды ${rule.key} должна содержать непустую строку!`);
            
        result[name][rule.field] = state.environment[rule.key];

        if(rule.key.indexOf('PGPORT') !== -1) {

          result[name][rule.field] = Number.parseInt(state.environment[rule.key]);

          if(Number.isNaN(result[name][rule.field]))
            throw new Error(`Переменная среды ${rule.key} должна содержать положительное целое число!`);
        }
      }
    }

    if(Object.keys(result).length > 0)
      state.pg_connections_configurations = result;

    state.logger.log({
      level: 'debug',
      operation_id: state.operation_id,
      timestamp: new Date(),
      __filename,
      message: 'Выполнено чтение настроек поключения к базам данных PostgreSQL',
      result
    });
  }
  catch(exception) {
    state.error = exception;
  }
}

function make_build_rules(name) {
  return [
    { field: 'host',     key: `${name}_PGHOST` },
    { field: 'database', key: `${name}_PGDATABASE` },
    { field: 'user',     key: `${name}_PGUSER` },
    { field: 'password', key: `${name}_PGPASSWORD` },
    { field: 'port',     key: `${name}_PGPORT` }
  ];
}