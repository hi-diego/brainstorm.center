import { useEffect, useState } from 'react';
import Notebook from 'brainstorm/Notebook';
import { Directory } from 'brainstorm/Directory';
import Note from 'brainstorm/Note';
import * as ThreeScene from 'three/index';
import * as Three from 'three/index';
import Tooltip from './Tooltip';
import Form from './Form';
import createNode from 'three/createNode';


/*
 If title change: must repaint all nodes that mentions old title
 If content change: must repaint current node and mentions
*/

/*
* The entire three.js graph view and the html form controls.
*/
interface GraphProps {
  notebook: string
}

/*
* The entire three.js graph view and the html form controls.
*/
interface Node {
  note: Note,
  mesh: any
}

// public getNodes(): JSX.Element[] {
//   this.nodes = Notebook.notes.toSet().map((note: Note) => (
//     <Node
//       key={ note.uuid }
//       note={ note }
//       drawLines={ this.state.componentDidMount }
//       selected={ note === this.state.note }
//       onSelect={ event => this.select.bind(this)(note, event) }
//     />
//   )).toArray();
//   return this.nodes;
// }

/*
* The entire three.js graph view and the html form controls.
*/
type Setter = React.Dispatch<React.SetStateAction<string[]>>;

/*
* The entire three.js graph view and the html form controls.
*/
function initGraph (notebookName: string, setTooltips: Setter) {
  // Initialize the three canvas and scene.
  ThreeScene.init();
  // Recalculate mentions and reDraw Mentions on each new Note.
  Notebook.onUpdate = (note: Note, notes: Immutable.Map<string, Note>, directory: Directory) => {
    console.log(note, notes.toArray());
    setTooltips(notes.keySeq().toArray());
    createNode(note);
  };
  // // Recalculate mentions and reDraw Mentions on each new Note.
  // Notebook.onNoteUpdateContent = (note: Note, notes: Immutable.Set<Note>, directory: Directory) => {
  //   console.log(note);
  // };
  // // Recalculate mentions and reDraw Mentions on each new Note.
  // Notebook.onNoteUpdateTitle = (note: Note, notes: Immutable.Set<Note>, directory: Directory) => {
  //   console.log(note);
  // };
  // Load the notebook from local storage.
  Notebook.load(notebookName);
  // Draw dots for each node
  const tooltips = Notebook.notes.keySeq().toArray();
  setTooltips(tooltips);
  // Notebook.nodes.forEach(node => drawLines(node.props.note, node.mesh));
}

/*
* The entire three.js graph view and the html form controls.
*/
export default function Graph (props: GraphProps) {
  // Initialize title reactive value.
  const [tooltips, setTooltips] = useState<string[]>([]);
  // Initialize selected values.
  const [selected, setSelected] = useState<string|null>(null);
  // Call initGraph once.
  useEffect(() => initGraph(props.notebook, setTooltips), []);
  // Render the form and controls.
  return <header className="App-header">
    { 
      tooltips.map(n =>
        <Tooltip
          selected={ selected === n }
          onSelect={ t => setSelected(t) }
          key={ n }
          note={ n }
        />
      )
    }
    <Form notebook={selected || props.notebook}/>
  </header>;
}
