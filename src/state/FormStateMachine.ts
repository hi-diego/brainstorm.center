import { createMachine } from 'xstate';
import actions, { ACTIONS } from './MachineActions';
import * as STATE from './MachineStates';
import * as EVENT from './MachineEvents';
import Note from '../brainstorm/Note';
import Notebook, { Notebook as NotebookClass } from '../brainstorm/Notebook';

export const FORM_STATE_MACHINE = 'FORM_STATE_MACHINE';

interface FormStateMachineContext {
  locked: boolean,
  password: string,
  selected: Note|null,
  notebook: NotebookClass,
  notes: Note[],
}

const context: FormStateMachineContext = 
{
  locked: false,
  password: '',
  selected: null,
  notebook: Notebook,
  notes: Notebook.notes.valueSeq().toArray(),
};
const FormStateMachine = createMachine({
  id: FORM_STATE_MACHINE,
  initial: STATE.INITIAL,
  context: context,
  states: {
    [STATE.INITIAL]: {
      on: {
        [EVENT.LOAD]: {
          actions: [ACTIONS.INIT],
          target: [STATE.LOADED],
        }
      }
    },
    [STATE.WAITING_SERVER]: {
      on: {
        [EVENT.SELECT]: { target: [STATE.SELECTED] },
        [EVENT.UNSELECT]: { target: [STATE.LOADED] },
        [EVENT.SAVE_ERROR]: { target: [STATE.SAVE_ERROR] },
        [EVENT.NOT_FOUND]: { target: [STATE.NOT_FOUND] },
      }
    },
    [STATE.NOT_FOUND]: {
      on: {
        [EVENT.SAVE]: { target: [STATE.WAITING_SERVER] },
      }
    },
    [STATE.LOADED]: {
      entry: [ACTIONS.UNSELECT],
      on: {
        [EVENT.SEARCH]: { target: [STATE.SEARCHING] },
        [EVENT.SELECT]: { target: [STATE.SELECTED] },
        [EVENT.LOCK]: { target: [STATE.LOCKING] },
      }
    },
    [STATE.SEARCHING]: {
      entry: [ACTIONS.SEARCH],
      on: {
        [EVENT.SAVE]: { target: [STATE.WAITING_SERVER], actions: [ACTIONS.SAVE] },
        [EVENT.SELECT]: { target: [STATE.SELECTED] },
        [EVENT.SEARCH]: { target: [STATE.SEARCHING] },
        [EVENT.FOUND]: { target: [STATE.SELECTED] }
      }
    },
    [STATE.LOCKING]: {
      entry: [ACTIONS.LOCK],
      on: {
        [EVENT.UNSELECT]: { target: [STATE.LOADED] } 
      }
    },
    [STATE.SELECTED]: {
      entry: [ACTIONS.SELECT],
      on: {
        [EVENT.SAVE]: { target: [STATE.WAITING_SERVER], actions: [ACTIONS.SAVE] },
        [EVENT.UNSELECT]: { target: [STATE.LOADED] },
        [EVENT.SELECT]: { target: [STATE.SELECTED] },
        [EVENT.LOCK]: { target: [STATE.LOCKING] },
      }
    },
    [STATE.SAVE_ERROR]: {
      on: {
        [EVENT.LOAD]: { target: [STATE.LOADED] },
      }
    }
  }
}, { actions });

export default FormStateMachine;
