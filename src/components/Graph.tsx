import { useEffect, useState } from 'react';
import Notebook from 'brainstorm/Notebook';
import { Directory } from 'brainstorm/Directory';
import Note from 'brainstorm/Note';
import * as ThreeScene from 'three/index';
import Tooltip from './Tooltip';
import Form from './Form';
import { useHistory } from 'react-router-dom';


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
type NotesSetter = React.Dispatch<React.SetStateAction<Note[]>>;

/*
* The entire three.js graph view and the html form controls.
*/
function initGraph (notebookName: string, setTooltips: NotesSetter) {
  console.log(notebookName);
  // Initialize the three canvas and scene.
  ThreeScene.init();
  var loaded = false;
  // var { gun, user } = Auth();
  // Recalculate mentions and reDraw Mentions on each new Note.
  Notebook.onUpdate = (note: Note, notes: Immutable.Map<string, Note>, directory: Directory, oldTitle?: string) => {
    // console.log(note);
    ThreeScene.drawNode(note, loaded);
    setTooltips(notes.valueSeq().toArray());
    // user.get('notes').put(JSON.stringify(notes));
  };
  Notebook.afterLoad = (notes: Immutable.Map<string, Note>, directory: Directory) => {
    loaded = true;
    notes.valueSeq().forEach((note: Note) => {
      ThreeScene.drawConections(note);
    });
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
  const tooltips = Notebook.notes.valueSeq().toArray();
  setTooltips(tooltips);
  // Notebook.nodes.forEach(node => drawLines(node.props.note, node.mesh));
}

const styles: { [key: string]: React.CSSProperties } = {
  AppHeader: {
    minHeight: window.innerHeight,
  }
};

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
  // On Url change update the scene
  const history = useHistory();
  useEffect(() => {
    return history.listen((location) => {
      ThreeScene.clear();
      setSelected(null);
      Notebook.reload(location.pathname);
      initGraph(location.pathname, setTooltips);
    });
 },[history]);
  // on select select a note from the repo 
  // useEffect(() => { ThreeScene.highlight(null); ThreeScene.highlight(selected); }, [selected]);
  // Call initGraph once.
  useEffect(() => { ThreeScene.highlight(null); ThreeScene.highlight(Notebook.notes.get(selected || '')?.uuid); }, [selected]);
  const canvas = document.getElementById('three-canvas');
  if (canvas) canvas.onclick = () => setSelected(null);
  // Render the form and controls.
  return <header onClick={ () => setSelected(null) } className="App-header" style={ styles.AppHeader }>
    { 
      tooltips.map(n => n.title !== '' ?
        <Tooltip
          selected={ selected === n.title }
          onSelect={ t => setSelected(t) }
          key={ n.title }
          note={ n }
        /> : null
      ) 
    }
    <Form onCreate={ (note: Note) => setSelected(note.title) } notebook={selected || props.notebook} showGo={ selected !== null }/>
  </header>;
}
