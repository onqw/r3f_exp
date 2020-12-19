import React, { useMemo, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ParticleShader from './shaders/ParticleShader';
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
      ref={orbitRef} />
  );
};

const Particles = ({ mouse }) => {
  let num = 5000;
  let positions = new Float32Array(num * 3);
  let angle = new Float32Array(num);
  let life = new Float32Array(num);
  let offset = new Float32Array(num);

  const { gl, camera } = useThree();

  const plane = useRef();
  const ref = useRef();
  gl.autoClear = false;
  const material = useRef();

  const clearPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(7,7),
    new THREE.MeshBasicMaterial({
      transparent: true,
      color: 0x0000ff,
      opacity: 0.01
    })
  )
  // console.log( [clearPlane] );
  for (let i = 0; i < num; i++) {
    positions.set([Math.random() *0.3,
       Math.random()*0.3,
        Math.random()*0.3],
         3*i);

    angle.set(
      [Math.random()*Math.PI*2], i
    );

    life.set(
      [4 + Math.random()*10], i
    );

    offset.set(
      [1000 * Math.random()], i
    );

  }

  let raycaster = new THREE.Raycaster();
  useFrame(() => { //updates uniforms' value in shader material.
    material.current.uniforms.time.value += 0.05;
    // material.current.uniforms.uMouse.value = new THREE.Vector2(mouse)
        raycaster.setFromCamera(mouse, camera);
        let intersects = raycaster.intersectObjects( [clearPlane] );
        if (intersects[0]) {
          let p  = intersects[0].point;
          material.current.uniforms.uMouse.value = new THREE.Vector2(p.x, p.y)
        }
    // console.log(plane)
        // let intersects = raycaster.intersectObjects( [plane] );
  })
        // let intersects = raycaster.intersectObjects( [plane] );
        // console.log(intersects);
        // let intersects = raycaster.intersectObjects( [plane] );
        // console.log(intersects);
        // if (intersects[0]) {
        //   let p  = intersects[0].point;
        //   console.log(p);
        // }
  const update = useCallback(self => {
    // self.needsUpdate = true
    // self.parent.computeBoundingSphere()
  }, [])
  return (
   <> 
      <points ref={ref} >
        <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={['attributes', 'position']}
          array={positions}
          count={positions.length / 3}
          itemSize={3}
          onUpdate={update}
        />
        <bufferAttribute
          attachObject={['attributes', 'angle']}
          array={angle}
          count={angle.length}
          itemSize={1}
          onUpdate={update}
        />
        <bufferAttribute
          attachObject={['attributes', 'life']}
          array={life}
          count={life.length}
          itemSize={1}
          onUpdate={update}
        />
        <bufferAttribute
          attachObject={['attributes', 'offset']}
          array={offset}
          count={offset.length}
          itemSize={1}
          onUpdate={update}
        />
      </bufferGeometry>
      <shaderMaterial attach="material" ref={material} args={[ParticleShader]} transparent="true" />
    </points>
    {/* <mesh ref={plane}>
       <planeBufferGeometry attach="geometry" args={[5,5]} />
         <meshBasicMaterial attach="material" transparent="true" color="#0000FF" opacity="0.01" />
      </mesh> */}
      <primitive  object={clearPlane} position={[0, 0, 0]} />
    </>
    )

    }
const App = () => {
  const mouse = new THREE.Vector2();
  const onMouseMove = (event) => {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }
  // const onMouseMove = useCallback(({ clientX: x, clientY: y }) => (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]), [])
return (
  <div onMouseMove={onMouseMove}>
    <Canvas
      camera={{ position: [0, 0, 2] }} 
      gl={{preserveDrawingBuffer: true, alpha: true}}
  >
    <ambientLight intensity={0.3} />
    <spotLight intensity={0.7} />
    <Controls />
    <Particles mouse={mouse} />
  </Canvas>
</div>
)
}
  ReactDOM.render(
    <App />, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
