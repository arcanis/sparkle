var Particle = exports.Particle = function ( ) {

    this.status = this.ALIVE;

    if ( ! this.vectors ) {
        this.vectors = [ ];
    } else {
        this.vectors.splice( 0, this.vectors.length );
    }

};

Particle.prototype.ALIVE = 0;
Particle.prototype.DEAD = 1;
Particle.prototype.USER = 2;

var Vector = exports.Vector = function ( ) {

    this[ 0 ] = this[ 1 ] = this[ 2 ] = NaN;

};
