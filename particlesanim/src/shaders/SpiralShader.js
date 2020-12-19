const SpiralShader = {
  uniforms: {

  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main() {
        vec3 newpos = position;
        vPosition = newpos; 
        vNormal = normal;
        vUv = uv;
        newpos += 0.276*normal*(4.*vUv.x - 0.03);
        gl_Position = projectionMatrix * modelViewMatrix* vec4( newpos, 1.0 );
    }
    `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    float Hash21(vec2 p) {
        p = fract(p*vec2(2345.34,435.345));
        p += dot (p,p+34.23);
        return fract(p.x * p.y);
    }
    void main() {

    float pi = 3.1415926;
    float angle = (atan(vPosition.y, vPosition.x) + pi)/(2.*pi);
    vec2 nUV = 6.*vec2(7.*angle + 6.*3.0 , vUv.y*5. - 3.*3.0);

    vec2 guv = fract(nUV) - 0.5;

    vec2 id = mod(floor(nUV), vec2(6., 6.));
    float n = Hash21(id);
    guv.x *= 2.*step(0.5, n) - 1.;

    float d = abs(abs(guv.x + guv.y) - 0.5);
    float diff = clamp(dot(vec3(0.,0.,1.), vNormal),0.3,1.);

    float mask = smoothstep(-0.01, 0.01, d - 0.3);

    if (mask < 0.0001) {
        discard;
    }
    gl_FragColor = vec4(vec3(mask)*diff, mask);
    if (!gl_FrontFacing) {
        gl_FragColor.a *= 0.5;
    }
    }
    `,
};

export default SpiralShader;
