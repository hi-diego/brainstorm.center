import actions, { ACTIONS } from '../state/MachineActions';
import * as STATE from '../state/MachineStates';
import Form from './Form';
import { useMachine } from '@xstate/react';
import { useEffect, useRef } from 'react';
import FormStateMachine from '../state/FormStateMachine';
import * as EVENT from '../state/MachineEvents';
import { wrapPromise, fetchNotebook } from '../http/http';

const notebookReader = wrapPromise(fetchNotebook());

interface GraphProps {
  name: string
}

const styles: { [key: string]: React.CSSProperties } = {
  AppHeader: {
    minHeight: window.innerHeight,
  }
};

export default function Graph(props: GraphProps) {
  const notebook = notebookReader.read();
  const [machine, send] = useMachine(FormStateMachine);
  return (
    <header onClick={ () => null } className="App-header" style={ styles.AppHeader }>
      <Form note={ null } />
    </header>
  );
}