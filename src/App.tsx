import { useMachine } from '@xstate/react';
import { Suspense } from 'react';
import * as EVENT from './state/MachineEvents';
import Graph from './components/Graph';
import './App.css';

function App() {
  // const [machine, send] = useMachine('');
  return (
    <div className="App">
      <Suspense fallback={ <h1 className="loading-text">loading...</h1> }>
        <Graph name={ window.location.toString() } />
      </Suspense>
      <div className="password-container">
        <input
          placeholder="Password"
          className="lock-password"
          value={ '' }
          type="password"
          onChange={ event => null }
        />
      </div>
    </div>
  );  
}

export default App;
