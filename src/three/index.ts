import Mention from 'brainstorm/Mention';
import random from 'common/random';
import scene from 'three/scene'
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import groups from 'three/groups';

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xbbbbbb });
const lineSelectedMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const transparentLineMaterial = new THREE.LineBasicMaterial({ color: 0xbbbbbb, opacity: 0, transparent: true });
const sphereGeometry = new THREE.SphereGeometry( 0.1, 32, 32 );
const meshMaterial = new THREE.MeshBasicMaterial({ color: 0xbbbbbb });
const meshSelectedMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer() // ({ alpha: true });
const controls = new OrbitControls( camera, renderer.domElement );
var selectedMesh: any = null

export function init () {
  renderer.setClearColor(0xffffff, 0);
  scene.add(groups.nodes)
  camera.zoom = 1;
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  camera.position.z = 5;
  animate();
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, false);
}


export function animate () {
  requestAnimationFrame(animate);
  controls.update();
  groups.nodes.children.forEach((mesh: any) => {
      const temporalVector = new THREE.Vector3()
      // get the position of the center of the cube
      mesh.updateWorldMatrix(true, false)
      mesh.getWorldPosition(temporalVector)
      // get the normalized screen coordinate of that position
      // x and y will be in the -1 to +1 range with x = -1 being
      // on the left and y = -1 being on the bottom
      temporalVector.project(camera)
      // convert the normalized position to CSS coordinates
      const x = ((temporalVector.x * 0.5)) * renderer.domElement.clientWidth
      const y = ((temporalVector.y * -0.7)) * renderer.domElement.clientHeight
      var _label =  document.getElementById(mesh.name);
      // console.log(mesh.name, _label)
      if (_label) _label.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
    });
  renderer.render( scene, camera );
}

export function drawLines(note: any, _dot: any = null, ref = false) {
  console.log('drawLines');
  const dot = _dot || scene.getObjectByName(note.title); 
  const groupName = `${note.title}-mentions`;
  const oldGroup = scene.getObjectByName(groupName);
  if (oldGroup) scene.remove(oldGroup);
  const group = new THREE.Group();
  const tubeGroup = new THREE.Group();
  tubeGroup.name = `${note.title}-mentions-tubes`;
  group.name = groupName
  note.mentions().forEach((mention: Mention) => {
    const to = mention.to;
    const toDot = scene.getObjectByName(to.title);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([dot.position, toDot.position]);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.name = `${note.title}-${to.title}`

    // Create Tube Geometry
    const tubeGeometry = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([dot.position, toDot.position]),
      512,// path segments
      0.003,// THICKNESS
      8, //Roundness of Tube
      false //closed
    );

    let tube = new THREE.Line(tubeGeometry, transparentLineMaterial);
    tube.name = `${note.title}-${to.title}-tube`


    const curve = getCubicBezierCurve3(dot, toDot);
    const curvePoints = curve.getPoints(50);
    const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const curveLine = new THREE.Line(curveGeometry, lineMaterial);
    curveLine.name = `${note.title}-${to.title}`

    tubeGroup.add(tube);

    if (mention.createdByUser) group.add(curveLine);
    else group.add(line);

  });
  scene.add(group);
  scene.add(tubeGroup);
  if (ref) note.references().forEach((from: any) => drawLines(from))
}

export function drawDot(note: any, drawMentions: boolean = true) {
  const oldDot = scene.getObjectByName(note.title);
  if (oldDot) return drawLines(note, oldDot, true);
  const dot = new THREE.Mesh(sphereGeometry, meshMaterial);
  dot.translateX(Math.random() * 2);
  dot.translateY(Math.random() * 2);
  dot.translateZ(Math.random() * 2);
  dot.name = note.title;
  groups.nodes.add(dot);
  return drawMentions ? drawLines(note, dot, true) : null;
}

export function getCubicBezierCurve3(dot: any, toDot: any) {
  if (dot.position.equals(toDot.position)) return new THREE.CubicBezierCurve3(dot.position, dot.position.clone().setY(dot.position.y+1).setZ(dot.position.z + random(-1, 1)), dot.position.clone().setX(dot.position.x+1).setZ(dot.position.z + random(-1, 1)), dot.position);
  const smallCurvature = random(-0.25, 0.25);
  return new THREE.CubicBezierCurve3(
    dot.position,
    new THREE.Vector3(
      ((dot.position.x + toDot.position.x)/2) + smallCurvature,
      (dot.position.y + toDot.position.y)/2 + smallCurvature,
      (dot.position.z + toDot.position.z)/2 + smallCurvature
    ),
    new THREE.Vector3(
      ((dot.position.x + toDot.position.x)/2) + smallCurvature,
      (dot.position.y + toDot.position.y)/2 + smallCurvature,
      (dot.position.z + toDot.position.z)/2 + smallCurvature
    ),
    toDot.position
  );
}

export function highlight(title: string | null = null) {
  if (!title && selectedMesh) {
    selectedMesh.material = meshMaterial;
    const groupName = `${selectedMesh.name}-mentions-tubes`;
    const tubes = scene.getObjectByName(groupName);
    if (tubes) tubes.children.forEach((t: any) => (t.material = transparentLineMaterial))
    selectedMesh = null;
    return;
  }
  const mesh = scene.getObjectByName(title);
  if (!mesh) return;
  mesh.material = meshSelectedMaterial;
  selectedMesh = mesh;
  const groupName = `${title}-mentions-tubes`;
  const tubes = scene.getObjectByName(groupName);
  if (!tubes) return;
  tubes.children.forEach((t: any) => (t.material = lineSelectedMaterial))
}