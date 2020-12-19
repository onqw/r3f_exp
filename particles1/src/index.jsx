import React, { useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  Canvas, useFrame, extend, useThree,
} from 'react-three-fiber';
import ParticlesShader from './shaders/ParticlesShader';
import './index.css';
import * as serviceWorker from './serviceWorker';

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

const Particles = () => {
  const ref = useRef();
  const count = 500;

  const position = new Float32Array(count * count * 3);
  // multiplied by 3 because each of the particles will have 3 values
  // for 3d coordinate
  const material = useRef();

  useFrame(() => {
    material.current.uniforms.time.value += 0.05;
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        // const u = Math.random() * 2 * Math.PI;
        // const v = Math.random() * Math.PI;

        // const x = 5 * (0.9 + 0.2 * v) * Math.cos(u) * Math.sin(v);
        // const y = 5 * 1.5 * Math.cos(v);
        // const z = 5 * (0.9 + 0.2 * v) * Math.sin(u) * Math.sin(v);

        position.set([((i / count) - 0.5) * 10, ((j / count) - 0.5) * 10, 0], 3 * (count * i + j));
        // position.set([x, y, z], 3 * (count * i + j));
      }
    }
  });


  return (
    <points ref={ref}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={['attributes', 'position']}
          array={position}
          count={position.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial attach="material" ref={material} args={[ParticlesShader]} />

    </points>
  );
};

const App = () => (
  <>
    <Canvas
      camera={{ position: [0, -1, -0.1] }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 1);
      }}
    >
      <Particles />
      <Controls />
    </Canvas>
  </>
);

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
