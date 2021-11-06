describe('makeOperationId', () => {

  const makeOperationId = require('../src/makeOperationId');

  it('should set state operation of declared size', async () => {

    const state = {
      environment: {
        OPERATION_ID_SIZE: '6'
      },
      randomBytes(size) {
        const numbers = [];
        for(let i = 0; i < size; i++) {
          numbers.push(i);
        }
        return Buffer.from(numbers);
      }
    };

    await makeOperationId(state);

    expect(state.operationId.length).toEqual(6);
    expect(state.operationId).toEqual('000102');
  });

  it('should set state operation of default size', async () => {

    const state = {
      randomBytes(size) {
        const numbers = [];
        for(let i = 0; i < size; i++) {
          numbers.push(i);
        }
        return Buffer.from(numbers);
      }
    };

    await makeOperationId(state);

    expect(state.operationId.length).toEqual(24);
    expect(state.operationId).toEqual('000102030405060708090a0b');
  });

  it('should throw when randomBytes undefined', async () => {

    const state = { };

    await makeOperationId(state);

    expect(state.error).toEqual(
      new Error('В контейнере состояния отсутствует функция randomBytes!')
    );
    expect(state.operationId).toBeUndefined();
  });  
});