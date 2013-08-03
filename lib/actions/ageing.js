var Ageing = exports.Ageing = function ( ) {
};

Ageing.prototype.update = function ( particle, delta ) {

    particle.age += delta;

    if ( particle.age > particle.lifeTime ) {
        particle.status = particle.DEAD;
    }

};
