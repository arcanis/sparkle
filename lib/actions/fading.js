var Fading = exports.Fading = function ( fn ) {

    this._fn = fn || function ( n ) {
        return Math.sqrt( n - Math.pow( n, 2 ) ); };

};

Fading.prototype.update = function ( particle ) {

    var age = Math.min( particle.age, particle.lifeTime );
    particle.opacity = this._fn( age / particle.lifeTime );

};
