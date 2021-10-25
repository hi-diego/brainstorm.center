import Note from 'brainstorm/Note';
import Notebook from 'brainstorm/Notebook';
import Directory from 'brainstorm/Directory';

const Handler = {
  construct(target, args) {
    const note = new target(...args);
    Directory.update(new Note(note.title, '', note.uuid), note.content);
    Notebook.update(note);
    return note;
  },
  set(target: any, prop: any, value: any, receiver: any) {
    if (prop === 'content') {
      Directory.update(target, value);
      Notebook.update(target);
      target[prop] = value;
    }
    return true;
  }
}

export default new Proxy(Note, Handler);

// const note = new proxyNote('First', 'content');
// const note2 = new proxyNote('Second', 'First');
// note.content = 'new better'
// note.content = 'foo bar baz'
// console.log(Notebook, Directory)