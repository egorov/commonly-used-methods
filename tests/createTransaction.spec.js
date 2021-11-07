describe('createTransaction', () => {

  const createTransaction = require('../src/createTransaction');

  it('should pass', () => {

    const state = {
      makeTransaction() {
        return { _id: '28a093a3819cc56ff' };
      }
    };

    createTransaction(state);

    expect(state.error).toBeUndefined();
    expect(state.transaction).toEqual({ _id: '28a093a3819cc56ff' });
  });

  it('should fall when no makeTransaction', () => {

    const state = {};

    createTransaction(state);

    expect(state.error).toEqual(
      new Error('В контейнере состояния отсутствует функция makeTransaction!')
    );
    expect(state.transaction).toBeUndefined();
  });

  it('should do nothing if error state', () => {

    const error = new Error('Что-то не так!');
    const state = {
      error,
      makeTransaction() {
        return { _id: '28a093a3819cc56ff' };
      }
    };

    createTransaction(state);

    expect(state.error).toEqual(error);
    expect(state.transaction).toBeUndefined();
  });
});