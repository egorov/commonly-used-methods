describe('rollbackTransaction', () => {

  const rollbackTransaction = require('../src/rollbackTransaction');

  it('should pass', async () => {

    const error = new Error('Что-то пошло не так!');
    const state = {
      error,
      transaction() {
        return {
          isCompleted: () => false,
          rollback: () => { 
            return { operation: 'rollback' };
          }
        }
      }
    };

    await rollbackTransaction(state);

    expect(state.error).toEqual(error);
    expect(state.transactionResult).toEqual({ operation: 'rollback' });
  });

  it('should do nothing if no error', async () => {

    const state = {
      transaction() {
        return {
          isCompleted: () => false,
          rollback: () => { 
            return { operation: 'rollback' };
          }
        }
      }
    };

    await rollbackTransaction(state);

    expect(state.error).toBeUndefined();
    expect(state.transactionResult).toBeUndefined();
  });

  it('should do nothing if already completed', async () => {

    const error = new Error('Что-то пошло не так!');
    const state = {
      error,
      transaction() {
        return {
          isCompleted: () => true,
          rollback: () => { 
            return { operation: 'rollback' };
          }
        }
      }
    };

    await rollbackTransaction(state);

    expect(state.error).toEqual(error);
    expect(state.transactionResult).toBeUndefined();
  });

  it('should do nothing if no transaction', async () => {

    const error = new Error('Что-то пошло не так!');
    const state = {
      error
    };

    await rollbackTransaction(state);

    expect(state.error).toEqual(error);
    expect(state.transactionResult).toBeUndefined();
  });  
});