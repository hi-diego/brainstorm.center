import { useEffect, useState } from 'react';
import Notebook from 'brainstorm/Notebook';
import * as ThreeScene from 'three/index';
import Form from './Form'

/*
* The entire three.js graph view and the html form controls.
*/
interface GraphProps {
  notebook: string
}

/*
* The entire three.js graph view and the html form controls.
*/
function initGraph (notebookName: string) {
  // Initialize the three canvas and scene.
  ThreeScene.init();
  // Load the notebook from local storage.
  Notebook.load(notebookName);
}

/*
* The entire three.js graph view and the html form controls.
*/
export default function Graph (props: GraphProps) {
  // Call initGraph once.
  useEffect(() => initGraph(props.notebook), []);
  // Render the form and controls.
  return <header className="App-header">
    <h1>{props.notebook}</h1>
    <Form notebook={props.notebook}/>
  </header>;
}
