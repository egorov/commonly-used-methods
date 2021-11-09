'use strict';

module.exports = function validateRequestBody(state) {

  if(state.error) return;

  try{

    if(!state.requestBodyValidationRules)
      throw new Error('В контейнере состояния отсутствуют правила валидации тела запроса!');

    if(!state.request)
      throw new Error('В контейнере состояния отсутствует содержимое запроса!');

    if(!state.request.body)
      throw new Error('Запрос не содержит данных!');

    state.requestBodyValidationResult = 
      state.validate(state.request.body, state.requestBodyValidationRules);

    if(state.requestBodyValidationResult !== null) 
      throw new Error('Ошибка валидации содержимого запроса!');
  }
  catch(error) {
    state.error = error;
  }
};