import Form from './Form';
import { useMachine } from '@xstate/react';
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

export default function Graph(props: GraphProps) {
  const [current, send] = useMachine(FormStateMachine);
  return <header onClick={ () => null } className="App-header" style={ styles.AppHeader }>
    <Form note={ null } />
  </header>;
}