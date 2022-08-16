import actions, { ACTIONS } from '../state/MachineActions';
import * as STATE from '../state/MachineStates';
import Form from './Form';
import { useMachine } from '@xstate/react';
import { useEffect, useRef, useState } from 'react';
import FormStateMachine from '../state/FormStateMachine';
import Notebook from '../brainstorm/Notebook';
import Note from '../brainstorm/Note';
import * as EVENT from '../state/MachineEvents';
import { wrapPromise, fetchNotebook } from '../http/http';
import Tooltip from './Tooltip';

const notebookReader = wrapPromise(fetchNotebook());

interface GraphProps {
  name: string
};

const styles: { [key: string]: React.CSSProperties } = {
  AppHeader: {
    minHeight: window.innerHeight,
  }
};

export default function Graph(props: GraphProps) {
  const notebook = notebookReader.read();
  const [machine, send] = useMachine(FormStateMachine);
  useEffect(() => { send({ type: EVENT.LOAD, notebook: notebook, machine, send }) }, []);
  const tooltips = Notebook.notes.valueSeq().toArray().map(n =>
    <Tooltip onSelect={ () => send({ type: EVENT.SELECT, note: n }) } key={ n.title } note={ n } selected={ n.title === machine.context.selected?.title }/>
  );
  return (
    <header onClick={ () => console.log('Click On AppHEader') } className="App-header" style={ styles.AppHeader }>
      <h1 style={ ({ zIndex: 3 }) }>{ machine.value }</h1>
      { tooltips } 
      <Form note={ null } />
    </header>
  );
}