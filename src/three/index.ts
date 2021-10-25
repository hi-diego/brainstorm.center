import Note from 'brainstorm/proxy/Note';
import Notebook from 'brainstorm/Notebook';
import Directory from 'brainstorm/Directory';
import Immutable from 'immutable';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const dotsGroup = new THREE.Group();
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const sphereGeometry = new THREE.SphereGeometry( 0.1, 32, 32 );
const meshMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls( camera, renderer.domElement );

export function init () {
  scene.add(dotsGroup)
  camera.zoom = 1;
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  camera.position.z = 5;
  animate();
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, false);
}


export function animate () {
  requestAnimationFrame(animate);
  controls.update();
  dotsGroup.children.forEach((mesh: any) => {
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
      if (_label) _label.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
    });
  renderer.render( scene, camera );
}

export function drawLines(note: any, _dot: any = null, ref = false) {
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

export function drawDot(note: any) {
  const oldDot = scene.getObjectByName(note.title);
  if (oldDot) return drawLines(note, oldDot, true);
  const dot = new THREE.Mesh(sphereGeometry, meshMaterial);
  dot.translateX(Math.random() * 2);
  dot.translateY(Math.random() * 2);
  dot.translateZ(Math.random() * 2);
  dot.name = note.title;
  dotsGroup.add(dot);
  return drawLines(note, dot, true);
}
