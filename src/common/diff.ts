
/**
 *
 */
export default function diff(a: Note, b: Note): Words {
  return wordsDiff(a.words(), b.words())
}