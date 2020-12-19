import * as THREE from 'three';

const SpiralShader = {
    uniforms: {
        time: { type: 'f', value: 0 },
        uMouse: { type: 'v2', value: new THREE.Vector2(0,0) }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying float vAlpha;

      uniform float time;
      uniform vec2 uMouse;

      attribute float angle;
      attribute float life;
      attribute float offset;
      void main() {
          vUv = uv;

          float current = mod(offset + time/2., life);
          float percentOfLife = current/life;
          
          vec3 newpos = position;

          vAlpha = smoothstep(0., 0.05, percentOfLife);
          vAlpha -= smoothstep(0.85, 1., percentOfLife);

          float dir = angle + sin(time/10.)*0.2;
              newpos.x += cos(dir)*current*0.15;
              newpos.y += sin(dir)*current*0.15;
              
              vec3 curpos = newpos;
              float mouseRadius = 0.35;
              float dist = distance(curpos.xy, uMouse);
              float strength = dist/mouseRadius;
              strength = 1. - smoothstep(0., 1., strength);
              float dx = uMouse.x - curpos.x;
              float dy = uMouse.y - curpos.y;
              float angleangle = atan(dy, dx);

              newpos.x += cos(angleangle)*strength*0.35;
              newpos.y += sin(angleangle)*strength*0.35;


          vec4 mvPosition = modelViewMatrix * vec4(newpos, 1. );
          gl_PointSize = 30. * (1. / - mvPosition.z );

          gl_Position = projectionMatrix * mvPosition;
      }
      `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;

      varying float vAlpha;
      void main() {
  
        //radius of circle should be 0.5 at maximum because we are already
        //at the center of the particle
        float distance = length(gl_PointCoord - vec2(0.5));

        float transparency = 1. - smoothstep(0., 0.5, distance);
          gl_FragColor = vec4(1.,0., 0., transparency*vAlpha);
      }
      `,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  };
  
  export default SpiralShader;