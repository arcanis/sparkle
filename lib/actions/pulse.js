exports.pulse = function ( fn ) {

    if ( typeof fn === 'undefined' )
        fn = function ( n ) {
            return Math.sqrt( n - Math.pow( n, 2 ) ); };

    return function ( particle, delta ) {

        var age = particle.age % particle.lifeTime;
        particle.size = fn( age / particle.lifeTime );

    };

};
