/**
 * Mention.
 * @class
 */
class Mention {

  public from: string;
  public to: string;
  public key?: string | null;

  constructor (from: string, to: string, key: string | null = null) {
    this.from = from;
    this.to = to;
    this.key = key;
  }
}

export default Mention;
