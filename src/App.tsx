import { createMachine, interpret } from 'xstate';
import { Suspense } from 'react';
import FormStateMachine from './state/FormStateMachine';
import * as EVENT from './state/MachineEvents';
import Graph from './components/Graph';
import './App.css';

const machineService = interpret(FormStateMachine);
machineService.start();
window.setTimeout(() => machineService.send({ type: EVENT.FETCH }), 1);

function App() {
  return (
    <div className="App">
      <Suspense fallback={ <h1>loading...</h1> }>
        <Graph name={ window.location.toString() } />
      </Suspense>
    </div>
  );  
}

export default App;
