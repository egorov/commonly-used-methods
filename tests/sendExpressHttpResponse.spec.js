describe('sendExpressHttpResponse', () => {

  const sendExpressHttpResponse = require('../src/sendExpressHttpResponse');
  const ExpressResponseMock = require('./ExpressResponseMock');

  it('should sent content', () => {

    const state = {
      response: new ExpressResponseMock(),
      responseContent: {
        statusCode: 200,
        body: 'OK'
      }
    };

    sendExpressHttpResponse(state);

    expect(state.error).toBeUndefined();
    expect(state.response.sent).toEqual(['OK']);
    expect(state.response.statuses[0]).toEqual(200);
  });

  it('should pass', () => {

    const state = {
      response: new ExpressResponseMock(),
      responseContent: {
        statusCode: 400
      }
    };

    sendExpressHttpResponse(state);

    expect(state.error).toBeUndefined();
    expect(state.response.sent).toEqual([]);
    expect(state.response.statuses).toEqual([ 400 ]);
  });

  it('should pass', () => {

    const state = {
      response: new ExpressResponseMock(),
      responseContent: {
        body: 'OK'
      }
    };

    sendExpressHttpResponse(state);

    expect(state.error).toBeUndefined();
    expect(state.response.sent).toEqual([ 'OK' ]);
    expect(state.response.statuses).toEqual([]);
  });  

  it('should pass', () => {

    const state = {
      response: new ExpressResponseMock(),
      responseContent: {}
    };

    sendExpressHttpResponse(state);

    expect(state.error).toBeUndefined();
    expect(state.response.sent).toEqual([]);
    expect(state.response.statuses).toEqual([ 501 ]);
  });

  it('should pass', () => {

    const state = {
      response: new ExpressResponseMock()
    };

    sendExpressHttpResponse(state);

    expect(state.error).toBeUndefined();
    expect(state.response.sent).toEqual([]);
    expect(state.response.statuses).toEqual([ 501 ]);
  });

  it('should pass', () => {

    const state = {
      response: new ExpressResponseMock(),
      responseContent: {
        statusCode: 400,
        body: {
          danger: 'Something went wrong!'
        }
      }
    };

    sendExpressHttpResponse(state);

    expect(state.error).toBeUndefined();
    expect(state.response.sent[0]).toEqual(state.responseContent.body);
    expect(state.response.statuses[0]).toEqual(400);
  });  
});