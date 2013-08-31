var utils = require( 'utils' );

exports.velocity = function ( zone ) {

    return function ( particle ) {

        particle.velocity = utils.asVector( zone );
        particle.vectors.push( particle.velocity );

    };

};
