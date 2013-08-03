attribute float aSize;
attribute vec4 aColor;

varying vec4 vColor;
varying float vDepth;

void main( void ) {

    vColor = aColor;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    vec4 csPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    vDepth = csPosition.z;

    gl_PointSize = aSize * ( 100.0 / length( mvPosition.xyz ) );

    gl_Position = projectionMatrix * mvPosition;

}
