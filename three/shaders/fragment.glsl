uniform vec3 color;
uniform sampler2D texture;

varying vec4 vColor;
varying float vDepth;

void main( void ) {

    vec4 outColor = texture2D( texture, gl_PointCoord );

    gl_FragColor = outColor * vec4( color * vColor.xyz, 1.0 );
    gl_FragColor *= (300.0 - vDepth ) / 300.0;

}
