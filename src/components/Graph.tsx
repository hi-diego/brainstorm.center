import { useEffect, useState } from 'react';
import Notebook from 'brainstorm/Notebook';
import Note from 'brainstorm/Note';
import * as ThreeScene from 'three/index';
import Form from './Form'
import Tooltip from './Tooltip'

/*
* The entire three.js graph view and the html form controls.
*/
interface GraphProps {
  notebook: string
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
    <h1>{props.notebook}</h1>
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
    <Form notebook={props.notebook} onCreate={ note => setTooltips(tooltips.concat(note)) }/>
  </header>;
}
