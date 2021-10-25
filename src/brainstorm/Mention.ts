/**
 * Mention.
 * @class
 */
class Mention {

  public from: string;
  public to: string;
  public key: string;

  constructor (from: string, to: string, key: string) {
    this.from = from;
    this.to = to;
    this.key = key;
  }
}

export default Mention;
