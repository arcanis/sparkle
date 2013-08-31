var createCanvas = function ( resolution, options ) {

    var canvas = document.createElement( 'canvas' );
    canvas.width = canvas.height = resolution;

    var texture = new THREE.Texture( canvas );
    texture.needsUpdate = true;

    var context = canvas.getContext( '2d' );

    return {
        canvas : canvas,
        texture : texture,
        context : context
    };

};

exports.circle = function ( resolution, options ) {

    if ( typeof options === 'undefined' )
        options = { };

    var element = createCanvas( resolution, options );

    element.context.beginPath( );
    element.context.arc( resolution / 2, resolution / 2, resolution / 2, 0, Math.PI * 2, false );
    element.context.closePath( );

    if ( options.stops != null ) {
        element.context.fillStyle = element.context.createRadialGradient( resolution / 2, resolution / 2, 0, resolution / 2, resolution / 2, resolution / 2 );

        Object.keys( options.stops ).sort( ).forEach( function ( stop ) {
            element.context.fillStyle.addColorStop( stop, 'rgba( %n, %n, %n, 1)'.replace( /%n/g, 255 * options.stops[ stop ] ) );
        } );
    } else {
        element.context.fillStyle = 'white';
    }

    element.context.fill( );

    return element.texture;

};
