import { useEffect, useState } from 'react';
import Notebook from '../brainstorm/Notebook';
import Note from '../brainstorm/Note';
import { useMachine } from '@xstate/react';
import * as EVENT from '../state/MachineEvents';
import FormState from '../state/FormState';

/*
* The entire three.js graph view and the html form controls.
*/
interface FormProps {
  note: Note | null
}

/*
* 
*/
export default function Form (props: FormProps) {
  const [title, setTitle] =  useState(props.note?.title ?? '');
  const [content, setContent] =  useState(props.note?.content ?? '');
  useEffect(() => setTitle(props.note?.title ?? ''), [props.note]);
  useEffect(() => setContent(props.note?.content ?? ''), [props.note]);
  return (
    <form className="note-form" onClick={ event => event.stopPropagation() } onSubmit={ event => event.preventDefault() }>
      <input
        className="note-form-title-input"
        disabled={ false }
        autoFocus
        placeholder="Title"
        value={ title }
        onChange={ e => {
          setTitle(e.target.value);
          if(!props.note) {
            FormState.send({ type: EVENT.SEARCH, title: e.target.value, content })
          } else {
            FormState.send({ type: EVENT.SAVE, note: props.note, content, title: e.target.value })
          }
        }}/>
      {
        (!!props.note
          ? <textarea
              disabled={ false }
              placeholder="Content"
              rows={ 10 }
              value={ content }
              onKeyUp={ e => FormState.send({ type: EVENT.SAVE, note: props.note, content, title }) }
              onChange={ e => setContent(e.target.value) }>
            </textarea>
          : null
        )
      }
      { props.note ? <button>GO</button> : null }
    </form>
  );
}
