module.exports = async function getUserFromCache(state) {

  if(state.error) return;

  try {
    const authorization = state.request.get('authorization');

    if(typeof authorization !== 'string') 
      throw new Error('В запросе отсутствует заголовок Authorization!');
  
    const accessToken = authorization.replace(/Bearer\s*/, '');
  
    if(accessToken.length === 0) 
      throw new Error('Отсутствует токен авторизации!');
    
    state.user = await new Promise((resolve, reject) => {

      state.cache.hgetall(accessToken, (error, value) => {
    
        if(error) reject(error);
           
        resolve(value);
      });   
    });

    if(!state.user)
      throw new Error('Неверный токен авторизации!');
  }
  catch(error) {
    state.error = error;
  }
};