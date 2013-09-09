var particles = require( 'factories/particles' ).factory;
var utils = require( 'utils' );

var Emitter = exports.Emitter = function ( frequency ) {

    this._frequency = frequency;
    this._timer = 0;
    this._delta = 0;

    this._initializers = [ ];
    this._actions = [ ];

    this._particles = [ ];

};

Emitter.prototype.initializer = function ( initializer ) {

    this._initializers.push( initializer );

    return this;

};

Emitter.prototype.action = function ( action ) {

    this._actions.push( action );

    return this;

};

Emitter.prototype.spawn = function ( count, randomly ) {

    for ( var t = 0, T = count; t < T; ++ t ) {
        this.createParticle( randomly != null
            ? Math.random( ) * randomly
            : 0
        );
    }

};

Emitter.prototype.delta = function ( ) {

    return this._delta;

};

Emitter.prototype.update = function ( delta ) {

    for ( var t = this._particles.length - 1; t >= 0; -- t )
        this.updateParticle( delta, t );

    for ( var timer = this._timer + delta; timer >= this._frequency; ) {
        this._delta += this._frequency;
        this.createParticle( timer -= this._frequency );
    }

    this._timer = timer;

};

Emitter.prototype.createParticle = function ( delta ) {

    var particle = particles.allocate( );

    for ( var t = 0, T = this._initializers.length; t < T; ++ t )
        this._initializers[ t ]( particle );

    this._particles.unshift( particle );

    if ( ! this.deathToll( particle, 0 ) ) {
        this.onWakeUp( particle );
        this.updateParticle( delta, 0 );
    }

};

Emitter.prototype.updateParticle = function ( delta, n ) {

    var particle = this._particles[ n ];

    for ( var t = 0, T = this._actions.length; t < T; ++ t )
        this._actions[ t ]( particle, delta );

    if ( ! this.deathToll( particle, n ) ) {
        this.onUpdate( particle );
    }

};

Emitter.prototype.deathToll = function ( particle, n ) {

    if ( particle.status !== particle.DEAD )
        return false;

    this._particles.splice( n, 1 );

    this.onSleep( particle );

    for ( var t = 0, T = particle.vectors.length; t < T; ++ t )
        utils.discardVector( particle.vectors[ t ] );
    particle.vectors.splice( 0, particle.vectors.length );

    particles.free( particle );

    return true;

};

// These methods can (should) be overriden.
Emitter.prototype.onWakeUp = function ( particle ) { };
Emitter.prototype.onUpdate = function ( particle ) { };
Emitter.prototype.onSleep  = function ( particle ) { };
