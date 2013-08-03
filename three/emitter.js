var Material = require( 'material' ).Material;

var Emitter = exports.Emitter = function ( options ) {

    options = options || { };

    // Generating particles geometry

    var count = options.count != null ? options.count : 100;

    var material = options.material ? options.material : new Material( count, options.color );
    var geometry = new THREE.Geometry( );

    var particlePool = this.particlePool = [ ];

    for ( var t = 0, T = count; t < T; ++ t ) {

        var inf = Number.POSITIVE_INFINITY;
        var particle = new THREE.Vector3( inf, inf, inf );

        geometry.vertices.push( particle );
        particlePool.push( particle );

    }

    // Calling parent constructor

    THREE.ParticleSystem.call( this, geometry, material );
    this.dynamic = true;

    // Creating a basic emitter

    this.emitter = new SPARKLE.Emitter( options.frequency != null ? options.frequency : .5 );

    // Link spark particles with Three.js ones

    this.emitter.initializer( new SPARKLE.LambdaInitializer( function ( particle ) {
        particle.vertice = particlePool.pop( );
    } ) );

    // Position option

    if ( options.position != null ) {
        this.emitter.initializer( new SPARKLE.PositionInitializer( options.position ) );
    } else {
        this.emitter.initializer( new SPARKLE.PositionInitializer( new SPARKLE.PointZone( 0, 0, 0 ) ) );
    }

    // Lifetime option

    if ( options.lifeTime != null ) {
        this.emitter.initializer( new SPARKLE.LifeTimeInitializer( options.lifeTime[ 0 ], options.lifeTime[ 1 ] ) );

        if ( options.fadeIn != null )
            this.emitter.action( new SPARKLE.FadeInAction( options.fadeIn.duration ) );

        if ( options.fadeOut != null )
            this.emitter.action( new SPARKLE.FadeOutAction( options.fadeOut.duration ) );

        this.emitter.action( new SPARKLE.AgeingAction( ) );
    }

    // Velocity option

    if ( options.velocity != null ) {
        this.emitter.initializer( new SPARKLE.VelocityInitializer( options.velocity ) );

        if ( options.acceleration != null )
            this.emitter.action( new SPARKLE.AccelerationAction( options.acceleration[ 0 ], options.acceleration[ 1 ], options.acceleration[ 2 ] ) );

        this.emitter.action( new SPARKLE.DisplacementAction( ) );
    }

    // Custom initializers & actions

    if ( options.initializers != null ) {
        options.initializers.forEach( function ( initializer ) {
            this.emitter.initializer( initializer );
        }, this );
    }

    if ( options.actions != null ) {
        options.actions.forEach( function ( action ) {
            this.emitter.action( action );
        }, this );
    }

    // Bind particle managers

    this.emitter.onWakeUp = this.onWakeUp.bind( this );
    this.emitter.onUpdate = this.onUpdate.bind( this );
    this.emitter.onSleep = this.onSleep.bind( this );

    // Display initial particles

    if ( options.initial != null ) {
        this.emitter.spawn( options.initial[ 0 ], options.initial[ 1 ] );
    }

};

var F = function ( ) { };
F.prototype = THREE.ParticleSystem.prototype;

Emitter.prototype = new F( );
Emitter.prototype.constructor = Emitter;

Emitter.prototype.update = function ( delta ) {

    this.emitter.update( delta );

    return this;

};

Emitter.prototype.spawn = function ( count, randomly ) {

    this.emitter.spawn( count, randomly );

    return this;

};

Emitter.prototype.onWakeUp = function ( particle, delta ) {

};

Emitter.prototype.onUpdate = function ( particle, delta ) {

    if ( ! particle.vertice ) return ;

    particle.vertice.copy( particle.position );

    this.geometry.verticesNeedUpdate = true;

};

Emitter.prototype.onSleep = function ( particle, delta ) {

    if ( ! particle.vertice ) return ;

    var inf = Number.POSITIVE_INFINITY;

    particle.vertice.set( inf, inf, inf );

    this.geometry.verticesNeedUpdate = true;

    this.particlePool.push( particle.vertice );

};
