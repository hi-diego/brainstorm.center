import { Suspense } from 'react';
import Graph from './components/Graph';
import './App.css';
import FormState from './state/FormState';
import * as EVENT from './state/MachineEvents';
import { getPassword } from './http/http';
import { useState } from 'react';

function App() {
  const [password, setPassword] = useState(getPassword());
  return (
    <div className="App">
      <Suspense fallback={ <h1 className="loading-text">loading...</h1> }>
        <Graph name={ window.location.toString() } />
      </Suspense>
      <div className="password-container">
        <input
          placeholder="Password"
          className="lock-password"
          value={ password }
          type="password"
          onChange={ e => { setPassword(e.target.value); FormState.send({ type: EVENT.LOCK, password: e.target.value }); }}
        />
      </div>
    </div>
  );  
}

export default App;
