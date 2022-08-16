import { useEffect, useState } from 'react';
import Notebook from '../brainstorm/Notebook';
import Note from '../brainstorm/Note';

/*
* The entire three.js graph view and the html form controls.
*/
interface FormProps {
  note: Note | null,
}

/*
* 
*/
export default function Form (props: FormProps) {
  const title = '';
  const content = '';
  const password = '';
  return (
    <form className="note-form" onClick={ event => event.stopPropagation() } onSubmit={ event => event.preventDefault() }>
      <input
        disabled={ false }
        autoFocus
        placeholder="Title"
        value={ title }
        onKeyDown={ e => null }
        onChange={ e => null }
       />
      <textarea
        disabled={ false }
        placeholder="Content"
        rows={ 10 }
        value={ content }
        onChange={ e => null}>
      </textarea>
      <button>GO</button>
    </form>
  );
}
