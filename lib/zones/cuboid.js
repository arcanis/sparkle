var FACES =
    [ [ +1, 'x', 'y', 'z' ]
      , [ -1, 'x', 'y', 'z' ]
      , [ +1, 'y', 'z', 'x' ]
      , [ -1, 'y', 'z', 'x' ]
      , [ +1, 'z', 'x', 'y' ]
      , [ -1, 'z', 'x', 'y' ] ];

exports.cuboid = function ( sx, sy, sz, inner ) {

    if ( typeof inner === 'undefined' )
        inner = false;

    return function ( vector ) {

        if ( inner ) {

            vector[ 0 ] = ( Math.random( ) - .5 ) * sx;
            vector[ 1 ] = ( Math.random( ) - .5 ) * sy;
            vector[ 2 ] = ( Math.random( ) - .5 ) * sz;

        } else { // only surface

            var face = FACES[ Math.floor( Math.random( ) * 6 ) ];

            vector[ face[ 1 ] ] = face[ 0 ] * this[ '_s' + face[ 1 ] ] / 2;
            vector[ face[ 2 ] ] = ( Math.random( ) - .5 ) * this[ '_s' + face[ 2 ] ];
            vector[ face[ 3 ] ] = ( Math.random( ) - .5 ) * this[ '_s' + face[ 3 ] ];

        }

    };

};
