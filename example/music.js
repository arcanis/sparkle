var THREE, SPARKLE;

( function ( emitterBuilder ) {

    var renderer = new THREE.WebGLRenderer( { canvas : document.getElementById( 'canvas' ) } );
    renderer.setClearColor( new THREE.Color( 0x000000 ), 1 );

    var scene = new THREE.Scene( );

    var clock = new THREE.Clock( );

    var camera = new THREE.PerspectiveCamera( 60, 0, .1, 10000 );
    scene.add( camera );

    var emitter = emitterBuilder( );
    scene.add( emitter );

    var render = function ( ) {

        window.requestAnimationFrame( render );
        emitter.update( clock.getDelta( ) );
        renderer.render( scene, camera );

    };

    var mouseX = 0, mouseY = 0;
    var fetchMouse = function ( e ) {

        mouseX = e.clientX / window.innerWidth  - .5;
        mouseY = e.clientY / window.innerHeight - .5;

    };

    var screenX = 100, screenY = 100;
    var setSize = function ( ) {

        screenX = window.innerWidth;
        screenY = window.innerHeight;

        renderer.setSize( screenX, screenY );

        camera.aspect = screenX / screenY;
        camera.updateProjectionMatrix( );

    };

    var reposition = function ( ) {

        var r = 100, d = 70;
        var a = mouseX * Math.PI;

        camera.position.x = r * Math.cos( a );
        camera.position.y = d + mouseY * 70;
        camera.position.z = r * Math.sin( a );

        camera.updateMatrixWorld( );
        camera.lookAt( emitter.position );

    };

    window.addEventListener( 'resize', setSize );

    window.addEventListener( 'mousemove', fetchMouse );
    window.addEventListener( 'mousemove', reposition );

    window.addEventListener( 'load', setSize );
    window.addEventListener( 'load', reposition );
    window.addEventListener( 'load', render );

    window.addEventListener( 'blur', function ( ) { clock.stop( ); } );
    window.addEventListener( 'focus', function ( ) { clock.start( ); } );

} )( function ( ) {

    var audio, emitter;
    var beat = 0;

    audio = new ( webkitAudioContext || mozAudioContext || AudioContext )( );

    var inputNode = audio.createBufferSource( );

    var analyserNode = audio.createAnalyser( );
    analyserNode.smoothingTimeConstant = .3;
    analyserNode.fftSize = 1024;

    var javascriptNode = window.x = audio.createJavaScriptNode( 2048, 1, 1 );
    javascriptNode.onaudioprocess = function ( ) {

        var array = new Uint8Array( analyserNode.frequencyBinCount );
        analyserNode.getByteFrequencyData( array );

        var average = 0;
        for ( var t = 0; t < array.length; ++ t )
            average += array[ t ];
        average /= array.length;

        beat = average;

    };

    inputNode.connect( analyserNode );
    analyserNode.connect( javascriptNode );
    javascriptNode.connect( audio.destination );
    inputNode.connect( audio.destination );

    var xhr = new XMLHttpRequest( );
    xhr.open( 'GET', 'assets/clozee-colossal.mp3', true );
    xhr.responseType = 'arraybuffer';
    xhr.onload = function ( ) {
        audio.decodeAudioData( xhr.response, function ( buffer ) {
            inputNode.buffer = buffer;
            inputNode.noteOn( 0 ); } ); };
    xhr.send( null );

    return emitter = new SPARKLE.THREE.Emitter( {

        count : 20000,
        initial : 20000,

        lifeTime : SPARKLE.sphereZone( 3, 3, 3 ),
        eternal : true,
        fading : true,

        size : 900,

        color : [ .8, .5, .1 ],
        liveColor : true,

        position : SPARKLE.cuboidZone( 180, 0, 180, true ),
        velocity : [ 0, 0, 0 ],
        acceleration : [ 0, - 100, 0 ],

        actions : [

            function ( particle ) {
                if ( particle.position[ 1 ] <= 0 ) {
                    particle.position[ 1 ] = 0;
                    particle.velocity[ 1 ] = 0;
                }
            },

            function ( particle ) {
                if ( particle.velocity[ 1 ] == 0 ) {
                    var dist = Math.sqrt( Math.pow( particle.position[ 0 ], 2 ) + Math.pow( particle.position[ 2 ], 2 ) );
                    particle.velocity[ 1 ] = Math.random( ) * beat / 50 * ( ( 282 - dist ) / 100 * 10 );
                    particle.color.setHSL( ( 240 + ( 360 - 240 ) * beat / 120 ) / 360, 1, .5 );
                }
            }

        ]

    } );

} );
