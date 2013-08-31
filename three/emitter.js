var DefaultMaterial = require( 'material' ).Material;

var Emitter = exports.Emitter = function ( options ) {

    this.options = options = options || { };

    // Generating particles geometry

    var count = this.options.count != null ? this.options.count : 100;

    var material = this.options.material ? this.options.material : new DefaultMaterial( count, {
        texture : this.options.texture,
        size : this.options.size,
        blending : this.options.blending
    } );

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
        ? this.options.frequency : .1;

    this.emitter = new SPARKLE.Emitter( frequency );

    // Link spark particles with Three.js ones

    this.emitter.initializer( function ( particle ) {
        particle.vertice = this.particleIndexPool.pop( );
    }.bind( this ) );

    // Position option

    if ( this.options.position != null ) {
        this.emitter.initializer( SPARKLE.positionInitializer( this.options.position ) );
    } else {
        this.emitter.initializer( SPARKLE.positionInitializer( [ 0, 0, 0 ] ) );
    }

    // Lifetime option

    if ( this.options.lifeTime != null ) {
        this.emitter.initializer( SPARKLE.lifeTimeInitializer( this.options.lifeTime ) );
        this.emitter.action( SPARKLE.ageAction( this.options.eternal ) );

        if ( options.fading ) {
            this.emitter.action( SPARKLE.fadeAction( typeof this.options.fading === 'function' ? this.options.fading : undefined ) );
        }

        if ( options.pulsing ) {
            this.emitter.action( SPARKLE.pulseAction( typeof this.options.pulsing === 'function' ? this.options.pulsing : undefined ) );
        }
    }

    // Velocity option

    if ( this.options.velocity != null ) {
        this.emitter.initializer( SPARKLE.velocityInitializer( this.options.velocity ) );

        if ( options.acceleration != null )
            this.emitter.action( SPARKLE.accelerateAction( this.options.acceleration[ 0 ], this.options.acceleration[ 1 ], this.options.acceleration[ 2 ] ) );

        this.emitter.action( SPARKLE.moveAction( ) );
    }

    // Color option

    if ( this.options.color != null ) {
        this.emitter.initializer( SPARKLE.THREE.colorInitializer( this.options.color, this.options.colorMode ) );
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

    if ( this.options.pulsing )
        this.material.attributes.aSize.needsUpdate = true;

    if ( this.options.fading )
        this.material.attributes.aOpacity.needsUpdate = true;

    if ( this.options.velocity )
        this.geometry.verticesNeedUpdate = true;

    return this;

};

Emitter.prototype.spawn = function ( count, randomly ) {

    this.emitter.spawn( count, randomly );

    return this;

};

Emitter.prototype.onWakeUp = function ( particle, delta ) {

    if ( particle.vertice == null ) return ;

    if ( this.options.color ) {
        this.material.attributes.aColor.value[ particle.vertice ] = particle.color;
        this.material.attributes.aColor.needsUpdate = true;
    }

};

Emitter.prototype.onUpdate = function ( particle, delta ) {

    if ( particle.vertice == null ) return ;

    if ( this.options.pulsing )
        this.material.attributes.aSize.value[ particle.vertice ] = particle.size;

    if ( this.options.fading )
        this.material.attributes.aOpacity.value[ particle.vertice ] = particle.opacity;

    if ( this.options.velocity ) {
        this.geometry.vertices[ particle.vertice ].fromArray( particle.position );
    }

};

Emitter.prototype.onSleep = function ( particle, delta ) {

    if ( particle.vertice == null ) return ;

    var inf = Number.POSITIVE_INFINITY;
    this.geometry.vertices[ particle.vertice ].set( inf, inf, inf );

    this.geometry.verticesNeedUpdate = true;

    this.particleIndexPool.push( particle.vertice );

};
