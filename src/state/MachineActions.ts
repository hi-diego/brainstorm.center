import * as ThreeApp from '../three/ThreeApp';
import { fetchNotebook } from '../http/http';
import Notebook from '../brainstorm/Notebook';

export const ACTIONS = {
  FETCH: 'fetch',
  SELECT: 'select',
  UNSELECT: 'unselect',
  InitThreeApp: 'InitThreeApp'
};

const actions = {
  fetch: async (context: any, event: any) => {
    try { var response = await fetchNotebook() }
    catch { console.error({ context, event }); }
    finally { context.notebook = response; }
  },
  select: async (context: any, event: any) => {
    context.selected = event.note;
  },
  unselect: async (context: any, event: any) => {
    context.selected = null;
  },
  InitThreeApp: (context: any, event: any) => {
    console.log('InitThreeApp', context);
    // context.notebook));
    ThreeApp.init();
    ThreeApp.drawNotes(Notebook.notes.valueSeq().toArray());
    ThreeApp.drawLinks(Notebook.notes.valueSeq().toArray());
  }
};

export default actions;