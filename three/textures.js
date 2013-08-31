exports.plainCircle = function ( resolution ) {

    var canvas = document.createElement( 'canvas' );
    canvas.width = canvas.height = resolution;

    var texture = new THREE.Texture( canvas );

    var context = canvas.getContext( '2d' );
    texture.needsUpdate = true;

    context.fillStyle = 'white';

    context.beginPath( );
    context.arc( resolution / 2, resolution / 2, resolution / 2 * .95, 0, Math.PI * 2, false );
    context.closePath( );

    context.fill( );

    return texture;

};

exports.gradientCircle = function ( resolution ) {

    var stops = Array.prototype.slice.call( arguments, 1 );

    var canvas = document.createElement( 'canvas' );
    canvas.width = canvas.height = resolution;

    var texture = new THREE.Texture( canvas );

    var context = canvas.getContext( '2d' );
    texture.needsUpdate = true;

    context.fillStyle = 'white';

    context.beginPath( );
    context.arc( resolution / 2, resolution / 2, resolution / 2 * .95, 0, Math.PI * 2, false );
    context.closePath( );

    var gradient = context.createRadialGradient( resolution / 2, resolution / 2, 0, resolution / 2, resolution / 2, resolution / 2 );
    gradient.addColorStop( 0, 'rgba( 255, 255, 255, 1)' );
    for ( var t = 0, T = stops.length, step = 255 / ( T + 1 ); t < T; ++ t )
        gradient.addColorStop( stops[ t ], 'rgba( %n, %n, %n, 1)'.replace( /%n/g, ( 255 - step * ( t + 1 ) ) ) );
    gradient.addColorStop( 1, 'rgba( 0, 0, 0, 1 )' );
    context.fillStyle = gradient;

    context.fill( );

    return texture;

};
