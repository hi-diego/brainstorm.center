import Note from './Note';
import Immutable from 'immutable';
import wordsDiff from '../common/wordsDiff';

/**
 * Mention.
 * @class
 */
export class Directory {

  public dir: Immutable.Map<string, Immutable.Set<string>>;

  constructor () {
    this.dir = Immutable.Map();
  }

  clear() {
    this.dir = Immutable.Map<string, Immutable.Set<string>>();
  }

  /*
  * Update the dictionary with the new note words
  * for each new word, we want to upsert a Key in the this.dir Map
  * and add the given note UUID as a set
  */
  update(note: Note) {
    // get the words diff , the new ones and the old ones
    const words = wordsDiff(note.words(true), note.words());
    // For all the words that are gone we should remove them from the Set
    words.gone.forEach((word: string) => this.removeWordNote(note, word));
    words._new.forEach((word: string) => {
      const set = (this.dir.get(word, Immutable.Set<string>())).add(note.title)
      this.dir = this.dir.set(word, set);
    })
  }

  /*
  * Remove the given note UUID from all of the words set in the dir
  */
  remove(note: Note) {
    // Get the words of the note
    const words = note.words();
    // For each word we update the dictionary and remove the ID from
    words.forEach((word: string) => this.removeWordNote(note, word));
  }

  /*
  * Remove the given note UUID from all of the words set in the dir
  */
  removeWordNote (note: Note, word: string) {
    // Get Set of example: ['foo': ['445YUH-3986G3-V3-GBG34-4', 'YUH32VQW-3986G3-V3-GBG34-4']]
    const set = this.dir.get(word, Immutable.Set<string>());
    // if this note have the uuid '445YUH-3986G3-V3-GBG34-4', we want to update the dctionary and remove the id
    const newSet = set.delete(note.title);
    // so we should get this.dir.get(word) ---> ['foo': ['YUH32VQW-3986G3-V3-GBG34-4']] and we assign it to the dir
    // If the set is empty meand that no  Notes mention that word so we remove it
    if (newSet.isEmpty()) this.dir = this.dir.delete(word);
    // we assign the new updated set
    else this.dir = this.dir.set(word, newSet);
  }
}

export default new Directory();
