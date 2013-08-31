exports.accelerate = function ( x, y, z ) {

    return function ( particle, delta ) {

        var velocity = particle.velocity;

        velocity[ 0 ] += delta * x;
        velocity[ 1 ] += delta * y;
        velocity[ 2 ] += delta * z;

    };

};
