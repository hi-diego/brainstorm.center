import Mention from 'brainstorm/Mention';
import Notebook from 'brainstorm/Notebook';
import Note from 'brainstorm/Note';
import random from 'common/random';
import scene from 'three/scene'
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import groups from 'three/groups';
import Materials from 'three/materials';
import geometries from 'three/geometries';
import { useHistory } from 'react-router-dom';
 
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xbbbbbb });
const lineSelectedMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const transparentLineMaterial = new THREE.LineBasicMaterial({ color: 0xbbbbbb, opacity: 0, transparent: true });
const sphereGeometry = new THREE.SphereGeometry( 0.1, 32, 32 );
const meshMaterial = new THREE.MeshBasicMaterial({ color: 0xbbbbbb });
const meshSelectedMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer() // ({ alpha: true });
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );
const controls = new OrbitControls( camera, renderer.domElement );
var selectedMesh: any = null;
var INITIALIZED: boolean = false;

export function clear () {
  while(groups.nodes.children.length > 0) { 
    groups.nodes.remove(groups.nodes.children[0]);
  }
  while(groups.links.children.length > 0) { 
    groups.links.remove(groups.links.children[0]);
  }
}

export function init () {
  if (INITIALIZED) return;
  INITIALIZED = true;
  renderer.setClearColor(0xffffff, 0);
  scene.add(groups.nodes)
  scene.add(groups.links)
  camera.zoom = 1;
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.domElement.setAttribute('id', 'three-canvas');
  document.body.appendChild( renderer.domElement );
  camera.position.z = 5;
  animate();
  // window.addEventListener('resize', () => {
  //   camera.aspect = window.innerWidth / window.innerHeight;
  //   camera.updateProjectionMatrix();
  //   renderer.setSize(window.innerWidth, window.innerHeight);
  // }, false);
}

export function animate () {
  requestAnimationFrame(animate);
  controls.update();
  groups.nodes.children.forEach((mesh: any) => {
      const temporalVector = new THREE.Vector3()
      // get the position of the center of the cube
      mesh.updateWorldMatrix(true, false)
      mesh.getWorldPosition(temporalVector)
      // get the normalized screen coordinate of that position
      // x and y will be in the -1 to +1 range with x = -1 being
      // on the left and y = -1 being on the bottom
      temporalVector.project(camera)
      // convert the normalized position to CSS coordinates
      const x = ((temporalVector.x * 0.5)) * renderer.domElement.clientWidth
      const y = ((temporalVector.y * -0.7)) * renderer.domElement.clientHeight
      var _label =  document.getElementById(mesh.name);
      // console.log(mesh.name, _label)
      if (_label) _label.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
    });
  renderer.render( scene, camera );
}




/*
* It creates a sphere mesh and adds it to the scene
* it also adds the titte of the note as the Id on the tree scene
*/
export function createNode(note: Note): any {
  const x = Math.random() * 2;
  const y = Math.random() * 2;
  const z = Math.random() * 2;
  const wireframe = new THREE.WireframeGeometry(geometries.node.default);
  const line = new THREE.LineSegments(wireframe);
  line.material.depthTest = false;
  line.material.opacity = 0.25;
  line.material.transparent = true;
  line.translateX(x);
  line.translateY(y);
  line.translateZ(z);
  line.name = note.uuid;
  line.userData = { note };
  return line;
}
/*
* It creates a sphere mesh and adds it to the scene
* it also adds the titte of the note as the Id on the tree scene
*/
export function getNode(note: Note, lines: boolean = false): any {
  // Get the Mesh Object if already exists.
  const currentNode = scene.getObjectByName(note.uuid);
  // return the object if already exists
  return currentNode ?? createNode(note);
}
/*
* It creates a sphere mesh and adds it to the scene
* it also adds the titte of the note as the Id on the tree scene
*/
export function drawNode(note: Note, shouldDrawConections: boolean = true): any {
  // Get the Mesh Object or create it if doesnt exist.
  const node = getNode(note);
  groups.nodes.add(node);
  if (shouldDrawConections) {
    Notebook.notes.valueSeq().toArray().map((n: Note) => drawConections(n, getNode(n)));
  }
  return node;
}

export function getLines(mentions: Immutable.Set<Mention>, node: any) {
  return mentions.map(mention => {
    const to = mention.to;
    const toNode = scene.getObjectByName(to.uuid);
    if (!to || !toNode) return;
    // Create a geometry that conects the 2 dots
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([node.position, toNode.position]);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    const linename = `${mention.from.uuid}-${to.uuid}`;
    line.name = linename;
    return line;
  });
}

