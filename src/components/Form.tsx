import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Notebook from 'brainstorm/Notebook';
// import * as Three from 'three/index';
// import createNode from 'three/createNode  ';
import Note from 'brainstorm/Note';
import http from 'http/http';

/*
* The entire three.js graph view and the html form controls.
*/
interface FormProps {
  notebook: string,
  note: Note | null,
  showGo: boolean,
  onCreate?: (note: Note) => void
}

/*
*
*/
type Setter = React.Dispatch<React.SetStateAction<string>>;
type SetterBool = React.Dispatch<React.SetStateAction<boolean>>;

/*
* 
*/
function initForm(notebook: string, setTitle: Setter, setContent: Setter) {
  // Retrive the notebook  from the repository.
  const note = Notebook.notes.get(notebook);
  // Set the correspondent title value.
  setTitle(note?.title || '');
  // Set the correspondent content value.
  setContent(note?.content || '');
} 

/*
* 
*/
function save(title: string, content: string, onCreate?: (note: Note) => void) {
  if (!title || title === '') return;
  // Create new Note.
  const currentNote = Notebook.notes.get(title);
  if (currentNote) return currentNote.update(title, content);
  const note = new Note(title, content);
  // console.log(note);
  // createNode(note);
  if (onCreate) onCreate(note);
  // Update the Notebook.
  // Notebook.update(note);
}

/*
* 
*/
function updateContent(event: React.ChangeEvent<HTMLTextAreaElement>, setContent: Setter, title: string) {
  setContent(event.target.value);
  const camecasifiedTitle: string  = toCamelCase(title);
  save(camecasifiedTitle, event.target.value);
}

/*
* 
*/
function updateTitle(event: React.ChangeEvent<HTMLInputElement>, setTitle: Setter, title: string, note: Note | null) {
  const newTitle: string = toCamelCase(event.target.value);
  setTitle(newTitle);
  if (note) note.update(newTitle);
}

/*
* 
*/
async function createNotebook() {
  try {
    var response = http.post('', {
      password: "12345678",
      access: null,
      uri: Notebook.getUri(),
      content: "{}"
    });
  } catch (err) {
    console.log(err);
  }
}

async function lockCurrentNotebook (locked: boolean|null, setLock: SetterBool) {
  setLock((await lockNotebook(locked)));
}

/*
* 
*/
async function lockNotebook(locked: boolean|null) {
  try {
    var response = await http.put(Notebook.getUri(), {
      password: "12345678",
      access: locked,
      uri: Notebook.getUri(),
      content: Notebook.stringContent()
    });
    return response.data.access;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/*
* 
*/
async function fetchNotebook() {
  var notebook = null;
  try {
    var response = await http.get(Notebook.getUri());
    console.log(response);
    notebook = response.data;
    const notes = JSON.parse(response.data.content);
    Notebook.loadFrom(notes);
  } catch (error: any) {
    if (error.response.status === 404) notebook = await createNotebook();
  } finally {
    
  }
}

/*
* 
*/
function toCamelCase (str: string): string {
  return str.replace(/\s+(.)/g, (match, chr) => chr.toUpperCase());
}

function ucfirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/*
* 
*/
function onTitleKeyDown(key: string, title: string, content: string, onCreate?: (note: Note) => void, note: Note | null = null) {
  // TODO: if the tittle didnt change and the user keydown enter , navigate to that route note.title
  const camecasifiedTitle: string  = toCamelCase(title);
  if (key === 'Enter') return save(camecasifiedTitle, content, onCreate);
  // if (event.key === 'ArrowRight' && state.placeholder) {
  //   const note = Notebook.notes.get(state.placeholder); 
  //   if (note) select(note);
  // }
}

/*
* 
*/
export default function Form (props: FormProps) {
  // Initialize title reactive value.
  const [lock, setLock] = useState<boolean>(false);
  // Initialize title reactive value.
  const [title, setTitle] = useState<string>('');
  // Initialize content reactive value.
  const [content, setContent] = useState<string>('');
  // Initialize the form with the url selected notebook.
  // useEffect(() => selectNote(), [title]);
  // Initialize the form with the url selected notebook.
  useEffect(() => initForm(props.notebook, setTitle, setContent), [props.notebook]);
  // Render the form.
  const path = window.location.pathname && window.location.pathname !== '/'
      ? (window.location.pathname + '/')
      : '';
  return (
    
    <form className="note-form" onClick={ event => event.stopPropagation() } onSubmit={ event => event.preventDefault() }>
      {/* <h1>{ props.notebook }</h1> */}
      <label className="placeholder">{ null }</label>
      <input
        disabled={ lock }
        autoFocus
        placeholder="Title"
        value={ title }
        onChange={ e => updateTitle(e, setTitle, title, props.note) }
      />
      <textarea
        disabled={ lock }
        placeholder="Content"
        rows={ 10 }
        value={ content }
        onKeyDown={ e => onTitleKeyDown(e.key, title, content, props.onCreate) }
        onChange={ e => updateContent(e, setContent, title) }
      ></textarea>
      {   props.showGo ? <Link to={ path + props.notebook }>GO</Link> : null }
      <button className="lock-button" onClick={ async () => await lockCurrentNotebook(lock, setLock) }>{ lock ? 'UNLOCK' : 'LOCK' }</button>
    </form>
  );
}
