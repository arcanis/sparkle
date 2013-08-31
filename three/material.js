var vertexShaderGlsl = require( 'shaders/vertex.glsl' );
var fragmentShaderGlsl = require( 'shaders/fragment.glsl' );

var defaultTexture = require( './textures' ).circle( 128, { stops : { 0 : 1, 1 : 0 } } );

var Material = exports.Material = function ( count, options ) {

    this.options = options;

    var uniforms = {
        texture : { type : 't', value : this.options.texture || defaultTexture },
        size    : { type : 'f', value : this.options.size || 40 }
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
        attributes.aSize.value[ t ] = 1;
    }

    THREE.ShaderMaterial.call( this, {

        uniforms : uniforms,
        attributes : attributes,

        vertexShader : vertexShaderGlsl,
        fragmentShader : fragmentShaderGlsl,

        blending : this.options.blending != null ? this.options.blending : THREE.AdditiveBlending,

        depthTest : false,
        transparent : true

    } );

};

var F = function ( ) { };
F.prototype = THREE.ShaderMaterial.prototype;

Material.prototype = new F( );
Material.prototype.Shader = Material;
