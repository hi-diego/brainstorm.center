import Note from './Note';
import NotebookItem from './NotebookItem';

/**
 * Mention.
 * @class
 */
class Mention extends NotebookItem {

  public from: Note;
  public to: Note;
  public key: string;

  constructor (from: Note, to: Note, key: string, uuid?: string) {
    super(uuid);
    this.from = from;
    this.to = to;
    this.key = key;
  }
}

export default Mention;