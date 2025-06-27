'use strict';

module.exports = async function getUserFromCache(state) {

  if(state.error) return;

  try {
    const authorization = state.request.get('authorization');

    if(typeof authorization !== 'string') 
      throw new Error('В запросе отсутствует заголовок Authorization!');
  
    const accessToken = authorization.replace(/Bearer\s*/, '');
  
    if(accessToken.length === 0) 
      throw new Error('Отсутствует токен авторизации!');

    if(typeof state.cache.hGetAll === 'function') {
      state.user = await state.cache.hGetAll(accessToken);
    }
    else {
      state.user = await new Promise((resolve, reject) => {

        state.cache.hgetall(accessToken, (error, value) => {
      
          if(error) reject(error);
             
          resolve(value);
        });   
      });  
    }

    if(is_empty(state.user))
      throw new Error('Неверный токен авторизации!');
  }
  catch(error) {
    state.error = error;
  }
}

function is_empty(value) {

  if(value === null) return true;

  if(value === undefined) return true;

  if(typeof value === 'undefined') return true;

  if(typeof value !== 'object') return true;

  if(typeof value === 'object')
    if(Object.keys(value).length === 0) return true;

  return false;
}