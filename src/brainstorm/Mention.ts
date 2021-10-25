import Note from 'brainstorm/Note';

/**
 * Mention.
 * @class
 */
class Mention {

  public from: Note;
  public to: Note;
  public key: string;

  constructor (from: Note, to: Note, key: string) {
    this.from = from;
    this.to = to;
    this.key = key;
  }
}

export default Mention;