'use strict';

module.exports = function make_sample_valid_state() {
  return {
    configure_pg_client(configuration) { return { ...fake_pg_client_prototype, configuration }; },
    environment: {
      OPERATION_ID_LENGTH: '6',
      PG_CONNECTIONS: 'reports',
      REPORTS_PGHOST: 'remote.database',
      REPORTS_PGDATABASE: 'reports',
      REPORTS_PGUSER: 'joe',
      REPORTS_PGPASSWORD: 'P@ssw0rd',
      REPORTS_PGPORT: '3988'
    },
    logger: { log() {} },
    make_random_bytes
  };
}

const fake_pg_client_prototype = { 
  connect() { 
    return new Promise(resolve => resolve(0));
  }
};

function make_random_bytes(length) {
  
  const numbers = [];

  for(let i = 0; i < length; i++) {
    numbers.push(i);
  }
  return Buffer.from(numbers);
}