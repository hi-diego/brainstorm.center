import * as THREE from 'three';

export default {
  transparent: new THREE.LineBasicMaterial({ color: 0xbbbbbb, opacity: 0, transparent: true }),
  mesh: {
    default: new THREE.MeshBasicMaterial({ color: 0xbbbbbb }),
    selected: new THREE.MeshBasicMaterial({ color: 0xffffff })
  },
  line: {
    default: new THREE.LineBasicMaterial({ color: 0xbbbbbb }),
    selected: new THREE.LineBasicMaterial({ color: 0xffffff })
  }
}