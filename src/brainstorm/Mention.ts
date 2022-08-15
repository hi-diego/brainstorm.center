import Note from 'brainstorm/Note';
import NotebookItem from 'brainstorm/NotebookItem';

/**
 * Mention.
 * @class
 */
class Mention extends NotebookItem {

  public from: Note;
  public to: Note;
  public key: string;
  public createdByUser: boolean;

  constructor (from: Note, to: Note, key: string, createdByUser: boolean = false, uuid?: string, createdAt?: Date, modifiedAt?: Date) {
    super(uuid, createdAt, modifiedAt);
    this.from = from;
    this.to = to;
    this.key = key;
    this.createdByUser = createdByUser;
  }
}

export default Mention;