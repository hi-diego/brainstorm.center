import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Notebook from 'brainstorm/Notebook';
import * as Three from 'three/index';
import createNode from 'three/createNode';
import Note from 'brainstorm/Note';

/*
* The entire three.js graph view and the html form controls.
*/
interface FormProps {
  notebook: string,
  onCreate: (note: Note) => void
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
function save(title: string, content: string, onCreate?: (note: Note) => void) {
  // Create new Note.
  const note = new Note(title, content);
  createNode(note);
  if (onCreate) onCreate(note);
  // Update the Notebook.
  // Notebook.update(note);
}

/*
* 
*/
function updateContent(event: React.ChangeEvent<HTMLTextAreaElement>, setContent: Setter) {
  setContent(event.target.value);
}

/*
* 
*/
function updateTitle(event: React.ChangeEvent<HTMLInputElement>, setTitle: Setter) {
  setTitle(event.target.value);
}

/*
* 
*/
function onTitleKeyDown(key: string, title: string, content: string, onCreate?: (note: Note) => void) {
  // TODO: if the tittle didnt change and the user keydown enter , navigate to that route note.title
  if (key === 'Enter') return save(title, content, onCreate);
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
  const [title, setTitle] = useState<string>('');
  // Initialize content reactive value.
  const [content, setContent] = useState<string>('');
  // Initialize the form with the url selected notebook.
  useEffect(() => initForm(props.notebook, setTitle, setContent), [props.notebook]);
  // Render the form.
  return (
    <form className="note-form" onSubmit={ event => event.preventDefault() }>
      <h1>{ props.notebook }</h1>
      <label className="placeholder">{ null }</label>
      <input
        autoFocus
        placeholder="Title"
        value={ title }
        onKeyDown={ e => onTitleKeyDown(e.key, title, content, props.onCreate) }
        onChange={ e => updateTitle(e, setTitle) }
      />
      <textarea
        placeholder="Content"
        rows={ 10 }
        value={ content }
        onKeyDown={ e => onTitleKeyDown(e.key, title, content, props.onCreate) }
        onChange={ e => updateContent(e, setContent) }
      ></textarea>
      <Link to={ '' }>GO</Link>
    </form>
  );
}
