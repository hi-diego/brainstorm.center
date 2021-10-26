import Note from 'brainstorm/Note';

/**
 * Mention.
 * @class
 */
class Mention {

  public from: Note;
  public to: Note;
  public key: string;
  public createdByUser: boolean;

  constructor (from: Note, to: Note, key: string, createdByUser: boolean = false) {
    this.from = from;
    this.to = to;
    this.key = key;
    this.createdByUser = createdByUser;
  }
}

export default Mention;