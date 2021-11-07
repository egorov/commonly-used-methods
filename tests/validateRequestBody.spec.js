describe('validateRequestBody', () => {

  const validateRequestBody = require('../src/validateRequestBody');

  it('should pass', () => {

    const state = {
      requestBodyValidationRules: {},
      request: {
        body: {
          message: 'ok'
        }
      },
      validate() {
        return null;
      }
    };

    validateRequestBody(state);

    expect(state.error).toBeUndefined();
    expect(state.requestBodyValidationResult).toBeNull();
  });

  it('should set error state', () => {

    const state = {
      requestBodyValidationRules: {},
      request: {
        body: {
          message: 'ok'
        }
      },
      validate() {
        return {
          errors: [ 1, 2, 3 ]
        };
      }
    };

    validateRequestBody(state);

    expect(state.error).toEqual(
      new Error('Ошибка валидации содержимого запроса!')
    );
    expect(state.requestBodyValidationResult).toEqual({
      errors: [ 1, 2, 3 ]
    });
  });

  it('should set error state', () => {

    const state = {
      requestBodyValidationRules: {},
      validate() {
        return {
          errors: [ 1, 2, 3 ]
        };
      }
    };

    validateRequestBody(state);

    expect(state.error).toEqual(
      new Error('В контейнере состояния отсутствует содержимое запроса!')
    );
    expect(state.requestBodyValidationResult).toBeUndefined();
  });

  it('should set error state', () => {

    const state = {
      requestBodyValidationRules: {},
      request: {},
      validate() {
        return {
          errors: [ 1, 2, 3 ]
        };
      }
    };

    validateRequestBody(state);

    expect(state.error).toEqual(new Error('Запрос не содержит данных!'));
    expect(state.requestBodyValidationResult).toBeUndefined();
  });

  it('should set error state', () => {

    const state = {
      request: {
        body: {
          message: 'ok'
        }
      },
      validate() {
        return {
          errors: [ 1, 2, 3 ]
        };
      }
    };

    validateRequestBody(state);

    expect(state.error).toEqual(
      new Error('В контейнере состояния отсутствуют правила валидации тела запроса!')
    );
    expect(state.requestBodyValidationResult).toBeUndefined();
  });  
});