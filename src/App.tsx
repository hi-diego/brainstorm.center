import React from 'react';
import { useState } from 'react';
import logo from './logo.svg';
import Note from 'brainstorm/proxy/Note';
import Notebook from 'brainstorm/Notebook';
import Directory from 'brainstorm/Directory';
import Immutable from 'immutable';
import './App.css';

function App() {
  // const [notes, setNotes] = useState(new Immutable.Map<string, Notes>())
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  var notesjsx: JSX.Element[] = [];
  Notebook.notes.forEach((note, key, map) => {
    notesjsx.push(
      <li key={key}>
        <h3>{note.title}</h3>  
        <p>{note.content}</p>
        <p><strong>mentions: {note.mentions()}</strong></p>
        <p><strong>references: {note.references()}</strong></p>
      </li>
    );
  });
  var dirjsx: JSX.Element[] = [];
  Directory.dir.forEach((value, key, map) => {
    dirjsx.push(
      <small>{key}, </small>
    );
  });
  function newNote(title, content, event) {
    event.preventDefault()
    return new Note(title, content)
  }
  return (
    <div className="App">
      <header className="App-header">
        <ol>{notesjsx}</ol>
        <p>{dirjsx}</p>
        <form className="note-form" onSubmit={ event => newNote(title, content, event) }>
          <input placeholder="title" value={ title } onChange={ event => setTitle(event.target.value) }/>
          <textarea placeholder="content" value={ content } onChange={ event => setContent(event.target.value) }></textarea>
          <button type="submit">add</button>
        </form>
      </header>
    </div>
  );
}

export default App;
