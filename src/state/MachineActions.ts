import * as ThreeApp from '../three/ThreeApp';
import { fetchNotebook } from '../http/http';
import Notebook from '../brainstorm/Notebook';

export const ACTIONS = {
  FETCH: 'fetch',
  InitThreeApp: 'InitThreeApp'
};

const actions = {
  fetch: async (context: any, event: any) => {
    try { var response = await fetchNotebook() }
    catch { console.error({ context, event }); }
    finally { context.notebook = response; }
  } ,
  InitThreeApp: (context: any, event: any) => {
    console.log('InitThreeApp', context);
    // context.notebook));
    ThreeApp.init();
    ThreeApp.drawNotes(Notebook.notes.valueSeq().toArray());
  }
};

export default actions;