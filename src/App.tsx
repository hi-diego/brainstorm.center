import Gun from 'gun';
import 'gun/sea';
import Graph from 'components/Graph';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

// get the username from the host: example: http://menuguru.brainstorm.center -> menuguru will be the username
const username = ((window as any).location.host || '').split(':').shift().split('.').shift();
const gun = Gun(['http://localhost:8765/gun']);
const auth = gun.user();
// const user = gun.user();
var storedPassword = window.localStorage.getItem('brainstorm.center.password') || askUserForPassword();
createUserFromSubdomain(storedPassword);

function createUserFromSubdomain (pass: string) : boolean {
  auth.create(username, pass || '', (ack: any) => {
    if (!!ack.err) return window.localStorage.setItem('brainstorm.center.password', pass);
    if (ack.err === 'User already created!') authUser(pass);
    else createUserFromSubdomain(askUserForPassword());
  });
  return false;
}

function askUserForPassword () : string {
  const password = window.prompt('Provide a password', '123456789') || '';
  if (password.length < 9) return askUserForPassword();
  window.localStorage.setItem('brainstorm.center.password', password);
  return password;
}

function authUser (pass word: string) {
  auth.auth(username, password, (res: any) => {
    if (!!res.err) return window.localStorage.setItem('brainstorm.center.user', res);
    askUserForPassword();
  });
}


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
