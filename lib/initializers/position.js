var utils = require( 'utils' );

exports.position = function ( zone ) {

    return function ( particle ) {

        particle.position = utils.asVector( zone );
        particle.vectors.push( particle.position );

    };

};
