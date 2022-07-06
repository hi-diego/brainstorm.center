import Directory from 'brainstorm/Directory';
import Mention from 'brainstorm/Mention';
import Notebook from 'brainstorm/Notebook';
import NotebookItem from 'brainstorm/NotebookItem';
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

  constructor (title: string, content: string, uuid?: string, userMentions?: Immutable.Set<Mention>, createdAt?: Date, modifiedAt?: Date, updateNotebook: boolean = true) {
    super(uuid, createdAt, modifiedAt);
    this.userMentions = userMentions || Immutable.Set<Mention>();
    this.title = title;
    this.content = content;
    this.updateNotebook = updateNotebook;
  }

  public get content(): string {
    return this._content;
  }

  public set content(content: string) {
    this.prevContent = this._content;
    this._content = content;
    // TODO: make this automatic Notebook update Optional 
    if (this.updateNotebook) Notebook.update(this);
  }

  public update(title?: string|null, content?: string|null): Note {
    if (title) this.title = title;
    if (content) this.content = content;
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
    return new Note(this.title, this.content, this.uuid, Immutable.Set(this.userMentions), new Date(this.createdAt), new Date(this.modifiedAt));
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
}

export default Note;
