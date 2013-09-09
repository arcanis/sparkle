uniform float size;

attribute vec3  aColor;
attribute float aSize;
attribute float aOpacity;

varying vec3  vColor;
varying float vDepth;
varying float vOpacity;

void main( void ) {

    vColor = aColor;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    vec4 csPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    vDepth = csPosition.z;

    vOpacity = aOpacity;

    gl_PointSize = size * aSize * ( 1.0 / length( mvPosition.xyz ) );
    gl_Position = projectionMatrix * mvPosition;

}
