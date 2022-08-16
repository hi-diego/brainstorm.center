// import { drawDot } from "three/index";
import Note from './Note';
import Mention from './Mention';
import Directory from './Directory';
import { Directory as DirectoryClass } from './Directory';
import Immutable from 'immutable';
import http, { updateNotebook } from '../http/http';

/**
 * Notebook.
 * @class
 */
class Notebook {
  public FormStateMachine: any;
  public send: any;
  //
  public name: string;
  public timer: any;
  //
  public notes: Immutable.Map<string, Note>;
  //
  public onUpdate: (note: Note, notes: Immutable.Map<string, Note>, directory: DirectoryClass) => void;
  public onAdded: (note: Note, notes: Immutable.Map<string, Note>, directory: DirectoryClass) => void;
  public onEdited: (note: Note, notes: Immutable.Map<string, Note>, directory: DirectoryClass) => void;
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
  public update(note: Note, remoteUpdate: boolean = true, onEdited: boolean = true, toRemove: string|null = null) {
    if (toRemove) this.remove(toRemove);
    this.notes = this.notes.set(note.title, note);
    Directory.update(note);
    if (remoteUpdate) {
      window.clearTimeout(this.timer);
      this.timer = window.setTimeout(updateNotebook, 1500);
    }
    if (onEdited) this.onEdited(note, this.notes, Directory);
    this.onUpdate(note, this.notes, Directory);
  }

    /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  public add(note: Note, remoteUpdate: boolean = true) {
    this.update(note, remoteUpdate, false);
    this.onAdded(note, this.notes, Directory);
  }

    /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  public remove(note: Note|string): Note|string {
    this.notes = this.notes.delete(note instanceof Note ? note.title : note);
    return note;
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
      const note = new Note(n.title, n._content, n.uuid, Immutable.Set<Mention>(n.userMentions));
      this.add(note, false);
    }
    if (this.afterLoad) this.afterLoad(this.notes, Directory);
  }


  /**
   * Load data from the local storage to the noptebook instance:
   *
   */
  public parse(notenookData: any) {
    return JSON.parse(notenookData);
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
const NotebookClass = Notebook;

export { Notebook, NotebookClass };