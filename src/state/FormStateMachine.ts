import { createMachine } from 'xstate';
import actions, { ACTIONS } from './MachineActions';
import * as STATE from './MachineStates';
import * as EVENT from './MachineEvents';

export const FORM_STATE_MACHINE = 'FORM_STATE_MACHINE';

const FormStateMachine = createMachine({
  id: FORM_STATE_MACHINE,
  initial: STATE.INITIAL,
  context: {
    locked: 0,
    password: '',
    notebook: null
  },
  states: {
    [STATE.INITIAL]: {
      on: {
        [EVENT.FETCH]: {
          target: [STATE.WAITING_SERVER],
        }
      }
    },
    [STATE.WAITING_SERVER]: {
      on: {
        [EVENT.LOAD]: { target: [STATE.LOADED] },
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
      on: {
        [EVENT.SEARCH]: { target: [STATE.SEARCHING] },
      }
    },
    [STATE.SEARCHING]: {
      on: {
        [EVENT.SAVE]: { target: [STATE.WAITING_SERVER] },
        [EVENT.SEARCH]: { target: [STATE.SEARCHING] },
        [EVENT.FOUND]: { target: [STATE.SELECTED] }
      }
    },
    [STATE.SELECTED]: {
      on: {
        [EVENT.SAVE]: { target: [STATE.WAITING_SERVER] },
        [EVENT.UNSELECT]: { target: [STATE.LOADED] }
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
