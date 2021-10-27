import scene from 'three/scene';
import geometries from 'three/geometries';
import materials from 'three/materials';
import Note from 'brainstorm/Note';
import * as THREE from 'three';
import groups from 'three/groups';

export default function createNode(note: Note): any {
  const oldNode = scene.getObjectByName(note.title);
  if (oldNode) return oldNode; // drawLines(note, oldNode, true);
  const node = new THREE.Mesh(geometries.node.default, materials.mesh.default);
  node.translateX(Math.random() * 2);
  node.translateY(Math.random() * 2);
  node.translateZ(Math.random() * 2);
  node.name = note.title;
  node.userData = { note };
  groups.nodes.add(node);
  return node;
  // return drawMentions ? drawLines(note, node, true) : null;
}
