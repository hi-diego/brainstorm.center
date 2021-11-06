import * as THREE from 'three';

const materials = {
  transparent: new THREE.LineBasicMaterial({ color: 0x999999, opacity: 0, transparent: true }),
  mesh: {
    default: new THREE.MeshStandardMaterial({ color: 0x999999 }), //  emissive: 0xaaaaaa }),
    selected: new THREE.MeshStandardMaterial({ color: 0xffffff }) //  emissive: 0xaaaaaa })
  },
  line: {
    default: new THREE.LineBasicMaterial({ color: 0x999999 }),
    selected: new THREE.LineBasicMaterial({ color: 0xffffff })
  }
}

export default materials;