describe('makeErrorResponseContent', () => {

  const makeErrorResponseContent = require('../src/makeErrorResponseContent');
  const knownErrors = [
    {
      message: 'В запросе отсутствует заголовок Authorization!',
      statusCode: 401
    },
    {
      message: 'Отсутствует токен авторизации!',
      statusCode: 401
    },
    {
      message: 'Неверный токен авторизации!',
      statusCode: 401
    },
    {
      message: 'Разрешения пользователя не найдены!',
      statusCode: 401
    },
    {
      message: 'Пользователь не имеет разрешения на выполнение операции!',
      statusCode: 401
    }
  ];

  it('should make 401 not authorized content', () => {

    for(const item of knownErrors) {

      const error = new Error(item.message);
      const state = { error };
  
      makeErrorResponseContent(state);
  
      expect(state.responseContent).toEqual({
        statusCode: 401,
        body: {
          danger: error.message
        }
      });
      expect(state.error).toEqual(error);
    }
  });

  it('should make 400 bad request content', () => {

    const error = new Error('Ошибка валидации содержимого запроса!');
    const state = {
      error,
      requestBodyValidationResult: [ 1, 2, 3 ]
    };

    makeErrorResponseContent(state);

    expect(state.responseContent).toEqual({
      statusCode: 400,
      body: {
        danger: error.message,
        details: [ 1, 2, 3 ]
      }
    });
    expect(state.error).toEqual(error);
  });

  it('should make 500 internal server error content', () => {

    const error = new Error('Неизвестная ошибка');
    const state = { error };

    makeErrorResponseContent(state);

    expect(state.responseContent).toEqual({
      statusCode: 500,
      body: {
        danger: error.message
      }
    });
    expect(state.error).toEqual(error);
  });

  it('should do nothing', () => {

    const state = {};

    makeErrorResponseContent(state);

    expect(state.error).toBeUndefined();
    expect(state.responseContent).toBeUndefined();
  });

  it('should do nothing if error is not instance of Error', () => {

    const state = { error: 'Что-то пошло не так!' };

    makeErrorResponseContent(state);

    expect(state.responseContent).toBeUndefined();
  });
});