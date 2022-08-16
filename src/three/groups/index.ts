import * as THREE from 'three';

const nodes = new THREE.Group();
nodes.name = 'nodes';
const links = new THREE.Group();
nodes.name = 'links';
const groups = {
  nodes,
  links
}

export default groups;
