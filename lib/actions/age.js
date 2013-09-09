exports.age = function ( eternal ) {

    if ( typeof eternal === 'undefined' )
        eternal = true;

    return function ( particle, delta ) {

        particle.age += delta;

        if ( ! eternal && particle.age > particle.lifeTime ) {
            particle.status = particle.DEAD;
        }

    };

};
