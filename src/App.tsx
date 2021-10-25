import React from 'react';
import { useState } from 'react';
import Note from 'brainstorm/proxy/Note';
import NoteType from 'brainstorm/Note';
import Notebook from 'brainstorm/Notebook';
import Immutable from 'immutable';
import { init, drawDot } from "three/index";
import './App.css';

init()

function App() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState<Immutable.Set<NoteType>>(Immutable.Set<NoteType>());
  const labels: JSX.Element[] = [];
  const hub = <div className="hub"><p>Notes: {notes.size}</p></div>
  Notebook.onUpdate = (notes: Immutable.Set<NoteType>) => setNotes(notes)
  notes.forEach(note => {
    labels.push(<label onClick={() => setNote(note.title)} key={note.uuid} id={note.title}>{note.title}</label>)
  });
  function setNote(title: string) {
    const note = Notebook.notes.get(title);
    if (!note) return;
    setTitle(note.title);
    setContent(note.content);
  }
  function saveNote(title: string, content: string, event: any) {
    event.preventDefault()
    const note = new Note(title, content);
    drawDot(note);
    return note;
  }
  return (
    <div className="App">
      <header className="App-header">
        {hub}
        {labels}
        <form className="note-form" onSubmit={ event => saveNote(title, content, event) }>
          <input placeholder="title" value={ title } onChange={ event => setTitle(event.target.value) }/>
          <textarea placeholder="content" value={ content } onChange={ event => setContent(event.target.value) }></textarea>
          <button type="submit">add</button>
        </form>
      </header>
    </div>
  );
}

export default App;
