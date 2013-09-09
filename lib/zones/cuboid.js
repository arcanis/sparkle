var FACES =
    [ [ +1, 0, 1, 2 ]
    , [ -1, 0, 1, 2 ]
    , [ +1, 1, 2, 0 ]
    , [ -1, 1, 2, 0 ]
    , [ +1, 2, 0, 1 ]
    , [ -1, 2, 0, 1 ] ];

exports.cuboid = function ( sx, sy, sz, inner ) {

    if ( typeof inner === 'undefined' )
        inner = false;

    var s = [ sx, sy, sz ];

    return function ( vector ) {

        if ( inner ) {

            vector[ 0 ] = ( Math.random( ) - .5 ) * s[ 0 ];
            vector[ 1 ] = ( Math.random( ) - .5 ) * s[ 1 ];
            vector[ 2 ] = ( Math.random( ) - .5 ) * s[ 2 ];

        } else { // only surface

            var face = FACES[ Math.floor( Math.random( ) * 6 ) ];

            vector[ face[ 1 ] ] = face[ 0 ] * s[ face[ 1 ] ] / 2;
            vector[ face[ 2 ] ] = ( Math.random( ) - .5 ) * s[ face[ 2 ] ];
            vector[ face[ 3 ] ] = ( Math.random( ) - .5 ) * s[ face[ 3 ] ];

        }

    };

};
