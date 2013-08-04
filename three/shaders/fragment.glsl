uniform sampler2D texture;

varying vec3  vColor;
varying float vDepth;
varying float vOpacity;

void main( void ) {

    vec4 outColor = texture2D( texture, gl_PointCoord );

    gl_FragColor = outColor * vec4( vColor, 1.0 );
    gl_FragColor *= (300.0 - vDepth ) / 300.0;
    gl_FragColor.a *= vOpacity;

}
