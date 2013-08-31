exports.age = function ( canDie ) {

    if ( typeof canDie === 'undefined' )
        canDie = true;

    return function ( particle, delta ) {

        particle.age += delta;

        if ( canDie && particle.age > particle.lifeTime ) {
            particle.status = particle.DEAD;
        }

    };

};
