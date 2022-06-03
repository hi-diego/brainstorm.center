// import Graph from 'graph/Graph';
import Graph from 'components/Graph';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Route 
          path={ ['/:notebook/*', '/'] }
          component={
            (props: any) => <Graph notebook={ props.match.params.notebook }/>
          }
        />
      </div>
    </Router>
  );  
}

export default App;
