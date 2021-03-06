/**
 * Generate a new random uuid
 */
export default function uuid () : string {
  var date = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    // eslint-disable-next-line
    var random = (date + Math.random() * 16) % 16 | 0
    date = Math.floor(date / 16)
    // eslint-disable-next-line
    return (c === 'x' ? random : (random & 0x3 | 0x8)).toString(16)
  })
  return uuid
}
