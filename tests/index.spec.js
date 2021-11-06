describe('package', () => {

  const methods = require('../index');

  it('should export', () => {

    expect(methods).toEqual({
      configureFileLogger: require('../src/configureFileLogger'),
      executeHttpRequest: require('../src/executeHttpRequest'),
      makeOperationId: require('../src/makeOperationId')
    });
  });
});