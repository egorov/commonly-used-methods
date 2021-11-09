describe('ExpressResponseMock', () => {

  const ExpressResponseMock = require('./ExpressResponseMock');

  it('should imitate send without status', () => {

    const response = new ExpressResponseMock();
    const value = response.send('OK');

    expect(response.sent[0]).toEqual('OK');
    expect(response).toEqual(value);
  });

  it('should imitate chain of status and send', () => {

    const response = new ExpressResponseMock();
    const value = response.status(200).send('OK');

    expect(response.sent[0]).toEqual('OK');
    expect(response.statuses[0]).toEqual(200);
    expect(response).toEqual(value);
  });

  it('should imitate end', () => {

    const response = new ExpressResponseMock();
    const value = response.end();

    expect(response.sent).toEqual([]);
    expect(response.statuses).toEqual([]);
    expect(response).toEqual(value);
  });

  it('should imitate chain of status and end', () => {

    const response = new ExpressResponseMock();
    const value = response.status(200).end();

    expect(response.sent).toEqual([]);
    expect(response.statuses[0]).toEqual(200);
    expect(response).toEqual(value);
  });
});