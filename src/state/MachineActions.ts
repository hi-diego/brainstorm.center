import { fetchNotebook } from '../http/http';

export const ACTIONS = {
  FETCH: 'fetch'
};

const actions = {
  fetch: async (context: any, event: any) => {
    try { var response = await fetchNotebook() }
    catch { console.error({ context, event }); }
    finally { context.notebook = response; }
  }  
};

export default actions;