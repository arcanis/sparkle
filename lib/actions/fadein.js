var FadeIn = exports.FadeIn = function ( duration ) {

    this._duration = duration;

};

FadeIn.prototype.update = function ( particle ) {

    if ( particle.age >= this._duration )
        return ;

    particle.opacity =

};
