import * as THREE from 'three';

const geometries = {
  node: {
    wireframe: new THREE.SphereGeometry(0.05, 12, 12),
    default: new THREE.SphereGeometry(0.05, 64, 32)
  }
}

export default geometries;
