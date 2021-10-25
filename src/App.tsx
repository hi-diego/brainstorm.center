import React from 'react';
import { useState } from 'react';
import Note from 'brainstorm/proxy/Note';
// import NoteType from 'brainstorm/Note';
import Notebook from 'brainstorm/Notebook';
import Directory from 'brainstorm/Directory';
import Immutable from 'immutable';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import './App.css';

function animate () {
  requestAnimationFrame(animate);
  controls.update();
  // this.state.brainStormNoteBook.notes.forEach((note, i) => {
  //     const temporalVector = new THREE.Vector3()
  //     // get the position of the center of the cube
  //     note.mesh.updateWorldMatrix(true, false)
  //     note.mesh.getWorldPosition(temporalVector)
  //     // get the normalized screen coordinate of that position
  //     // x and y will be in the -1 to +1 range with x = -1 being
  //     // on the left and y = -1 being on the bottom
  //     temporalVector.project(this.camera)

  //     // convert the normalized position to CSS coordinates
  //     const x = (temporalVector.x * 0.5 + 0.5) * this.renderer.domElement.clientWidth
  //     const y = (temporalVector.y * -0.7 + 0.5) * this.renderer.domElement.clientHeight
  //     //console.log(x, y)
  //     // move the elem to that position
  //     // console.log(this.$refs['node-label-' + i][0])
  //     var _label =  document.getElementById(note.uuid); // this._refs.get(note.uuid);
  //     // console.log(_label)
  //     if (_label) _label.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
  //   });
  renderer.render( scene, camera );
};
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const sphereGeometry = new THREE.SphereGeometry( 0.1, 32, 32 );
const meshMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.zoom = 1;
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls( camera, renderer.domElement );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
camera.position.z = 5;
animate();
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}, false);

function App() {
  // const [notes, setNotes] = useState(new Immutable.Map<string, Notes>())
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  var notesjsx: JSX.Element[] = [];
  Notebook.notes.forEach((note, key, map) => {
    notesjsx.push(
      <li key={key}>
        <h3>{note.title}</h3>  
        <p>{note.content}</p>
        <p><strong>mentions: {note.mentions().join(',')}</strong></p>
        {<p><strong>references: {note.references().join(',')}</strong></p>}
      </li>
    );
  });
  var dirjsx: JSX.Element[] = [];
  Directory.dir.forEach((value, key, map) => {
    dirjsx.push(
      <small>{key}, </small>
    );
  });
  function drawLines(note: any, _dot: any = null, ref = false) {
    const dot = _dot || scene.getObjectByName(note.title); 
    const groupName = `${note.title}-mentions`;
    const oldGroup = scene.getObjectByName(groupName);
    if (oldGroup) scene.remove(oldGroup);
    const group = new THREE.Group();
    group.name = groupName
    note.mentions().forEach((to: any) => {
      const toDot = scene.getObjectByName(to.title) 
      const points = [];
      points.push(dot.position);
      points.push(toDot.position);
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      line.name = `${note.title}-${to.title}`
      group.add(line);
    });
    scene.add(group);
    if (ref) note.references().forEach((from: any) => drawLines(from))
  }
  function drawDot(note: any) {
    const oldDot = scene.getObjectByName(note.title);
    if (oldDot) return drawLines(note, oldDot, true);
    const dot = new THREE.Mesh(sphereGeometry, meshMaterial);
    dot.translateX(Math.random() * 2);
    dot.translateY(Math.random() * 2);
    dot.translateZ(Math.random() * 2);
    dot.name = note.title;
    scene.add(dot);
    return drawLines(note, dot, true);
  }
  function newNote(title: string, content: string, event: any) {
    event.preventDefault()
    const note = new Note(title, content);
    drawDot(note);
    return note;
  }
  return (
    <div className="App">
      <header className="App-header">
        {<ol>{notesjsx}</ol>}
        {/*<p>{dirjsx}</p>*/}
        <form className="note-form" onSubmit={ event => newNote(title, content, event) }>
          <input placeholder="title" value={ title } onChange={ event => setTitle(event.target.value) }/>
          <textarea placeholder="content" value={ content } onChange={ event => setContent(event.target.value) }></textarea>
          <button type="submit">add</button>
        </form>
      </header>
    </div>
  );
}

export default App;
