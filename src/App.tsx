import { createMachine, interpret } from 'xstate';
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
      <Graph name={ window.location.toString() } />
    </div>
  );  
}

export default App;
