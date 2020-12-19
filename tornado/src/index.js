import React, { useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

extend({
  OrbitControls,
})

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
      
  )
};

const Tornado = () => {
function CustomSinCurve( scale ) {
  THREE.Curve.call( this );

  this.scale = ( scale === undefined ) ? 1 : scale;
}

CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
CustomSinCurve.prototype.constructor = CustomSinCurve;

CustomSinCurve.prototype.getPoint = function( t ) {
  var tx = t * 3 - 1.5;
  var ty = Math.sin( 2 * Math.PI * t);
  var tz = 0;
  return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );
}

var path = new CustomSinCurve(10);

  return (
   <mesh>
    <tubeGeometry attach="geometry" args={[path, 20, 2, 0, false]} />
    <meshStandardMaterial attach="material" color="0x00ff00" />
   </mesh> 
  )
}
ReactDOM.render(
  <>
    <Canvas 
      camera={{ position: [0, 0, 5] }} 
    >
      <ambientLight intensity={0.3} />
      <Tornado />
      <Controls />

    </Canvas>
  </>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