function getTubes(mentions: Immutable.Set<Mention>, node: any) {
  return mentions.map(mention => {
    const to = mention.to;
    const toNode = scene.getObjectByName(to.uuid);
    const tubeGeometry = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([node.position, toNode.position]),
      512,// path segments
      0.003,// THICKNESS
      8, //Roundness of Tube
      false //closed
    );
    let tube = new THREE.Line(tubeGeometry, transparentLineMaterial);
    tube.name = `${mention.from.uuid}-${to.uuid}-tube`;
    return tube;
  });
}

export function drawConections(note: Note, node?: any) {
  node = node ?? getNode(note);
  drawLines(note, node);
  // drawLines(note, node, 'references');
}

export function drawLines(note: Note, node: any, name: string = 'mentions') {
  // the group that contains all the lines that connect the nodes
  const groupName = `${note.uuid}-${name}`;
  // For highlight purpuses we create another group tha
  // is just a Thick line with the same position
  // so wen the user selects the node we change the opacity to 1 and show the tick lines
  const tubeGroupName = `${note.uuid}-${name}-tubes`;
  const currentGroup = scene.getObjectByName(groupName);
  const currentTubesGroup = scene.getObjectByName(tubeGroupName);
  // redraw the tubes: remove it and then create it again.
  groups.links.remove(currentGroup);
  groups.links.remove(currentTubesGroup);
  // create the new groups
  const group = new THREE.Group();
  const tubeGroup = new THREE.Group();
  group.name = groupName
  tubeGroup.name = tubeGroupName
  // for each mention we create a line and a tube
  // and add it to the new group
  const mentions = name === 'mentions' ? note.mentions() : note.refs();
  const lines = getLines(mentions, node);
  lines.map(m => group.add(m));
  // tubes 
  const tubes = getTubes(mentions, node);
  tubes.map(m => tubeGroup.add(m));
  // groups
  groups.links.add(group);
  groups.links.add(tubeGroup);
}

export function getCubicBezierCurve3(dot: any, toNode: any) {
  if (dot.position.equals(toNode.position)) return new THREE.CubicBezierCurve3(dot.position, dot.position.clone().setY(dot.position.y+1).setZ(dot.position.z + random(-1, 1)), dot.position.clone().setX(dot.position.x+1).setZ(dot.position.z + random(-1, 1)), dot.position);
  const smallCurvature = random(-0.25, 0.25);
  return new THREE.CubicBezierCurve3(
    dot.position,
    new THREE.Vector3(
      ((dot.position.x + toNode.position.x)/2) + smallCurvature,
      (dot.position.y + toNode.position.y)/2 + smallCurvature,
      (dot.position.z + toNode.position.z)/2 + smallCurvature
    ),
    new THREE.Vector3(
      ((dot.position.x + toNode.position.x)/2) + smallCurvature,
      (dot.position.y + toNode.position.y)/2 + smallCurvature,
      (dot.position.z + toNode.position.z)/2 + smallCurvature
    ),
    toNode.position
  );
}

export function highlight(title: string | null = null) {
  if (selectedMesh) {
    selectedMesh.material = meshMaterial;
    const groupName = `${selectedMesh.name}-mentions-tubes`;
    const tubes = scene.getObjectByName(groupName);
    if (tubes) tubes.children.forEach((t: any) => (t.material = transparentLineMaterial))
    selectedMesh = null;
    return;
  }
  var nodes = scene.children[0]
  if (nodes) nodes.children.forEach((mesh: any) => disparageNode(mesh, mesh.name));
  const mesh = scene.getObjectByName(title);
  if (!mesh) return;
  mesh.material = meshSelectedMaterial;
  selectedMesh = mesh;
  const groupName = `${title}-mentions-tubes`;
  const tubes = scene.getObjectByName(groupName);
  if (!tubes) return;
  tubes.children.forEach((t: any) => (t.material = lineSelectedMaterial))
}


/**
 * Highlight the three.js node mesh by changing the material on the mesh.
 * Materials.line.selected color is pure white.
 */
export function highlightNode(mesh: any, title: string) {
  mesh.material = Materials.mesh.selected;
  const groupName = `${title}-mentions-tubes`;
  const tubes = scene.getObjectByName(groupName);
  if (!tubes) return;
  tubes.children.forEach((t: any) => (t.material = Materials.line.selected));
}

/**
 * Disparage the three.js node mesh by changing the material on the mesh.
 * Materials.line.default color is off white.
 */
export function disparageNode(mesh: any, title: string) {
  mesh.material = Materials.mesh.default;
  const groupName = `${title}-mentions-tubes`;
  const tubes = scene.getObjectByName(groupName);
  if (!tubes) return;
  tubes.children.forEach((t: any) => (t.material = Materials.transparent));
}