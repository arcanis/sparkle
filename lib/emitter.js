var particleFactory = require( 'factories/particles' ).factory;

var Emitter = exports.Emitter = function ( frequency ) {

    this._frequency = frequency;
    this._timer = 0;

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

Emitter.prototype.update = function ( delta ) {

    for ( var t = this._particles.length - 1; t >= 0; -- t )
        this.updateParticle( delta, t );

    for ( var timer = this._timer + delta; timer >= this._frequency; )
        this.createParticle( timer -= this._frequency );

    this._timer = timer;

};

Emitter.prototype.createParticle = function ( delta ) {

    var particle = particleFactory.alloc( );

    for ( var t = 0, T = this._initializers.length; t < T; ++ t )
        if ( this._initializers[ t ].initialize )
            this._initializers[ t ].initialize( particle );

    this._particles.unshift( particle );

    if ( ! this.deathToll( particle, 0 ) ) {
        this.onWakeUp( particle );
        this.updateParticle( delta, 0 );
    }

};

Emitter.prototype.updateParticle = function ( delta, n ) {

    var particle = this._particles[ n ];

    for ( var t = 0, T = this._actions.length; t < T; ++ t )
        if ( this._actions[ t ].update )
            this._actions[ t ].update( particle, delta );

    if ( ! this.deathToll( particle, n ) ) {
        this.onUpdate( particle );
    }

};

Emitter.prototype.deathToll = function ( particle, n ) {

    if ( particle.status !== particle.DEAD )
        return false;

    this._particles.splice( n, 1 );

    this.onSleep( particle );

    for ( var t = 0, T = this._initializers.length; t < T; ++ t )
        if ( this._initializers[ t ].discard )
            this._initializers[ t ].discard( particle );

    particleFactory.free( particle );

    return true;

};

// These methods can (should) be overriden.
Emitter.prototype.onWakeUp = function ( particle ) { };
Emitter.prototype.onUpdate = function ( particle ) { };
Emitter.prototype.onSleep  = function ( particle ) { };
