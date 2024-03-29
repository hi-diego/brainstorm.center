import Directory from './Directory';
import Mention from './Mention';
import Notebook from './Notebook';
import NotebookItem from './NotebookItem';
import Immutable from 'immutable';
// import { drawLines } from 'three/index';

/**
 * Note class is the holder of Mentions.
 * @class
 */
class Note extends NotebookItem {

  public title: string;
  public _content: string = '';
  public prevContent: string = '';
  public updateNotebook: boolean = true;
  public userMentions: Immutable.Set<Mention>;

  constructor (title: string, content: string, uuid?: string, userMentions?: Immutable.Set<Mention>, updateNotebook: boolean = true) {
    super(uuid);
    this.userMentions = userMentions || Immutable.Set<Mention>();
    this.content = content;
    this.title = title;
    this.updateNotebook = updateNotebook;
  }

  public get content(): string {
    return this._content;
  }

  public set content(content: string) {
    this.prevContent = this._content;
    this._content = content;
    // TODO: make this automatic Notebook update Optional 
    if (this.updateNotebook && this.title && this.title.length > 0) Notebook.update(this);
  }

  public update(newTitle?: string|null, newContent?: string|null, remoteUpdate: boolean = true): Note {
    if (newTitle === '') {
      Notebook.remove(this);
      this.title = '';
      Notebook.onUpdate(this, Notebook.notes, Directory);
      return this;
    }
    var oldTitle = this.title;
    this.title = newTitle ?? this.title;
    this.content = newContent ?? this.content;
    if (!this.updateNotebook) return this;
    var toRemove = oldTitle !== newTitle ? oldTitle : null;
    Notebook.update(this, remoteUpdate, true, toRemove);
    return this;
  }

  /**
   * Return all the words in the content.
   */
  public words (prev: boolean = false) : Immutable.Set<string> {
    var words = (prev ? this.prevContent : this.content).split(' ').filter(s => !!s);
    return Immutable.Set<string>(words);
  }

  /**
   * Return all the words in the content.
   */
  public clone () : Note {
    return new Note(this.title, this.content, this.uuid, Immutable.Set(this.userMentions));
  }

  /**
   * Return all the title notes that this note mentions in its content.
   */
  public mentions () : Immutable.Set<Mention> {
    return Notebook.notes
      .filter((v, k) => this.words().has(k))
      .toSet()
      .map(n => new Mention(this, n, n.title))
      .concat(this.userMentions)
  }

  /**
   * Return all the notes that reference this note by the title.
   */
  public references () : Immutable.Set<Note|undefined> {
    const ref = Directory.dir.get(this.title, Immutable.Set<string>()).map(title => Notebook.notes.get(title));
    return ref;
  }

  /**
   * Return all the notes that reference this note by the title.
   */
   public refs () : Immutable.Set<Mention> {
    const ref = Directory.dir.get(this.title, Immutable.Set<string>()).map(title => new Mention(Notebook.notes.get(title) || this, this, title));
    return ref;
  }
}

export default Note;
