module.exports = function createTransaction(state) {

  if(state.error) return;

  try {

    if(!state.database)
      throw new Error('В контейнере состояния отсутствует database!');

    if(typeof state.database.transactionProvider !== 'function')
      throw new Error('В контейнере состояния отсутствует функция transactionProvider!');

    state.transaction = state.database.transactionProvider();
  }
  catch(error) {
    state.error = error;
  }
}