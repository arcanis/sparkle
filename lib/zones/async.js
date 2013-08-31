var utils = require( 'utils' );

exports.async = function ( fn, context ) {

    var current = null;

    fn.call( context, function ( zone ) {
        current = zone; } );

    return function ( vector ) {

        if ( current ) {
            utils.asVector( current, vector );
        } else {
            vector.x = vector.y = vector.z = NaN;
        }

    };

};
