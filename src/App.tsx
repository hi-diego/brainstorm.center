import React from 'react';
import { useState } from 'react';
import Note from 'brainstorm/proxy/Note';
import NoteType from 'brainstorm/Note';
import Mention from 'brainstorm/Mention';
import Notebook from 'brainstorm/Notebook';
import Directory from 'brainstorm/Directory';
import Immutable from 'immutable';
import { init, drawDot, highlight } from "three/index";
import './App.css';

init()
Notebook.start()

function App() {
  const [mentionKey, setMentionKey] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selecting, setSelecting] = useState(false);
  const [notes, setNotes] = useState<Immutable.Set<NoteType>>(Notebook.notes.toSet());
  const labels: JSX.Element[] = [];
  const hub = <div className="hub"><p>Notes: {notes.size}</p></div>
  Notebook.onUpdate = (notes: Immutable.Set<NoteType>) => setNotes(notes)
  notes.forEach(note => {
    labels.push(<label className={ title === note.title ? 'selected' : ''} onClick={() => selectNote(note.title)} key={note.uuid} id={note.title}>{note.title}</label>)
  });
  function createNexus(to: NoteType) {
    const from = Notebook.notes.get(title);
    if (!from) return setSelecting(false);
    console.log(from)
    from.userMentions = from.userMentions.add(new Mention(from.clone(), to.clone(), mentionKey, true));
    // Directory.update(from, from.content);
    Notebook.update(from);
    setTitle(to.title);
    drawDot(from);
    setSelecting(false);
  }
  function unselect() {
    setTitle('');
    setContent('');
    highlight()
    return setSelecting(false);
  }
  function selectNote(_title: string) {
    const note = Notebook.notes.get(_title);
    if (!note) return;
    highlight();
    highlight(_title);
    setTitle(_title);
    setContent(note.content);
    if (title === _title) {
      if (selecting) return unselect();
      return setSelecting(true);
    }
    if (selecting) return createNexus(note);
  }
  function saveNote(title: string, content: string, event: any = null) {
    if (event) event.preventDefault();
    const note = new Note(title, content);
    drawDot(note);
    return note;
  }
  return (
    <div className="App">
      <header className="App-header">
        {hub}
        {labels}
        {selecting
          ? <form className="note-form">
            <input placeholder="key" value={ mentionKey } onChange={ event => setMentionKey(event.target.value) }/>
          </form>
          : <form className="note-form" onSubmit={ event => saveNote(title, content, event) }>
            <input placeholder="Title" value={ title } onChange={ event => setTitle(event.target.value) }/>
            <textarea rows={10} placeholder="Content" value={ content } onChange={ event => setContent(event.target.value) }></textarea>
            <button type="submit">add</button>
          </form>
        }
      </header>
    </div>
  );
}

export default App;
