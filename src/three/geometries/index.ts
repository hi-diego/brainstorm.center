import * as THREE from 'three';

const def = new THREE.SphereGeometry(1, 12, 12);

const geometries = {
  node: {
    default: def,
    wireframe: new THREE.WireframeGeometry(def)
  },
}

export default geometries;
