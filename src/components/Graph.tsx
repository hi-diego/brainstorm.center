import { useEffect, useState } from 'react';
import Notebook from 'brainstorm/Notebook';
import Note from 'brainstorm/Note';
import * as ThreeScene from 'three/index';
import * as Three from 'three/index';
import Tooltip from './Tooltip';
import Form from './Form';


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
type Setter = React.Dispatch<React.SetStateAction<Note[]>>;

/*
* The entire three.js graph view and the html form controls.
*/
function initGraph (notebookName: string, setTooltips: Setter) {
  // Initialize the three canvas and scene.
  ThreeScene.init();
  // Load the notebook from local storage.
  Notebook.load(notebookName);
  // Draw dots for each node
  const tooltips = Notebook.notes.toSet().toArray();
  setTooltips(tooltips);
  // Notebook.nodes.forEach(node => drawLines(node.props.note, node.mesh));
}

/*
* The entire three.js graph view and the html form controls.
*/
export default function Graph (props: GraphProps) {
  // Initialize title reactive value.
  const [tooltips, setTooltips] = useState<Note[]>([]);
  // Initialize selected values.
  const [selected, setSelected] = useState<string|null>(null);
  // Call initGraph once.
  useEffect(() => initGraph(props.notebook, setTooltips), []);
  // Render the form and controls.
  return <header className="App-header">
    { 
      tooltips.map(n =>
        <Tooltip
          selected={ selected === n.title }
          onSelect={ t => setSelected(t) }
          key={ n.title }
          note={ n }
        />
      )
    }
    <Form notebook={selected || props.notebook} onCreate={ note => setTooltips(tooltips.concat(note)) }/>
  </header>;
}
