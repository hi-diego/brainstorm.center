import scene from 'three/scene';
import geometries from 'three/geometries';
import materials from 'three/materials';
import Note from 'brainstorm/Note';
import * as THREE from 'three';
import groups from 'three/groups';

export default function createNode(note: Note): any {
  const oldNode = scene.getObjectByName(note.title);
  if (oldNode) return oldNode; // drawLines(note, oldNode, true);
  const node = ThreeMesh(geometries.node.default, materials.mesh.default);
  node.translateX(Math.random() * 2);
  node.translateY(Math.random() * 2);
  node.translateZ(Math.random() * 2);
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
  line.translateX(Math.random() * 2);
  line.translateY(Math.random() * 2);
  line.translateZ(Math.random() * 2);
  line.name = note.title;
  line.userData = { note };
  groups.nodes.add(line);

  return node;
  // return drawMentions ? drawLines(note, node, true) : null;
}

function ThreeMesh(geometry: any , material: any) {
  return new THREE.Mesh(geometry, material);
}
