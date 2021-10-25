import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Note from 'brainstorm/Note';
import Notebook from 'brainstorm/Notebook';
import Directory from 'brainstorm/Directory';

const note = new Note('First Note', 'content');
const handler = {
  construct(target, args) {
    Notebook.update(target);
    return new target(...args);
  },
  set(target: any, prop: any, value: any, receiver: any) {
    if (prop === 'content') {
      Directory.update(target, value);
      Notebook.update(target);
      target[prop] = value;
    }
    return true;
  }
}
const proxyNote = new Proxy(note, handler);
proxyNote.content = 'new better'
proxyNote.content = 'foo bar baz'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
