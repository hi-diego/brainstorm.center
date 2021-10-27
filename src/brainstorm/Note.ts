import Directory from 'brainstorm/Directory';
import Mention from 'brainstorm/Mention';
import Notebook from 'brainstorm/Notebook';
import NotebookItem from 'brainstorm/NotebookItem';
import Immutable from 'immutable';

/**
 * Note class is the holder of Mentions.
 * @class
 */
class Note extends NotebookItem {

  public title: string;
  public _content: string;
  public userMentions: Immutable.Set<Mention>;

  constructor (title: string, content: string, uuid?: string, userMentions?: Immutable.Set<Mention>, createdAt?: Date, modifiedAt?: Date) {
    super(uuid, createdAt, modifiedAt);
    this.userMentions = userMentions || Immutable.Set<Mention>();
    this.title = title;
    this._content = '';
    this.content = content;
    // todo modify Directory.update to not do this next trick.
    Directory.update(new Note(this.title, '', this.uuid), note.content);
    Notebook.update(this);
  }

  public get content(content: string): string {
    return this._content;
  }

  public set content(content: string) {
    Directory.update(this, content);
    this._content = content;
    Notebook.update(this);
  }


  /**
   * Return all the words in the content.
   */
  public words () : Immutable.Set<string> {
    return Immutable.Set(this.content.split(' '))
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
    return Directory.dir.get(this.title, Immutable.Set<string>()).map(title => Notebook.notes.get(title))
  }
}

export default Note;