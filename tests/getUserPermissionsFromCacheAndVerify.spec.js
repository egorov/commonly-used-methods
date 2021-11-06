describe('getUserPermissionsFromCacheAndVerify', () => {

  const execute = require('../src/getUserPermissionsFromCacheAndVerify');

  it('should pass', async () => {

    const state = {
      cache: {
        zrange(values, cb) {
          cb(null, [ 'Загружать', '1' ]);
        }
      },
      permission: 'Загружать',
      user: {
        user_id: 1
      }
    };

    await execute(state);

    expect(state.error).toBeUndefined();
  });

  it('should set error state', async () => {

    const state = {
      cache: {
        zrange(values, cb) {
          cb(null, [ 'Загружать', '1' ]);
        }
      },
      permission: 'Выгружать',
      user: {
        user_id: 1
      }
    };

    await execute(state);

    expect(state.error).toEqual(
      new Error('У пользователя отсутствует разрешение Выгружать!')
    );
  });

  it('should set error state', async () => {

    const state = {
      cache: {
        zrange(values, cb) {
          cb(null, [ 'Загружать', '1' ]);
        }
      },
      user: {
        user_id: 1
      }
    };

    await execute(state);

    expect(state.error).toEqual(
      new Error('В контейнере состояния отсутствует строковое значение permission!')
    );
  });

  it('should set error state', async () => {

    const state = {
      cache: {
        zrange(values, cb) {
          cb(null, [ 'Загружать', '1' ]);
        }
      },
      permission: 'Загружать'
    };

    await execute(state);

    expect(state.error).toEqual(
      new Error('В контейнере состояния отсутствует информация о пользователе!')
    );
  });

  it('should set error state', async () => {

    const state = {
      cache: {
        zrange(values, cb) {
          cb(null, [ 'Загружать', '1' ]);
        }
      },
      permission: 'Загружать',
      user: {
        email: 'joe@doe.com'
      }
    };

    await execute(state);

    expect(state.error).toEqual(
      new Error('Информация о пользователе не содержит user_id!')
    );
  });

  it('should pass', async () => {

    const state = {
      cache: {
        zrange(values, cb) {
          cb(new Error('Что-то пошло не так!'));
        }
      },
      permission: 'Загружать',
      user: {
        user_id: 1
      }
    };

    await execute(state);

    expect(state.error).toEqual(new Error('Что-то пошло не так!'));
  });  

  it('should set error state', async () => {

    const state = {
      cache: {
        zrange(values, cb) {
          cb(null, [ ]);
        }
      },
      permission: 'Выгружать',
      user: {
        user_id: 1
      }
    };

    await execute(state);

    expect(state.error).toEqual(
      new Error('Разрешения пользователя не найдены!')
    );
  });
});