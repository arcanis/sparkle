var THREE, SPARKLE;

( function ( emitterBuilder ) {

    var renderer = new THREE.WebGLRenderer( { canvas : document.getElementById( 'canvas' ) } );
    renderer.setClearColor( new THREE.Color( 0x000000 ), 1 );

    var scene = new THREE.Scene( );

    var clock = new THREE.Clock( );

    var camera = new THREE.OrthographicCamera( 0, + Math.PI / 2, 20, - 20 );
    scene.add( camera );

    var emitter = emitterBuilder( );
    emitter.position.z = - 30;
    scene.add( emitter );

    var render = function ( ) {
        window.requestAnimationFrame( render );
        emitter.update( clock.getDelta( ) );
        renderer.render( scene, camera );
    };

    var screenX = 100, screenY = 100;
    var setSize = function ( ) {
        screenX = window.innerWidth;
        screenY = window.innerHeight;
        renderer.setSize( screenX, screenY );
    };

    window.addEventListener( 'resize', setSize );

    window.addEventListener( 'load', setSize );
    window.addEventListener( 'load', render );

    window.addEventListener( 'blur', function ( ) { clock.stop( ); } );
    window.addEventListener( 'focus', function ( ) { clock.start( ); } );

} )( function ( ) {

    var equation = function ( x ) {
        x = x - .1;
        var a = - x * 20 + Math.PI / 2;
        var b = Math.PI - 8 * x;
        return b > 0 ? Math.cos( a ) * 20 * b / Math.PI : 0; };

    var emitterA, emitterB;
    var set = new THREE.Object3D( );

    set.add( emitterA = new SPARKLE.THREE.Emitter( {

        count : 7000,
        lifeTime : SPARKLE.lineZone( 3, 3 ), fading : true, pulsing : true,
        frequency : 3 / 7000,

        color : SPARKLE.arrayZone( [ [ .1, .1, .6 ], [ .2, .1, .5 ] ] ),
        size : 500,

        velocity : SPARKLE.sphereZone( .02, .02, .02 ),
        position : function ( vector ) {
            var d = emitterA.delta( ) % Math.PI;
            var r = 5 + ( d ) * 3;
            vector[ 1 ] = r * Math.cos( ( d + Math.PI / 2 ) * 10 );
            vector[ 0 ] = .5 * d;
            vector[ 2 ] = r * Math.sin( ( d + Math.PI / 2 ) * 10 );
        }

    } ) );

    set.add( emitterB = new SPARKLE.THREE.Emitter( {

        count : 7000,
        lifeTime : SPARKLE.lineZone( 3, 3 ), fading : true, pulsing : true,
        frequency : 3 / 7000,

        color : SPARKLE.arrayZone( [ [ .6, .1, .1 ], [ .5, .1, .2 ] ] ),
        size : 500,

        velocity : SPARKLE.sphereZone( .02, .02, .02 ),
        position : function ( vector ) {
            var d = emitterB.delta( ) % Math.PI;
            var r = 5 + ( Math.PI - d ) * 3;
            vector[ 1 ] = r * Math.cos( + ( d + Math.PI ) * 10 );
            vector[ 0 ] = .5 * d;
            vector[ 2 ] = r * Math.sin( + ( d + Math.PI ) * 10 );
        }

    } ) );

    set.update = function ( ) {

        emitterA.update.apply( emitterA, arguments );
        emitterA.update.apply( emitterB, arguments );

        return this;

    };

    return set;

} );
