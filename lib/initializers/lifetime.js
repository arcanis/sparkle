var utils = require( 'utils' );

exports.lifeTime = function ( zone ) {

    var vector = [ NaN, NaN, NaN ];

    return function ( particle ) {

        particle.age = 0;

        utils.asVector( zone, vector );
        particle.lifeTime = utils.vectorLength( vector );

    };

};
