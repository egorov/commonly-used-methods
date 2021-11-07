module.exports = function createTransaction(state) {

  if(state.error) return;

  try {

    if(typeof state.makeTransaction !== 'function')
      throw new Error('В контейнере состояния отсутствует функция makeTransaction!');

    state.transaction = state.makeTransaction();
  }
  catch(error) {
    state.error = error;
  }
}