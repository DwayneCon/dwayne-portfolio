uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;
  
  vec3 pos = position;
  float elevation = sin(pos.x * 2.0 + uTime) * 0.1;
  elevation += sin(pos.y * 3.0 + uTime * 0.5) * 0.05;
  
  pos.z += elevation;
  pos.x += sin(uTime * 0.5) * 0.1;
  pos.y += cos(uTime * 0.3) * 0.1;
  
  float mouseDistance = distance(uMouse, vec2(pos.x, pos.y));
  pos.z += sin(mouseDistance * 10.0 - uTime * 2.0) * 0.05;
  
  vElevation = elevation;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}