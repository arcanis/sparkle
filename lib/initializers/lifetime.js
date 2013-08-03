var LifeTime = exports.LifeTime = function ( min, max ) {

    this._min = min;

    this._diff = max - min;

};

LifeTime.prototype.initialize = function ( particle ) {

    particle.age = 0;

    particle.lifeTime = this._min + Math.random( ) * this._diff;

};
