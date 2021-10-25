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

  update(note: Note, newContent: string) {
    const words = wordsDiff(note.words(), Immutable.Set<string>(newContent.split(' ')));
    words.gone.forEach(word => {
      const set = (this.dir.get(word, Immutable.Set<string>())).delete(note.uuid)
      if (set.isEmpty()) this.dir = this.dir.delete(word);
      else this.dir = this.dir.set(word, set);
    })
    words._new.forEach(word => {
      const set = (this.dir.get(word, Immutable.Set<string>())).add(note.uuid)
      this.dir = this.dir.set(word, set);
    })
  }
}

export default new Directory();
