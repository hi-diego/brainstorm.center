import { createMachine, interpret } from 'xstate';
import { Suspense } from 'react';
import * as EVENT from './state/MachineEvents';
import Graph from './components/Graph';
import './App.css';

function App() {
  return (
    <div className="App">
      <Suspense fallback={ <h1 className="loading-text">loading...</h1> }>
        <Graph name={ window.location.toString() } />
      </Suspense>
    </div>
  );  
}

export default App;
