import Mention from 'brainstorm/Mention';
import Directory from 'brainstorm/Directory';
import uuid from 'common/uuid';
import Immutable from 'immutable';

/**
 * Note class is the holder of Mentions.
 * @class
 */
class Note {

  public title: string;
  public uuid: string;
  public content: string;
  public mentions: Array<Mention>;
  public created_at: Date;
  public modified_at: Date | null;

  constructor (title: string, content: string, _uuid: string | null = null, mentions: Array<Mention> = [], created_at: Date | null = null, modified_at: Date | null = null) {
    this.uuid = _uuid || uuid();
    this.title = title;
    this.content = content;
    this.mentions = mentions
    this.created_at = created_at || (new Date());
    this.modified_at = modified_at;
  }

  /**
   * Return all the words in the content.
   */
  public words () : Immutable.Set<string> {
    return Immutable.Set(this.content.split(' '))
  }

  /**
   * Return all the title notes that this note mentions in its content.
   */
  public mentions () : Immutable.Set<string> {
    return Immutable.Set(this.content.split(' '))
  }

  /**
   * Return all the notes that reference this note by the title.
   */
  public references () : Immutable.Set<string> {
    return Directory.dir.get(this.title)
  }
}

export default Note;