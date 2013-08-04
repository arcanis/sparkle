var Material = require( 'material' ).Material;

var Emitter = exports.Emitter = function ( options ) {

    this.options = options = options || { };

    // Generating particles geometry

    var count = this.options.count != null ? this.options.count : 100;

    var material = this.options.material ? this.options.material : new Material( count, this.options.color );
    var geometry = new THREE.Geometry( );

    this.particleIndexPool = [ ];

    for ( var t = 0, T = count; t < T; ++ t ) {

        var inf = Number.POSITIVE_INFINITY;
        var particle = new THREE.Vector3( inf, inf, inf );

        geometry.vertices.push( particle );
        this.particleIndexPool.push( t );

    }

    // Calling parent constructor

    THREE.ParticleSystem.call( this, geometry, material );
    this.dynamic = true;

    // Creating a basic emitter

    var frequency = this.options.frequency != null
        ? this.options.frequency
        : this.options.lifeTime != null
            ? 1 / ( count / this.options.lifeTime[ 1 ] )
            : .5;

    this.emitter = new SPARKLE.Emitter( frequency );

    // Link spark particles with Three.js ones

    this.emitter.initializer( new SPARKLE.LambdaInitializer( function ( particle ) {
        particle.vertice = this.particleIndexPool.pop( );
    }, this ) );

    // Position option

    if ( this.options.position != null ) {
        this.emitter.initializer( new SPARKLE.PositionInitializer( this.options.position ) );
    } else {
        this.emitter.initializer( new SPARKLE.PositionInitializer( new SPARKLE.PointZone( 0, 0, 0 ) ) );
    }

    // Lifetime option

    if ( this.options.lifeTime != null ) {
        this.emitter.initializer( new SPARKLE.LifeTimeInitializer( this.options.lifeTime[ 0 ], this.options.lifeTime[ 1 ] ) );

        if ( options.fading )
            this.emitter.action( new SPARKLE.FadingAction( typeof this.options.fading === 'function' ? this.options.fading : undefined ) );

        this.emitter.action( new SPARKLE.AgeingAction( ) );
    }

    // Velocity option

    if ( this.options.velocity != null ) {
        this.emitter.initializer( new SPARKLE.VelocityInitializer( this.options.velocity ) );

        if ( options.acceleration != null )
            this.emitter.action( new SPARKLE.AccelerationAction( this.options.acceleration[ 0 ], this.options.acceleration[ 1 ], this.options.acceleration[ 2 ] ) );

        this.emitter.action( new SPARKLE.DisplacementAction( ) );
    }

    // Custom initializers & actions

    if ( this.options.initializers != null ) {
        this.options.initializers.forEach( function ( initializer ) {
            this.emitter.initializer( initializer );
        }, this );
    }

    if ( this.options.actions != null ) {
        this.options.actions.forEach( function ( action ) {
            this.emitter.action( action );
        }, this );
    }

    // Bind particle managers

    this.emitter.onWakeUp = this.onWakeUp.bind( this );
    this.emitter.onUpdate = this.onUpdate.bind( this );
    this.emitter.onSleep = this.onSleep.bind( this );

    // Display initial particles

    if ( this.options.initial != null ) {
        this.emitter.spawn( this.options.initial[ 0 ], this.options.initial[ 1 ] );
    }

};

var F = function ( ) { };
F.prototype = THREE.ParticleSystem.prototype;

Emitter.prototype = new F( );
Emitter.prototype.constructor = Emitter;

Emitter.prototype.update = function ( delta, updates ) {

    this.emitter.update( delta );

    if ( updates != null )
        for ( var t = 0, T = updates.length; t < T; ++ t )
            this.material.attributes[ updates[ t ] ].needsUpdate = true;

    if ( this.options.fading )
        this.material.attributes.aOpacity.needsUpdate = true;

    return this;

};

Emitter.prototype.spawn = function ( count, randomly ) {

    this.emitter.spawn( count, randomly );

    return this;

};

Emitter.prototype.onWakeUp = function ( particle, delta ) {

};

Emitter.prototype.onUpdate = function ( particle, delta ) {

    if ( particle.vertice == null ) return ;

    this.geometry.vertices[ particle.vertice ].copy( particle.position );

    if ( this.options.fading )
        this.material.attributes.aOpacity.value[ particle.vertice ] = particle.opacity;

    this.geometry.verticesNeedUpdate = true;

};

Emitter.prototype.onSleep = function ( particle, delta ) {

    if ( particle.vertice == null ) return ;

    var inf = Number.POSITIVE_INFINITY;
    this.geometry.vertices[ particle.vertice ].set( inf, inf, inf );

    this.geometry.verticesNeedUpdate = true;

    this.particleIndexPool.push( particle.vertice );

};
