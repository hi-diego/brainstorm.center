import { useEffect, useState } from 'react';
import Notebook from 'brainstorm/Notebook';
import { Directory } from 'brainstorm/Directory';
import Note from 'brainstorm/Note';
import * as ThreeScene from 'three/index';
import Tooltip from './Tooltip';
import Form from './Form';
import { useHistory } from 'react-router-dom';
import http, { fetchNotebook, RemoteNotebook } from 'http/http';

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

/*
* The entire three.js graph view and the html form controls.
*/
type NotesSetter = React.Dispatch<React.SetStateAction<Note[]>>;


/*
* The entire three.js graph view and the html form controls.
*/
type RemoteNotebookSetter = React.Dispatch<React.SetStateAction<RemoteNotebook|null>>;


/*
* The entire three.js graph view and the html form controls.
*/
function initGraph (notebookName: string, setTooltips: NotesSetter, setRemoteNotebook: RemoteNotebookSetter) {
  // console.log(notebookName);
  // Initialize the three canvas and scene.
  ThreeScene.init();
  var loaded = false;
  // Recalculate mentions and reDraw Mentions on each new Note.
  Notebook.onUpdate = (note: Note, notes: Immutable.Map<string, Note>, directory: Directory) => {
    console.log('Notebook.onUpdate');
    ThreeScene.drawNode(note, loaded);
    setTooltips(notes.valueSeq().toArray());
  };
  Notebook.afterLoad = (notes: Immutable.Map<string, Note>, directory: Directory) => {
    loaded = true;
    notes.valueSeq().forEach((note: Note) => {
      ThreeScene.drawConections(note);
    });
  };
  // Load the notebook from remote source.
  fetchNotebook().then((remoteNotebook: RemoteNotebook) => {
    setRemoteNotebook(remoteNotebook);
    Notebook.loadFrom(JSON.parse(remoteNotebook.content));
  });
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
  const [remoteNotebook, setRemoteNotebook] = useState<RemoteNotebook|null>(null);
  // Initialize title reactive value.
  const [tooltips, setTooltips] = useState<Note[]>([]);
  // Initialize selected values.
  const [selected, setSelected] = useState<Note|null>(null);
  // Call initGraph once.
  useEffect(() => initGraph(props.notebook, setTooltips, setRemoteNotebook), []);
  // On Url change update the scene
  const history = useHistory();
  useEffect(() => {
    return history.listen((location) => {
      ThreeScene.clear();
      setSelected(null);
      Notebook.reload(location.pathname);
      initGraph(location.pathname, setTooltips, setRemoteNotebook);
    });
 },[history]);
  // on select select a note from the repo 
  // useEffect(() => { ThreeScene.highlight(null); ThreeScene.highlight(selected); }, [selected]);
  // Call initGraph once.
  useEffect(() => { ThreeScene.highlight(null); ThreeScene.highlight(selected?.uuid); }, [selected]);
  const canvas = document.getElementById('three-canvas');
  if (canvas) canvas.onclick = () => setSelected(null);
  // Render the form and controls.
  return <header onClick={ () => setSelected(null) } className="App-header" style={ styles.AppHeader }>
    { 
      tooltips.map(n => n.title !== '' ?
        <Tooltip
          selected={ selected?.title === n.title }
          onSelect={ s => setSelected(s) }
          key={ n.title }
          note={ n }
        /> : null
      ) 
    }
    <Form
      note={ selected }
      onCreate={ (note: Note) => setSelected(note) }
      notebook={ selected?.title || props.notebook }
      showGo={ selected !== null }
    />
  </header>;
}
