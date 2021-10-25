import Note from 'brainstorm/Note';
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
    this.onUpdate = () => null;
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  update(note: Note) {
    this.notes = this.notes.set(note.title, note)
    this.onUpdate(this.notes.toSet())
  }
}

export default new Notebook(Immutable.Map<string, Note>());