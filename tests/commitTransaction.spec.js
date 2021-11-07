describe('commitTransaction', () => {

  const commitTransaction = require('../src/commitTransaction');

  it('should pass', async () => {

    const state = {
      transaction() {
        return {
          isCompleted: () => false,
          commit: () => { 
            return { operation: 'commit' };
          }
        }
      }
    };

    await commitTransaction(state);

    expect(state.error).toBeUndefined();
    expect(state.transactionResult).toEqual({ operation: 'commit' });
  });

  it('should not commit if error', async () => {

    const error = new Error('Что-то пошло не так!');
    const state = {
      error,
      transaction() {
        return {
          isCompleted: () => false,
          commit: () => { 
            return { operation: 'commit' };
          }
        }
      }
    };

    await commitTransaction(state);

    expect(state.error).toEqual(error);
    expect(state.transactionResult).toBeUndefined();
  });

  it('should do nothing if already completed', async () => {

    const state = {
      transaction() {
        return {
          isCompleted: () => true,
          commit: () => { 
            return { operation: 'commit' };
          }
        }
      }
    };

    await commitTransaction(state);

    expect(state.error).toBeUndefined();
    expect(state.transactionResult).toBeUndefined();
  });

  it('should do nothing if no transaction exists', async () => {

    const state = { };

    await commitTransaction(state);

    expect(state.error).toBeUndefined();
    expect(state.transactionResult).toBeUndefined();
  });  
});