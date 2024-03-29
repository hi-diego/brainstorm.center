import { createRef, useEffect, useState } from 'react';
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
  const contentRef = createRef<HTMLTextAreaElement>();
  const titleRef = createRef<HTMLInputElement>();
  useEffect(() => {
    props.note
    setTitle(props.note?.title ?? '');
    setContent(props.note?.content ?? '');
    if (props.note) {
      contentRef.current?.blur();
      titleRef.current?.blur();
    }
  }, [props.note]);
  return (
    <form className="note-form" onClick={ event => event.stopPropagation() } onSubmit={ event => event.preventDefault() }>
      <input
        className="note-form-title-input"
        ref={ titleRef }
        disabled={ props.note === null ? false : FormState.machine?.context.locked }
        autoFocus
        placeholder="Title"
        value={ title }
        onKeyUp={ e => (e.key === 'Enter' && props.note === null) ? FormState.send({ type: EVENT.SAVE, content, title }) : null }
        onChange={ e => {
          setTitle(e.target.value);
          if(!props.note) {
            FormState.send({ type: EVENT.SEARCH, title: e.target.value, content })
          } else {
            FormState.send({ type: EVENT.SAVE, content, title: e.target.value })
          }
        }}/>
      {
        (!!props.note
          ? <textarea
              ref={ contentRef }
              disabled={ FormState.machine?.context.locked }
              placeholder="Content"
              rows={ 10 }
              value={ content }
              onKeyUp={ e => FormState.send({ type: EVENT.SAVE, note: props.note, content, title }) }
              onChange={ e => setContent(e.target.value) }>
            </textarea>
          : null
        )
      }
      { props.note ? <a href={ (window.location.pathname + '/' + props.note.title).replaceAll(/(\/+)/g, '/') }>GO</a>: null }
    </form>
  );
}
