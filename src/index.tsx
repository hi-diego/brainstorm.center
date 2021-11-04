import React, { useRef, useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import geometries from 'three/geometries';
import materials from 'three/materials';
import * as THREE from 'three';


// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
extend({ OrbitControls });

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    // controls.minDistance = 3;
    // controls.maxDistance = 20;
    return () => { controls.dispose(); };
  }, [camera, gl]);
  return null;
};


function Node(props: any) {
  // This reference will give us direct access to the mesh
  const mesh = useRef<any>();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => (mesh.current.rotation.x += 0.01))
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={mesh}
      // args={ [geometries.node.default, active ? materials.mesh.selected : materials.mesh.default] }
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <lineSegments args={ [ geometries.node.wireframe ] }/>
    </mesh>
  )
}

function Graph() {
  const [hovered, setHover] = useState(false);
}

ReactDOM.render(
  <div id="root" style={{ width: "100vw", height: "100vh" }}>
    <Canvas>
      <color attach="background" args={"black"} />
      <CameraController />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <primitive object={new THREE.AxesHelper(2)} />
      <Node position={[0, 0, 0]} />
    </Canvas>
  </div>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
