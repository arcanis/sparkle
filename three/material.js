var vertexShaderGlsl = require( 'shaders/vertex.glsl' );
var fragmentShaderGlsl = require( 'shaders/fragment.glsl' );

var defaultTexture = require( './textures' ).gradientCircle( 128 );

var Material = exports.Material = function ( count, texture ) {

    var uniforms = {
        texture : { type : 't', value : texture || defaultTexture }
    };

    var attributes = {
        aColor   : { type : 'c', value : [ ] },
        aSize    : { type : 'f', value : [ ] },
        aOpacity : { type : 'f', value : [ ] }
    };

    var randomColor = function ( r, g, b ) {
        var color = new THREE.Color( 0xffffff );
        color.r = r * Math.random( );
        color.g = g * Math.random( );
        color.b = b * Math.random( );
        return color;
    };

    for ( var t = 0, T = count; t < T; ++ t ) {
        attributes.aOpacity.value[ t ] = 1;
        attributes.aColor.value[ t ] = randomColor( .3, .3, .3 );
        attributes.aSize.value[ t ] = 20;
    }

    THREE.ShaderMaterial.call( this, {

        uniforms : uniforms,
        attributes : attributes,

        vertexShader : vertexShaderGlsl,
        fragmentShader : fragmentShaderGlsl,

        blending : THREE.AdditiveBlending,

        depthTest : false,
        transparent : true

    } );

};

var F = function ( ) { };
F.prototype = THREE.ShaderMaterial.prototype;

Material.prototype = new F( );
Material.prototype.Shader = Material;
