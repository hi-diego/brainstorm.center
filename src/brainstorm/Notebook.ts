// import { drawDot } from "three/index";
import Note from 'brainstorm/Note';
import Mention from 'brainstorm/Mention';
import Directory from 'brainstorm/Directory';
import { Directory as DirectoryClass } from 'brainstorm/Directory';
import Immutable from 'immutable';
import http, { updateNotebook } from 'http/http';

/**
 * Notebook.
 * @class
 */
class Notebook {
  //
  public name: string;
  public timer: any;
  //
  public notes: Immutable.Map<string, Note>;
  //
  public onUpdate: (note: Note, notes: Immutable.Map<string, Note>, directory: DirectoryClass, oldTitle?: string) => void;
  public onAdded: (note: Note, notes: Immutable.Map<string, Note>, directory: DirectoryClass, oldTitle?: string) => void;
  public onEdited: (note: Note, notes: Immutable.Map<string, Note>, directory: DirectoryClass, oldTitle?: string) => void;
  //
  public afterLoad: (notes: Immutable.Map<string, Note>, directory: DirectoryClass) => void;
  //
  constructor (notes: Immutable.Map<string, Note>) {
    this.notes = notes;
    this.name = 'root';
    // for testing
    // this.notes = Immutable.Map<string, Note>([ new Note('foo', 'bar'), new Note('bar', 'goo') ]);
    this.onUpdate = () => null;
    this.onAdded = () => null;
    this.onEdited = () => null;
    this.afterLoad = () => null;
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  public update(note: Note, oldTitle?: string) {
    if (oldTitle) this.notes = this.notes = this.notes.delete(oldTitle);
    Directory.update(note);
    this.notes = this.notes.set(note.title, note);
    // window.localStorage.setItem(this.getLocalStorageName(), JSON.stringify(this.notes.toJSON()));
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(updateNotebook, 1500);
    if (oldTitle) this.onEdited(note, this.notes, Directory, oldTitle);
    else this.onAdded(note, this.notes, Directory, oldTitle);
    this.onUpdate(note, this.notes, Directory, oldTitle);
  }

    /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  public remove(note: Note) {
    this.notes = this.notes.delete(note.title);
    // Directory.remove(note);
    window.localStorage.setItem(this.getLocalStorageName(), JSON.stringify(this.notes.toJSON()));
  }

  public stringContent (): string {
    return JSON.stringify(this.notes.toJSON());
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

  public static URI (): string {
    var uri = `${window.location.host}/${window.location.pathname}`;
    uri = uri.endsWith('/') ? uri.substring(0, uri.length - 1) : uri;
    return uri;
  }

  public getUri (): string {
    return Notebook.URI();
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
  public loadFrom(notes: any) {
    for (const title in notes) {
      const n = notes[title];
      const note = new Note(n.title, n._content, n.uuid, Immutable.Set<Mention>(n.userMentions), n.createdAt);
    }
    if (this.afterLoad) this.afterLoad(this.notes, Directory);
  }

  /**
   * Load data from the local storage to the noptebook instance:
   *
   */
  public load () {
    this.name = this.getUri();
    var notes = {}
    var uri = this.getUri();
  }

  /**
   * Load data from the local storage to the noptebook instance:
   *
   */
  public reload(notebookName: string = 'root') {
    Directory.clear();
    this.name = notebookName;
    this.notes = Immutable.Map<string, Note>();
    this.load();
  }
}

export default new Notebook(Immutable.Map<string, Note>());


export { Notebook };