uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;
varying float vElevation;

void main() {
  float distanceToMouse = distance(vUv, uMouse);
  
  vec3 color = mix(uColor1, uColor2, vUv.y + vElevation);
  
  float pulse = sin(uTime * 2.0 + distanceToMouse * 10.0) * 0.5 + 0.5;
  color += pulse * 0.1;
  
  float alpha = 0.3 + pulse * 0.2;
  
  gl_FragColor = vec4(color, alpha);
}