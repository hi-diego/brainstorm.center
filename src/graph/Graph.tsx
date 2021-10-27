import React from 'react';
// import { default as NoteProxy } from 'brainstorm/proxy/Note';
// import { drawDot } from "three/index";
// import Note from 'brainstorm/Note';
// import Mention from 'brainstorm/Mention';
// import Immutable from 'immutable';

/**
 * Graph.
 * @class
 */
class Graph extends React.Component {

  // public notes: Immutable.Map<string, Note>;
  // public onUpdate: (notes: Immutable.Set<Note>) => void;

  constructor () {
    // this.onUpdate = () => null;
    // this.notes = notes;
  }

  hub(): JSX.Element {
    return <div className="hub"><p>Notes: 0</p></div>;
  }

  render(): JSX.Element {
    return (
      <div className="App">
        <header className="App-header">
          { this.hub() }
        </header>
      </div>;
    )
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  // update(note: Note) {
  //   this.notes = this.notes.set(note.title, note)
  //   this.onUpdate(this.notes.toSet())
  //   window.localStorage.setItem('brainstorm.center.notes', JSON.stringify(this.notes.toJSON()))
  // }

  // start() {
  //   const storedNotes = JSON.parse(window.localStorage.getItem('brainstorm.center.notes') || '{}')
  //   const notes = []
  //   for (const key in storedNotes) {
  //     const storedNote = storedNotes[key];
  //     const note = new NoteProxy(storedNote.title, storedNote.content, storedNote.uuid, Immutable.Set<Mention>(storedNote.userMentions), storedNote.createdAt);
  //     notes.push(note)
  //     drawDot(note, false);
  //   }
  //   notes.forEach(note => drawDot(note));
  // }
}

export default Graph();