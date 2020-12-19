import ReactDOM from 'react-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import React, { useRef, useState } from 'react';
import {
  Canvas, extend, useFrame, useThree, Dom,
} from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';
import './index.css';
import SpiralShader from './shaders/SpiralShader';

extend({
  OrbitControls,
});

const Controls = () => {
  const orbitRef = useRef();
  const { camera, gl } = useThree();

  useFrame(() => {
    orbitRef.current.update();
  });

  return (
    <orbitControls
      args={[camera, gl.domElement]}
      ref={orbitRef}
    />
  );
};
// const Plane = () => (
//   <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
//     <planeBufferGeometry attach="geometry" args={[100, 100]} />
//     <meshPhysicalMaterial attach="material" color="red" />
//   </mesh>
// );

const Box = (props) => {
  // This reference will give us direct access to the mesh

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const props1 = useSpring({
    scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
    color: hovered ? 'hotpink' : 'gray',
  });
  const mesh = useRef();
  // Rotate mesh every frame, this is outside of React without overhead

  useFrame(() => {
    mesh.current.rotation.z += 0.02;
  });
  const num = 1000;
  const dots = [];
  for (let i = 0; i <= num; i++) {
    const amount = i / num; // -80 +40
    const angle = -80 + (120 * amount);
    const k = 0.05; // smaller exponent to make spiral smaller

    const x = 0.3 * Math.exp(k * angle) * Math.sin(0.25 * angle);
    const y = 0.3 * Math.exp(k * angle) * Math.cos(0.25 * angle);
    const z = Math.cos(0);

    dots.push(
      new THREE.Vector3(x, y, z),
    );
  }
  const curve = new THREE.CatmullRomCurve3(dots);
  return (
    <a.mesh
      {...props}
      // scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      ref={mesh}
      scale={props1.scale}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      castShadow
    >
      <tubeBufferGeometry attach="geometry" args={[curve, 1500, 0.01, 30, false]} />
      <a.shaderMaterial attach="material" args={[SpiralShader]} />
    </a.mesh>
  );
};

ReactDOM.render(
  <>
    <Canvas
      camera={{ position: [0, 0, 5] }}
      onCreated={({ gl }) => {
        const glRenderer = gl;
        glRenderer.shadowMap.enabled = true;
        glRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <ambientLight intensity={0.3} />
      <spotLight castShadow intensity={0.7} position={[0, 5, 10]} penumbra={1} />
      {/* <fog attach="fog" args={['white', 10, 20]} /> */}
      <Controls />
      {/* <Plane /> */}
      <Box position={[0, 0, 0]} />
    </Canvas>
  </>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
