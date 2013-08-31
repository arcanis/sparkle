exports.color = function ( zone, mode ) {

    if ( typeof mode === 'undefined' ) {
        mode = 'RGB';
    } else {
        mode = mode.toUpperCase( );
    }

    var vector = [ NaN, NaN, NaN ];

    return function ( particle ) {

        if ( ! particle.color )
            particle.color = new THREE.Color( );

        SPARKLE.utils.asVector( zone, vector );
        particle.color[ 'set' + mode ]( vector[ 0 ], vector[ 1 ], vector[ 2 ] );

    };

};
