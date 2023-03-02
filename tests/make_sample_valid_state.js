'use strict';

module.exports = function make_sample_valid_state() {
  return {
    configure_pg_client(configuration) { return { ...fake_pg_client_prototype, configuration }; },
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
}

const fake_pg_client_prototype = { 
  connect() { 
    return new Promise(resolve => resolve(0));
  }
};