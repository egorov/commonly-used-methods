describe('make_operation_id', () => {

  const make_sample_valid_state = require('./make_sample_valid_state');
  const make_operation_id = require('../src/make_operation_id');

  it('should set operation_id length of six', () => {

    const state = make_sample_valid_state();

    make_operation_id(state);

    expect(state.error).toBeUndefined();
    expect(state.operation_id.length).toEqual(6);
    expect(state.operation_id).toEqual('000102');
  });

  it('should set operation_id of default length twenty four', () => {

    const state = make_sample_valid_state();

    delete state.environment.OPERATION_ID_LENGTH;

    make_operation_id(state);

    expect(state.error).toBeUndefined();

    expect(state.operation_id.length).toEqual(24);
    expect(state.operation_id).toEqual('000102030405060708090a0b');
  });

  it('should set error if make_random_bytes function undefined', () => {

    const state = { };

    make_operation_id(state);

    expect(state.error).toEqual(
      new Error('В контейнере состояния отсутствует функция make_random_bytes!')
    );
    expect(state.operation_id).toBeUndefined();
  });

  if('should do nothing if state error', () => {

    const error = new Error('Bang!');
    const state = { error };

    configure(state);

    expect(state.error).toEqual(error);
    expect(state.operation_id).toBeUndefined();
  });  
});