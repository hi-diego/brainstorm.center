import actions, { ACTIONS } from '../state/MachineActions';
import * as STATE from '../state/MachineStates';
import Form from './Form';
import { useMachine } from '@xstate/react';
import { useEffect, useRef } from 'react';
import FormStateMachine from '../state/FormStateMachine';
import * as EVENT from '../state/MachineEvents';

interface GraphProps {
  name: string
}

const styles: { [key: string]: React.CSSProperties } = {
  AppHeader: {
    minHeight: window.innerHeight,
  }
};

// const timer = 0;

export default function Graph(props: GraphProps) {
  // const init = useRef(false);
  const [machine, send] = useMachine(FormStateMachine);
  // if (timer === 0) window.setTimeout();
  // window.clearTimeout(timer);
  // useEffect(() => { 
  //   if (init.current) return;
  //   send(EVENT.FETCH);
  //   init.current = true;
  //   console.log(machine.value)
  // }, []);
      // <Form note={ null } />
  return (
    <header onClick={ () => null } className="App-header" style={ styles.AppHeader }>
      <button onClick={ e => send(EVENT.FETCH) }>SEND</button>
      {<h1> { machine.value } </h1>}
    </header>
  );
}