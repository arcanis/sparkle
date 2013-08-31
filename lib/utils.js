var vectors = require( 'factories/vectors' ).factory;

exports.discardVector = function ( vector ) {

    vectors.free( vector );

};

exports.asVector = function ( what, destination ) {

    if ( typeof what !== 'function' && ! destination )
        return what;

    if ( typeof destination === 'undefined' )
        destination = vectors.allocate( );

    if ( typeof what === 'function' ) {
        what( destination );
    } else {
        destination[ 0 ] = what[ 0 ];
        destination[ 1 ] = what[ 1 ];
        destination[ 2 ] = what[ 2 ];
    }

    return destination;

};

exports.vectorLength = function ( vector ) {

    return Math.sqrt( Math.pow( vector[ 0 ], 2 )
                    + Math.pow( vector[ 1 ], 2 )
                    + Math.pow( vector[ 2 ], 2 ) );

};
