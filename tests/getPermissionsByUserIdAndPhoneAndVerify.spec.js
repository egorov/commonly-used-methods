describe('getPermissionsByUserIdAndPhoneAndVerify', () => {

  const execute = require('../src/getPermissionsByUserIdAndPhoneAndVerify');

  it('should pass', async () => {

    const state = {
      cache: {
        zrange(values, cb) {
          cb(null, [ 'Загружать', '1' ]);
        }
      },
      permission: 'Загружать',
      user: {
        normal_phone: '7 9129998811',
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
        normal_phone: '7 9129998811',
        user_id: 1
      }
    };

    await execute(state);

    expect(state.error).toEqual(
      new Error('Пользователь не имеет разрешения на выполнение операции!')
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
        normal_phone: '7 9129998811',
        user_id: 1
      }
    };

    await execute(state);

    expect(state.error).toEqual(
      new Error('В контейнере состояния отсутствует строковое значение permission!')
    );
  });

  it('should do nothing if no user', async () => {

    const state = {
      cache: {
        zrange(values, cb) {
          cb(null, [ 'Загружать', '1' ]);
        }
      },
      permission: 'Загружать'
    };

    await execute(state);

    expect(state.error).toBeUndefined();
  });

  it('should do nothing if user is null', async () => {

    const state = {
      cache: {
        zrange(values, cb) {
          cb(null, [ 'Загружать', '1' ]);
        }
      },
      permission: 'Загружать',
      user: null
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

  it('should set error state', async () => {

    const state = {
      cache: {
        zrange(values, cb) {
          cb(null, [ 'Загружать', '1' ]);
        }
      },
      permission: 'Загружать',
      user: {
        email: 'joe@doe.com',
        user_id: 1
      }
    };

    await execute(state);

    expect(state.error).toEqual(
      new Error('Информация о пользователе не содержит строки normal_phone!')
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
        normal_phone: '7 9129998833',
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
        normal_phone: '7 9129998833',
        user_id: 1
      }
    };

    await execute(state);

    expect(state.error).toEqual(
      new Error('Разрешения пользователя не найдены!')
    );
  });

  it('should pass', async () => {

    const state = {
      cache: {
        zRange() {
          return new Promise(resolve => resolve([ 'Загружать', '1' ]));
        }
      },
      permission: 'Загружать',
      user: {
        normal_phone: '7 9129998811',
        user_id: 1        
      }
    };

    await execute(state);

    expect(state.error).toBeUndefined();
  });

  it('should set error state', async () => {

    const state = {
      cache: {
        zRange() {
          return new Promise(resolve => resolve([ 'Загружать', '1' ]));
        }
      },
      permission: 'Выгружать',
      user: {
        normal_phone: '7 9129998811',
        user_id: 1
      }
    };

    await execute(state);

    expect(state.error).toEqual(
      new Error('Пользователь не имеет разрешения на выполнение операции!')
    );
  });
});