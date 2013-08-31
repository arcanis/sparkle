exports.move = function ( ) {

    return function ( particle, delta ) {

        var position = particle.position;
        var velocity = particle.velocity;

        position[ 0 ] += velocity[ 0 ] * delta;
        position[ 1 ] += velocity[ 1 ] * delta;
        position[ 2 ] += velocity[ 2 ] * delta;

    };

};
