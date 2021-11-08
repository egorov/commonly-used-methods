module.exports = async function getUserPermissionsFromCacheAndVerify(state) {

  if(state.error || !state.user) return;

  try {

    if(typeof state.permission !== 'string')
      throw new Error('В контейнере состояния отсутствует строковое значение permission!');

    if(typeof state.user.user_id === 'undefined')
      throw new Error('Информация о пользователе не содержит user_id!');

    const values = [
      `permissions:${state.user.user_id.toString()}`,
      0,
      -1,
      'WITHSCORES'
    ];

    const permissions = await new Promise((resolve, reject) => {

      state.cache.zrange(values, (error, permissions) => {

        if(error) reject(error);

        resolve(permissions);
      });
    });

    if(permissions.length === 0)
      throw new Error('Разрешения пользователя не найдены!');

    if(permissions.indexOf(state.permission) === -1)
      throw new Error('Пользователь не имеет разрешения на выполнение операции!');
  }
  catch(error) {
    state.error = error;
  }
}