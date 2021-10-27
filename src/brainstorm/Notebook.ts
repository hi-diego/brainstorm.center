import { drawDot } from "three/index";
import Note from 'brainstorm/Note';
import Mention from 'brainstorm/Mention';
import Directory from 'brainstorm/Directory';
import Immutable from 'immutable';

/**
 * Notebook.
 * @class
 */
class Notebook {

  public notes: Immutable.Map<string, Note>;
  public onUpdate: (notes: Immutable.Set<Note>) => void;

  constructor (notes: Immutable.Map<string, Note>) {
    this.notes = notes;
    // for testing
    // this.notes = Immutable.Map<string, Note>([ new Note('foo', 'bar'), new Note('bar', 'goo') ]);
    this.onUpdate = () => null;
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  public update(note: Note, newContent?: string) {
    if (newContent) Directory.update(note, newContent);
    this.notes = this.notes.set(note.title, note)
    this.onUpdate(this.notes.toSet())
    window.localStorage.setItem('brainstorm.center.notes', JSON.stringify(this.notes.toJSON()))
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  // public Note(title: string, content: string, uuid?: string) {

  // }

  public start() {
    const storedNotes = JSON.parse(window.localStorage.getItem('brainstorm.center.notes') || '{}')
    const notes = []
    for (const key in storedNotes) {
      const storedNote = storedNotes[key];
      const note = new Note(storedNote.title, storedNote.content, storedNote.uuid, Immutable.Set<Mention>(storedNote.userMentions), storedNote.createdAt);
      notes.push(note)
      // drawDot(note, false);
    }
    // notes.forEach(note => drawDot(note));
  }
}

export default new Notebook(Immutable.Map<string, Note>());