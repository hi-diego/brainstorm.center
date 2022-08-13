import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Notebook from 'brainstorm/Notebook';
// import * as Three from 'three/index';
// import createNode from 'three/createNode  ';
import Note from 'brainstorm/Note';
import { lockNotebook, RemoteNotebook } from 'http/http';

/*
* The entire three.js graph view and the html form controls.
*/
interface FormProps {
  notebook: string,
  remoteNotebook: RemoteNotebook|null,
  note: Note | null,
  showGo: boolean,
  onCreate?: (note: Note) => void
}

/*
*
*/
type Setter = React.Dispatch<React.SetStateAction<string>>;

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
function createNote(title: string, content: string = ''): Note {
  const note = new Note(title, content);
  return note;
}

/*
* 
*/
function updateContent(event: React.ChangeEvent<HTMLTextAreaElement>, setContent: Setter, title: string, note: Note, onCreate?: (note: Note) => void) {
  setContent(event.target.value);
  note.update(note.title, event.target.value);
}

/*
* 
*/
function updateTitle(key: string, title: string, note: Note|null, onCreate?: (note: Note) => void) {
  if (key !== 'Enter') return;
  const newTitle: string = toCamelCase(title);
  if (note !== null) return note.update(newTitle);
  else if (onCreate) onCreate(createNote('').update(newTitle));
}

/*
* 
*/
function toCamelCase (str: string): string {
  return str.replace(/\s+(.)/g, (match, chr) => chr.toUpperCase());
}

/*
* 
*/
function search(title: string, setTitle: Setter, note: Note|null = null, onCreate?: (note: Note) => void) {
  // TODO: if the tittle didnt change and the user keydown enter , navigate to that route note.title
  const newTitle: string = toCamelCase(title);
  setTitle(newTitle);
  if (note !== null) return updateTitle('Enter', newTitle, note);
  const noteFound: Note|undefined = Notebook.notes.get(newTitle);
  if (onCreate && noteFound !== undefined) onCreate(noteFound);
}

var timer = 0;

function setPass (password: string, pass: boolean|null = true) {
  // on Password change bounce the server notebook update call
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    lockNotebook(pass, password);
  }, 500);
}

/*
* 
*/
export default function Form (props: FormProps) {
  console.log(props.remoteNotebook && props.remoteNotebook.access);
  // Initialize title reactive value.
  const [askingForPassword, setAskingForPassword] = useState<boolean>(false);
  // Initialize title reactive value.
  const [locked, setLocked] = useState<boolean|null>(props.remoteNotebook && props.remoteNotebook.access);
  // Initialize title reactive value.
  const [password, setPassword] = useState<string>('');
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
        disabled={ !!locked }
        autoFocus
        placeholder="Title"
        value={ title }
        onKeyDown={ e => updateTitle(e.key, title, props.note, props.onCreate) }
        onChange={ e => search(e.target.value, setTitle, props.note, props.onCreate) }
      />
      {
        props.note !== null
          ? (<textarea
              disabled={ !!locked }
              placeholder="Content"
              rows={ 10 }
              value={ content }
              onChange={ e => props.note && updateContent(e, setContent, title, props.note) }>
            </textarea>)
          : null
      }
      {   props.showGo ? <Link to={ path + props.notebook }>GO</Link> : null }
      {  askingForPassword
         ? <input placeholder="Password" className="lock-password" value={ password } type="password" onChange={ event => setPassword(event.target.value) } onKeyDown={ e => { if(e.key !== 'Enter') return; setPass(password); setAskingForPassword(false); setLocked(true); } }/>
         : <button className="lock-button" onClick={ () => { if(!locked) return setAskingForPassword(true);  setPass('12345678', null); setLocked(false); } }>{ locked ? 'UNLOCK' : 'LOCK' }</button>
      }
    </form>
  );
}
