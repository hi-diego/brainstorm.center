import scene from 'three/scene';
import geometries from 'three/geometries';
import materials from 'three/materials';
import Note from 'brainstorm/Note';
import * as THREE from 'three';
import { drawLines } from './index';
import groups from 'three/groups';

/*
* It creates a sphere mesh and adds it to the scene
* it also adds the titte of the note as the Id on the tree scene
*/
export default function createNode(note: Note, lines: boolean = false): any {
  // Get the Mesh Object if already exists.
  const oldNode = scene.getObjectByName(note.title);
  // return the object if already exists
  if (oldNode) return oldNode;
  const node = ThreeMesh(geometries.node.default, materials.mesh.default);
  const x = Math.random() * 2;
  const y = Math.random() * 2;
  const z = Math.random() * 2;
  node.translateX(x);
  node.translateY(y);
  node.translateZ(z);
  node.name = note.title;
  node.transparent = true;
  node.material.opacity = 0.9;
  node.userData = { note };
  // groups.nodes.add(node);
  const wireframe = new THREE.WireframeGeometry(geometries.node.default);
  const line = new THREE.LineSegments(wireframe);
  line.material.depthTest = false;
  line.material.opacity = 0.25;
  line.material.transparent = true;
  line.translateX(x);
  line.translateY(y);
  line.translateZ(z);
  line.name = note.title;
  line.userData = { note };
  groups.nodes.add(line);
  // 
  if (lines) drawLines(note, node, true);
  return node;
}

function ThreeMesh(geometry: any , material: any) {
  return new THREE.Mesh(geometry, material);
}
