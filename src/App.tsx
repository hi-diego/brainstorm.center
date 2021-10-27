import Graph from 'graph/Graph';
import Notebook from 'brainstorm/Notebook';
// import { useState } from 'react';
// import Node from 'graph/Node';
// import NoteType from 'brainstorm/Note';
// import Mention from 'brainstorm/Mention';
// import Immutable from 'immutable';
import { init } from "three/index";
import './App.css';

init();
Notebook.load();

function App() {
  return (
    <div className="App">
      <Graph/>
    </div>
  );  
}


// function App() {
//   // const [mentionKey, setMentionKey] = useState('');
//   // const [placeholder, setPlaceholder] = useState(null);
//   // const [title, setTitle] = useState('');
//   // const [content, setContent] = useState('');
//   // const [selecting, setSelecting] = useState(false);
//   // const [nodes, setNodes] = useState<Immutable.Map<string, Node>>(
//   //   Notebook.notes.mapEntries(([k, v]) => ([k, Node.fromNote(v)]))
//   // );
//   // // var index = 0;
//   // const labels: JSX.Element[] = nodes.map((node: Node) => <label
//   //     // tabIndex={index++}
//   //     // contentEditable={'true'}
//   //     className={ `node ${title === node.note.title ? 'selected' : ''}` }
//   //     onClick={() => selectNote(node.note.title)}
//   //     key={node.note.uuid}
//   //     id={node.note.title}
//   //   >
//   //     <input onFocus={() => selectNote(node.note.title)} className="none"/>
//   //     {node.note.title}
//   //   </label>
//   // ).toArray();
//   // const hub = <div className="hub"><p>Notes: {notes.size}</p></div>
//   // Notebook.onUpdate = (notes: Immutable.Set<NoteType>) => setNotes(notes)
//   // function createNexus(to: NoteType) {
//   //   const from = Notebook.notes.get(title);
//   //   if (!from) return setSelecting(false);
//   //   from.userMentions = from.userMentions.add(new Mention(from.clone(), to.clone(), mentionKey, true));
//   //   // Directory.update(from, from.content);
//   //   Notebook.update(from);
//   //   setTitle(to.title);
//   //   drawDot(from);
//   //   setSelecting(false);
//   // }
//   // function unselect() {
//   //   setTitle('');
//   //   setContent('');
//   //   highlight()
//   //   return setSelecting(false);
//   // }
//   function selectNote(_title: string) {
//     const node = nodes.get(_title);
//     if (!node) return;
//     node.highlight();
//     // highlight(_title);
//     setTitle(node.note.title);
//     setContent(node.note.content);
//     setPlaceholder(null);
//     // if (title === _title) {
//     //   if (selecting) return unselect();
//     //   return setSelecting(true);
//     // }
//     // if (selecting) return createNexus(note);
//   }
//   function saveNode(title: string, content: string, event: any = null) {
//     if (event) event.preventDefault();
//     const node = nodes.get(title, new Node(title, content));
//     setNodes(nodes.set(title, node));
//     // drawDot(note);
//     return node;
//   }
//   //
//   function onTitleChange(event: any) {
//     const newTitle = event.target.value;
//     // if (!newTitle && selected)
//     const newPlaceholder = searchNodes(newTitle)
//     setPlaceholder(newPlaceholder);
//     setTitle(newTitle);
//   }
//   function onKeyDownTitle(event: any) {
//     if (event.key === 'Tab' && placeholder) {
//       selectNote(placeholder)
//     }
//   }
//   function onKeyDownContent(event: any) {
//     if (event.key === 'Enter') {
//       saveNode(title, content, event)
//     }
//   }
//   function searchNodes(newTitle: string): Immutable.Map<string, Node> {
//     return newTitle && nodes.keySeq().filter((k: string) => k.startsWith(newTitle)).toArray()[0];
//   }
//   // const titleRef = React.createRef();
//   // if (titleRef.current) titleRef.current.focus();
//   return (

//     // <div className="App">
//     //   <header className="App-header">
//     //     {/*{hub}*/}
//     //     <form>{labels}</form>
//     //     {selecting
//     //       ? <form className="note-form">
//     //         <input placeholder="key" value={ mentionKey } onChange={ event => setMentionKey(event.target.value) }/>
//     //       </form>
//     //       : <form className="note-form" onSubmit={ event => saveNode(title, content, event) }>
//     //         <label className="placeholder">{placeholder}</label>
//     //         <input autoFocus value={ title } onKeyDown={onKeyDownTitle} placeholder="Title" onChange={ event => onTitleChange(event) }/>
//     //         <textarea  rows={10} onKeyDown={onKeyDownContent} placeholder="Content" value={ content } onChange={ event => setContent(event.target.value) }></textarea>
//     //         {/*<button type="submit">add</button>*/}
//     //       </form>
//     //     }
//     //   </header>
//     // </div>
//   );
// }

export default App;
