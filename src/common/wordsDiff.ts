import Immutable from 'immutable';
import Words from 'types/Words';

/**
 *
 */
export default function wordsDiff(a: Immutable.Set<string>, b: Immutable.Set<string>): Words {
  return {
    gone: a.subtract(b),
    new: b.subtract(a)
  }
}
