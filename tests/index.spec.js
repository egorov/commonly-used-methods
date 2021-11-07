describe('package', () => {

  const methods = require('../index');

  it('should export', () => {

    expect(methods).toEqual({
      configureFileLogger: require('../src/configureFileLogger'),
      commitTransaction: require('../src/commitTransaction'),
      createTransaction: require('../src/createTransaction'),
      executeHttpRequest: require('../src/executeHttpRequest'),
      getUserFromCache: require('../src/getUserFromCache'),
      getUserPermissionsFromCacheAndVerify: require('../src/getUserPermissionsFromCacheAndVerify'),
      makeOperationId: require('../src/makeOperationId'),
      rollbackTransaction: require('../src/rollbackTransaction')
    });
  });
});