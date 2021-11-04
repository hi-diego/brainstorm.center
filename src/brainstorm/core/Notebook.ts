import Immutable from 'immutable';
import Note from 'brainstorm/Note';
import Mention from 'brainstorm/Mention';
import Directory from 'brainstorm/Directory';
import wordsDiff from 'common/wordsDiff';

/**
 * Notebook.
 * @class
 */
class Notebook {

  /**
   * Notebook.
   * @member
   */
  public name: string;

  /**
   * Notebook.
   * @member
   */
  public notes: Immutable.Map<string, Note>;

  /**
   * Notebook.
   * @member
   */
  public directory: Immutable.Map<string, Immutable.Set<string>>;

  /**
   * Notebook.
   * @member
   */
  public onUpdate: (notes: Immutable.Set<Note>) => void;


  /**
   * Notebook.
   * @constructor
   */
  constructor (notes: Immutable.Map<string, Note>, directory: Immutable.Map<string, Immutable.Set<string>>) {
    this.notes = notes;
    this.name = 'root';
    this.onUpdate = () => null;
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  public update(note: Note): Notebook {
    const directory = this.updateDictionary(note);
    const notes = this.notes.set(note.title, note);
    window.localStorage.setItem(this.getLocalStorageName(), JSON.stringify(this.notes.toJSON()));
    return new Notebook(notes, directory);
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
  public updateDictionary(note: Note): Immutable.Map<string, Immutable.Set<string>> {
    const words = wordsDiff(note.words(true), note.words());
    words.gone.forEach((word: string) => {
      const set = (this.directory.get(word, Immutable.Set<string>())).delete(note.title)
      if (set.isEmpty()) this.directory = this.directory.delete(word);
      else this.directory = this.directory.set(word, set);
    })
    words.new.forEach((word: string) => {
      const set = (this.directory.get(word, Immutable.Set<string>())).add(note.title)
      this.directory = this.directory.set(word, set);
    })
    return this.directory;
  }

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
    }
  }

  /**
   * Load data from the local storage to the noptebook instance:
   *
   */
  public reload(notebookName: string = 'root') {
    this.name = notebookName;
    this.directory = Immutable.Map<string, Immutable.Set<string>>();
    this.notes = Immutable.Map<string, Note>();
    this.load(notebookName);
  }

    /**
   * Return all the title notes that this note mentions in its content.
   */
  public mentions(note: Note) : Immutable.Set<Mention> {
    return this.notes
      .filter((v, k) => note.words().has(k))
      .toSet()
      .map(n => new Mention(note, n, n.title))
      .concat(note.mentions);
  }

  /**
   * Return all the notes that reference this note by the title.
   */
  public references (note: Note) : Immutable.Set<Note|undefined> {
    return this.directory.get(note.title, Immutable.Set<string>()).map(title => this.notes.get(title))
  }
}


export default Notebook;