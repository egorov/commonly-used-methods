module.exports = async function commitTransaction(state) {

  if(state.error) return;

  if(typeof state.transaction !== 'function') return;

  try {

    const transaction = await state.transaction();

    if(transaction.isCompleted()) 
      return;

    state.transactionResult = await transaction.commit();

  }
  catch(error) {
    state.error = error;        
  }
};