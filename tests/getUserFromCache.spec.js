describe('getUserFromCache', () => {

  const getUserFromCache = require('../src/getUserFromCache');

  it('should attach user info to state', async () => {

    const state = {
      cache: {
        hgetall(key, cb) {
          cb(null, { email: 'joe@doe.com' });
        }
      },
      request: {
        get() {
          return 'Bearer token';
        }
      }
    };

    await getUserFromCache(state);

    expect(state.error).toBeUndefined();
    expect(state.user).toEqual({
      email: 'joe@doe.com'
    });
  });

  it('should set error', async () => {

    const state = {
      cache: {
        hgetall(key, cb) {
          cb(null, { email: 'joe@doe.com' });
        }
      },
      request: {
        get() {
          return void 0;
        }
      }
    };

    await getUserFromCache(state);

    expect(state.error).toEqual(
      new Error('Request Authorization header not found!')
    );
    expect(state.user).toBeUndefined();
  });

  it('should set error', async () => {

    const state = {
      cache: {
        hgetall(key, cb) {
          cb(null, { email: 'joe@doe.com' });
        }
      },
      request: {
        get() {
          return 'Bearer';
        }
      }
    };

    await getUserFromCache(state);

    expect(state.error).toEqual(
      new Error('Wrong request Authorization header value!')
    );
    expect(state.user).toBeUndefined();
  });  

  it('should set error state', async () => {

    const state = {
      cache: {
        hgetall(key, cb) {
          cb(new Error('Something wrong!'));
        }
      },
      request: {
        get() {
          return 'Bearer token';
        }
      }
    };

    await getUserFromCache(state);

    expect(state.error).toEqual(new Error('Something wrong!'));
    expect(state.user).toBeUndefined();
  });

  it('should set error state', async () => {

    const state = {
      cache: {
        hgetall(key, cb) {
          cb(null, null);
        }
      },
      request: {
        get() {
          return 'Bearer token';
        }
      }
    };

    await getUserFromCache(state);

    expect(state.error).toEqual(new Error('Wrong Authorization token!'));
    expect(state.user).toBeNull();
  });  

  it('should do nothing if error already set', async () => {

    const error = new Error('Something wrong!');
    const state = {
      error,
      cache: {
        hgetall(key, cb) {
          cb(null, { email: 'joe@doe.com' });
        }
      },
      request: {
        get() {
          return 'Bearer token';
        }
      }
    };

    await getUserFromCache(state);

    expect(state.error).toEqual(error);
    expect(state.user).toBeUndefined();
  });
});