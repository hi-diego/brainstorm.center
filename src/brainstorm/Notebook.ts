// import { drawDot } from "three/index";
import Note from 'brainstorm/Note';
import Mention from 'brainstorm/Mention';
import Directory from 'brainstorm/Directory';
import { Directory as DirectoryClass } from 'brainstorm/Directory';
import Immutable from 'immutable';

/**
 * Notebook.
 * @class
 */
class Notebook {
  //
  public name: string;
  //
  public notes: Immutable.Map<string, Note>;
  //
  public onUpdate: (note: Note, notes: Immutable.Map<string, Note>, directory: DirectoryClass) => void;
  //
  public afterLoad: (notes: Immutable.Map<string, Note>, directory: DirectoryClass) => void;
  //
  constructor (notes: Immutable.Map<string, Note>) {
    this.notes = notes;
    this.name = 'root';
    // for testing
    // this.notes = Immutable.Map<string, Note>([ new Note('foo', 'bar'), new Note('bar', 'goo') ]);
    this.onUpdate = () => null;
    this.afterLoad = () => null;
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  public update(note: Note) {
    Directory.update(note);
    this.notes = this.notes.set(note.title, note);
    window.localStorage.setItem(this.getLocalStorageName(), JSON.stringify(this.notes.toJSON()));
    this.onUpdate(note, this.notes, Directory);
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  public getLocalStorageName(): string {
    const path = window.location.pathname && window.location.pathname !== '/'
      ? (window.location.pathname + '/')
      : '';
    return `brainstorm.center/${path}`;
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  // public Note(title: string, content: string, uuid?: string) {

  // }

  /**
   * Load data from the local storage to the noptebook instance:
   *
   */
  public load(notebookName: string = 'root') {
    this.name = notebookName;
    const notes = JSON.parse(window.localStorage.getItem(this.getLocalStorageName()) || '{}')
    for (const title in notes) {
      const n = notes[title];
      const note = new Note(n.title, n._content, n.uuid, Immutable.Set<Mention>(n.userMentions), n.createdAt);
      // console.log('Notebook.load', note);
    }
    if (this.afterLoad) this.afterLoad(this.notes, Directory);
  }

  /**
   * Load data from the local storage to the noptebook instance:
   *
   */
  public reload(notebookName: string = 'root') {
    Directory.clear();
    this.name = notebookName;
    this.notes = Immutable.Map<string, Note>();
    this.load(notebookName);
  }
}


export default new Notebook(Immutable.Map<string, Note>());