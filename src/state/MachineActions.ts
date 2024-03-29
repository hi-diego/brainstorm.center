import * as ThreeApp from '../three/ThreeApp';
import { fetchNotebook } from '../http/http';
import Notebook from '../brainstorm/Notebook';
import Note from '../brainstorm/Note';
import * as EVENT from './MachineEvents';
import FormState from './FormState';
import { updateNotebook, lockNotebook, setBasicAuth } from '../http/http';

export const ACTIONS = {
  INIT: 'init',
  LOCK: 'lock',
  FETCH: 'fetch',
  SEARCH: 'search',
  SELECT: 'select',
  UNSELECT: 'unselect',
  SAVE: 'save'
};

var init = false;
var timer = 0;

const actions = {
  init: (context: any, event: any) => {
    if (init) return;
    window.scrollTo(0, 1);
    context.locked = !(event.notebook.access === null);
    FormState.send = event.send;
    FormState.machine = event.machine;
    FormState.machine.context.locked = !(event.notebook.access === null);
    context.locked = !(event.notebook.access === null);
    Notebook.loadFrom(Notebook.parse(event.notebook.content));// `{\"OpenSource\":{\"uuid\":\"77b295cc-da2f-4f76-9243-046d6464eb8b\",\"createdAt\":\"2022-08-14T17:32:17.464Z\",\"modifiedAt\":\"2022-08-14T17:32:17.464Z\",\"title\":\"OpenSource\",\"_content\":\"Provides us with transparency \\n\\n\",\"prevContent\":\"\",\"updateNotebook\":true,\"userMentions\":[]},\"AI\":{\"uuid\":\"6e50f75c-f043-4815-90ab-e46bdb3f0396\",\"createdAt\":\"2022-08-14T17:32:17.476Z\",\"modifiedAt\":\"2022-08-14T17:32:17.476Z\",\"title\":\"AI\",\"_content\":\"NLP is gonna be use to distribute the notes in a 3D space using Word2Vec strategies\",\"prevContent\":\"\",\"updateNotebook\":true,\"userMentions\":[]},\"Mission\":{\"uuid\":\"aeb1360d-9920-4609-84c6-c7ee7e0077fa\",\"createdAt\":\"2022-08-14T17:32:17.484Z\",\"modifiedAt\":\"2022-08-14T17:32:17.484Z\",\"title\":\"Mission\",\"_content\":\"provide the best AI driven OpenSource platform for MindMap creation\",\"prevContent\":\"\",\"updateNotebook\":true,\"userMentions\":[]},\"About\":{\"uuid\":\"438f902b-bbc8-4607-bb7b-db6e9215c2e5\",\"createdAt\":\"2022-08-14T17:32:17.490Z\",\"modifiedAt\":\"2022-08-14T17:32:17.490Z\",\"title\":\"About\",\"_content\":\"Minimalist 3D OpenOurce platform for note taking and networked tought\",\"prevContent\":\"\",\"updateNotebook\":true,\"userMentions\":[]},\"3D\":{\"uuid\":\"60c233f6-315b-43f0-8639-9b9bc236d91e\",\"createdAt\":\"2022-08-14T17:32:17.495Z\",\"modifiedAt\":\"2022-08-14T17:32:17.495Z\",\"title\":\"3D\",\"_content\":\"Is not only used for Aesthetics / Esthetics , is rather a symbolism and a functionality, \\n\",\"prevContent\":\"\",\"updateNotebook\":true,\"userMentions\":[]},\"Philosophy\":{\"uuid\":\"d00a3b2e-43bb-45e9-baed-fc9bd673c7f5\",\"createdAt\":\"2022-08-14T17:32:17.500Z\",\"modifiedAt\":\"2022-08-14T17:32:17.500Z\",\"title\":\"Philosophy\",\"_content\":\"Why ? .. simple is better than complex, \\nwords connect ideas ,\\nsimplicity is what we are About  \\n\",\"prevContent\":\"\",\"updateNotebook\":true,\"userMentions\":[]},\"RoadMap\":{\"uuid\":\"5cea6d25-dffb-4b80-af7b-44e8cd2822bd\",\"createdAt\":\"2022-08-14T17:32:17.504Z\",\"modifiedAt\":\"2022-08-14T17:32:17.504Z\",\"title\":\"RoadMap\",\"_content\":\"The next big steps are to implement AI \",\"prevContent\":\"\",\"updateNotebook\":true,\"userMentions\":[]}}`));
    const canvas: HTMLCanvasElement = ThreeApp.init();
    canvas.onclick = () => FormState.send('UNSELECT');
    ThreeApp.drawNotes(Notebook.notes.valueSeq().toArray());
    ThreeApp.drawLinks(Notebook.notes.valueSeq().toArray());
    init = true;
  },
  fetch: async (context: any, event: any) => {
    try { var response = await fetchNotebook() }
    catch { console.error({ context, event }); }
    finally { context.notebook = response; }
  },
  select: async (context: any, event: any) => {
    console.log('Select!', event);
    context.selected = event.note;
    ThreeApp.highlight(event.note);
  },
  unselect: async (context: any, event: any) => {
    console.log('Unselect!', event);
    ThreeApp.disparage(context.selected);
    context.selected = null;
  },
  save: async (context: any, event: any) => {
    console.log(event);
    const note = context.selected ?? new Note(event.title, event.content);
    note.update(event.title, event.content);
    if (event.title === '') {
      ThreeApp.removeNode(note);
      FormState.send({ type: EVENT.UNSELECT });
    } else {
      ThreeApp.drawNotes(Notebook.notes.valueSeq().toArray());
      ThreeApp.drawLinks(Notebook.notes.valueSeq().toArray());
      FormState.send({ type: EVENT.SELECT, note: note });
    }
    window.clearTimeout(timer);
    timer = window.setTimeout(async () => {
      await updateNotebook();
    }, 2500)
  },
  lock: async (context: any, event: any) => {
    try { 
      const unlocked = await lockNotebook(event.password === '' ? null : true, event.password);
      context.locked = false;
      FormState.machine.context.locked = false;
      setBasicAuth(event.password);
      FormState.send('UNSELECT');
    } catch (error: any) {
      context.locked = true;
      FormState.machine.context.locked = true;
      FormState.send('UNSELECT');
    }
  },
  search: async (context: any, event: any) => {
    console.log('Search!', event.title);
    const note = Notebook.notes.get(event.title);
    if (note !== undefined) { 
      FormState.send({ type: EVENT.FOUND, note });
    }
  }
};

export default actions;