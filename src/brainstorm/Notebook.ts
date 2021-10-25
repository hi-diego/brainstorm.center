import Note from 'brainstorm/Note';
import Immutable from 'immutable';
import Words from 'types/Words';

/**
 * Notebook.
 * @class
 */
class Notebook {

  public notes: Immutable.Map<string, Note>;
  public onNoteAdded: (notes: Immutable.Set<Note>) => void;

  constructor (notes: Immutable.Map<string, Note>) {
    this.notes = notes;
    this.onNoteAdded = () => null;
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  update(note: Note) {
    this.notes = this.notes.set(note.title, note)
    this.onNoteAdded(this.notes.toSet())
  }
}

export default new Notebook(Immutable.Map<string, Note>());