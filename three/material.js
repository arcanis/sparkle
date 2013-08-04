var vertexShaderGlsl = require( 'shaders/vertex.glsl' );
var fragmentShaderGlsl = require( 'shaders/fragment.glsl' );

var texture = ( function ( size ) {

    var canvas = document.createElement( 'canvas' );
    canvas.width = canvas.height = size;

    var texture = new THREE.Texture( canvas );

    var draw = function ( ) {
        var context = canvas.getContext( '2d' );
        texture.needsUpdate = true;

        context.fillStyle = 'white';
        context.strokeStyle = 'red';

        context.beginPath( );
        context.arc( 64, 64, 60, 0, Math.PI * 2, false );
        context.closePath( );

        context.lineWidth = 0.5;
        context.stroke( );

        var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
        gradient.addColorStop( 0, 'rgba( 255, 255, 255, 1)' );
        gradient.addColorStop( 0.2, 'rgba( 255, 255, 255, 1)' );
        gradient.addColorStop( 0.4, 'rgba( 128, 128, 128, 1)' );
        gradient.addColorStop( 1, 'rgba( 0, 0, 0, 1 )' );
        context.fillStyle = gradient;

        context.fill( );
    };

    window.addEventListener( 'load', function ( ) {
        draw( );
    } );

    return texture;

} )( 128 );

var Material = exports.Material = function ( count, color ) {

    var uniforms = {
        texture : { type : 't', value : texture }
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
        attributes.aColor.value[ t ] = color || randomColor( .2, .2, .3 );
        attributes.aSize.value[ t ] = 50;
        attributes.aOpacity.value[ t ] = 1;
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
