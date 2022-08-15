import Graph from './components/Graph';
import './App.css';

function App() {
  return (
    <div className="App">
      <Graph name={ window.location.toString() } />
    </div>
  );  
}

export default App;
