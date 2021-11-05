import { Notebook } from 'brainstorm-center-core/dist/singleton/Notebook';
import { NoteProxy as Note } from 'brainstorm-center-core/dist/singleton/Note';
import React, { useRef, useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import reportWebVitals from './reportWebVitals';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import geometries from 'three/geometries';
import random from './common/random';
import Roboto from "./Roboto_Regular.json"
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';



// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
extend({ OrbitControls });
extend({ TextGeometry })

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    // controls.minDistance = 3;
    // controls.maxDistance = 20;
    return () => { controls.dispose(); };
  }, [camera, gl]);
  return null;
};

function Text3d(props: any){
  const font = new FontLoader().parse(Roboto);
  const textOptions = {
    font,
    size: 0.5,
    height: 0.1
  };
  return (
    <mesh position={ props.position }>
      <textGeometry attach='geometry' args={[props.text, textOptions]} />
      <meshStandardMaterial attach='material' color="hotpink" />
    </mesh>
  )
}

function Node(props: any) {
  // This reference will give us direct access to the mesh
  const mesh = useRef<any>();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => (mesh.current.rotation.x += 0.01))
  // Return view, these are regular three.js elements expressed in JSX
  //
  return (
    <group>
      <Text3d position={ props.position } text={ props.note.title } />
      {/*{ lines }*/}
      <mesh
        {...props}
        ref={mesh}
        // args={ [geometries.node.default, active ? materials.mesh.selected : materials.mesh.default] }
        scale={active ? 1.5 : 1}
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}
      >
        <lineSegments args={ [ geometries.node.wireframe ] }/>
      </mesh>
    </group>
  )
}

function Graph() {
  const [hovered, setHover] = useState(false);
  // const [notebook, setNotebook] = useState(notebook);
  const nodes = Notebook.notes.toSet().toArray().map((note: any) => {
    note.data =  note.data || { position: [ random(-5, 5) , random(-5, 5), random(-5, 5) ] };
    return <Node note={ note } key={ note.uuid } position={ note.data.position }/>
  });
  return (
    <Canvas>
      {/*<color attach="background" args={"black"} />*/}
      <CameraController />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <primitive object={new THREE.AxesHelper(2)} />
      <group>
        { nodes }
      </group>
    </Canvas>
  );
}

function App() {
  const [hovered, setHover] = useState(false);
  const [note, setNote] = useState(null);
  const [placeholder, setPlaceholder] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // console.log(notebook);

  return (
    <div className="App App-header" id="app" style={{ width: "100vw", height: "100vh" }}>
      <form className="note-form" onSubmit={ event => { event.preventDefault(); setNote(new Note(title, content)) } }>
        <label className="placeholder">{ placeholder }</label>
        <input autoFocus placeholder="Title" onKeyDown={ event => console.log(event) } value={ title } onChange={ event => setTitle(event.target.value) } />
        <textarea placeholder="Content" onKeyDown={ event => console.log(event) } rows={ 10 } value={ content } onChange={ event => setContent(event.target.value) } ></textarea>
        <button>go</button>
        {/*<button onClick={ event => useCallback(() => history.push('/sample'), [history]) }>go</button>*/}
        {/*{ this.state.note &&  <Link to={ path + this.state.note.title }>GO</Link> }*/}
      </form>
      <Graph/>
    </div>
  );
}

ReactDOM.render(
  <div id="root" style={{ width: "100vw", height: "100vh" }}>
    <App/>
  </div>,
  document.getElementById('root')
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
