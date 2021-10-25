/**
 *
 */
export default function wordsDiff(a: Immutable.Set<string>, b: Immutable.Set<string>): Words {
  return {
    gone: a.subtract(b),
    _new: b.subtract(a)
  }
}
