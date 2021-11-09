'use strict';

module.exports = function makeErrorHttpResponse(state) {

  if(!(state.error instanceof Error)) return;

  try {

    if(state.error.message.indexOf('Ошибка валидации содержимого запроса!') > -1) {

      state.responseContent = {
        statusCode: 400,
        body: {
          danger: state.error.message,
          details: state.requestBodyValidationResult
        }
      };

      return;
    }

    for(const error of knownErrors) {
      
      if(state.error.message.indexOf(error.message) === -1 ) continue;

      state.responseContent = {
        statusCode: error.statusCode,
        body: {
          danger: error.message
        }
      };

      break;
    }

    if(!state.responseContent)
      state.responseContent = {
        statusCode: 500,
        body: {
          danger: state.error.message
        }
      };
  }
  catch(error) {
    state.error = error;
  }
}

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
