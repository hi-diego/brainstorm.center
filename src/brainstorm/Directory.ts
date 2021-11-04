import { Map } from 'immutable';
import Note from 'brainstorm/Note';
import Immutable from 'immutable';
import wordsDiff from 'common/wordsDiff';

/**
 * Mention.
 * @class
 */
class Directory {

  public dir: Immutable.Map<string, Immutable.Set<string>>;

  constructor () {
    this.dir = Map();
  }

  clear() {
    this.dir = Immutable.Map<string, Immutable.Set<string>>();
  }

  update(note: Note) {
    const words = wordsDiff(note.words(true), note.words());
    words.gone.forEach((word: string) => {
      const set = (this.dir.get(word, Immutable.Set<string>())).delete(note.title)
      if (set.isEmpty()) this.dir = this.dir.delete(word);
      else this.dir = this.dir.set(word, set);
    })
    words.new.forEach((word: string) => {
      const set = (this.dir.get(word, Immutable.Set<string>())).add(note.title)
      this.dir = this.dir.set(word, set);
    })
  }
}

export default new Directory();
