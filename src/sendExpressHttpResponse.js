'use strict';

module.exports = function sendExpressHttpResponse(state) {

  try {

    if(!state.responseContent) {
      
      state.response.status(501).end();
      
      return;
    }

    if(typeof state.responseContent.statusCode !== 'number') {

      if(typeof state.responseContent.body !== 'undefined') {

        state.response.send(state.responseContent.body);

        return;
      }        
    }

    if(typeof state.responseContent.statusCode === 'number') {

      const code = state.responseContent.statusCode;

      if(typeof state.responseContent.body === 'undefined') {

        state.response.status(code).end();

        return;
      }

      const body = state.responseContent.body;

      state.response.status(code).send(body);

      return;
    }

    state.response.status(501).end();
  }
  catch(error) {
    state.error = error;
  }
}