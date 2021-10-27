import * as THREE from 'three';

const materials = {
  transparent: new THREE.LineBasicMaterial({ color: 0x999999, opacity: 0, transparent: true }),
  mesh: {
    default: new THREE.MeshBasicMaterial({ color: 0x999999 }),
    selected: new THREE.MeshBasicMaterial({ color: 0xffffff })
  },
  line: {
    default: new THREE.LineBasicMaterial({ color: 0x999999 }),
    selected: new THREE.LineBasicMaterial({ color: 0xffffff })
  }
}

export default materials;