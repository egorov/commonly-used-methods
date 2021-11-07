describe('createTransaction', () => {

  const createTransaction = require('../src/createTransaction');
  let database = null;

  beforeEach(() => {
    database = () => {};
  });

  it('should pass', () => {

    database.transactionProvider = function transactionProvider() {
      return { _id: '28a093a3819cc56ff' };
    };
  
    const state = { database };

    createTransaction(state);

    expect(state.error).toBeUndefined();
    expect(state.transaction).toEqual({ _id: '28a093a3819cc56ff' });
  });

  it('should fall when no database', () => {

    const state = { };

    createTransaction(state);

    expect(state.error).toEqual(
      new Error('В контейнере состояния отсутствует database!')
    );
    expect(state.transaction).toBeUndefined();
  });

  it('should fall when no transactionProvider', () => {

    const state = { database };

    createTransaction(state);

    expect(state.error).toEqual(
      new Error('В контейнере состояния отсутствует функция transactionProvider!')
    );
    expect(state.transaction).toBeUndefined();
  });

  it('should do nothing if error state', () => {

    const error = new Error('Что-то не так!');
    const state = {
      database,
      error
    };

    createTransaction(state);

    expect(state.error).toEqual(error);
    expect(state.transaction).toBeUndefined();
  });
});