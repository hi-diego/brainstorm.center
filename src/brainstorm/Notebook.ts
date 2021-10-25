import Mention from 'brainstorm/Mention';
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
  public directory: Immutable.Map<string, Set<string>>;

  constructor (notes: Immutable.Map<string, Note>, directory: Immutable.Map<string, Set<string>>) {
    this.notes = notes;
    this.directory = directory;
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  add(noteToAdd: Note) {
    const oldNote: Note = this.notes.get(noteToAdd.uuid, new Note("", "", noteToAdd.uuid))
    const words: Words = Notebook.wordsDiff(oldNote, noteToAdd)
    // val note = Notebook.setMentions(noteToAdd, gone, _new, notes)
    // val currentNotes = notes + (note.uuid -> note)
    // val dir = Notebook.updateDirectory(note, gone, _new, directory)
    // val refs = Notebook.refs(dir, note, currentNotes)
    // return new Notebook([], []) 
  }

  /**
   *
   */
  static wordsDiff(oldNote: Note, note: Note): Words {
    const oldWords = oldNote.words()
    const words = note.words()
    return {
      gone: oldWords.subtract(words),
      _new: words.subtract(oldWords)
    }
  }
}

export default Notebook;