module.exports = async function getUserFromCache(state) {

  if(state.error) return;

  try {
    const authorization = state.request.get('authorization');

    if(typeof authorization !== 'string') 
      throw new Error('Request Authorization header not found!');
  
    const accessToken = authorization.replace(/Bearer\s*/, '');
  
    if(accessToken.length === 0) 
      throw new Error('Wrong request Authorization header value!');
    
    state.user = await new Promise((resolve, reject) => {

      state.cache.hgetall(accessToken, (error, value) => {
    
        if(error) reject(error);
           
        resolve(value);
      });   
    });

    if(!state.user)
      throw new Error('Wrong Authorization token!');
  }
  catch(error) {
    state.error = error;
  }
};