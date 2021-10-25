import Note from 'brainstorm/Note';
import Immutable from 'immutable';

type Words = {
  gone: Immutable.Set<string>;
  _new: Immutable.Set<string>;
};

/**
 * Notebook.
 * @class
 */
class Notebook {

  public notes: Immutable.Map<string, Note>;

  constructor (notes: Immutable.Map<string, Note>) {
    this.notes = notes;
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  update(note: Note) {
    this.notes = this.notes.set(note.uuid, note) 
  }
}

export default new Notebook(Immutable.Map<string, Note>());