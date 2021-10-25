import Note from 'brainstorm/Note';
import Words from 'types/Words';
import wordsDiff from 'common/wordsDiff';

/**
 *
 */
export default function diff(a: Note, b: Note): Words {
  return wordsDiff(a.words(), b.words())
}