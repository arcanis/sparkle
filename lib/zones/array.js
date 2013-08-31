var utils = require( 'utils' );

exports.array = function ( source ) {

    return function ( vector ) {

        if ( ! source.length ) {
            vector[ 0 ] = vector[ 1 ] = vector[ 2 ] = NaN;
        } else {
            utils.asVector( source[ Math.floor( Math.random( ) * source.length ) ], vector );
        }

    };

};
