var renderer = new THREE.WebGLRenderer( { canvas : document.getElementById( 'canvas' ) } );
renderer.setClearColor( new THREE.Color( 0x000000 ), 1 );

var scene = new THREE.Scene( );

var clock = new THREE.Clock( );

var horse = new THREE.Object3D( );
horse.rotation.x = Math.PI / 2 * 3;
horse.rotation.z = Math.PI / 2 * 1;
horse.scale.set( .8, .8, .8 );
horse.updateMatrixWorld( );
scene.add( horse );

var camera = new THREE.PerspectiveCamera( 60, 0, .1, 10000 );
scene.add( camera );

var emitter, loader = new THREE.OBJLoader( );
loader.load( 'assets/horse.obj', function ( object ) {
    var fullGeometry = object.children[ 1 ].geometry;

    horse.add( emitter = new SPARKLE.THREE.Emitter( {

        count : 3000,
        lifeTime : SPARKLE.lineZone( 1, 2 ), fading : true,
        frequency : 1 / 4000,

        color : SPARKLE.arrayZone( [ [.6, .6, .4 ], [ .4, .3, .1 ] ] ),

        position : SPARKLE.THREE.geometryZone( fullGeometry ),
        velocity : SPARKLE.sphereZone( 2, 2, 2 )

    } ) );
} );

var render = function ( ) {
    window.requestAnimationFrame( render );

    if ( emitter )
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
    var r = 100;
    var a = mouseX * Math.PI;

    camera.position.x = r * Math.cos( a );
    camera.position.y = 70 + mouseY * 70;
    camera.position.z = r * Math.sin( a );

    camera.updateMatrixWorld( );
    camera.lookAt( horse.position );
};

window.addEventListener( 'resize', setSize );

window.addEventListener( 'mousemove', fetchMouse );
window.addEventListener( 'mousemove', reposition );

window.addEventListener( 'load', setSize );
window.addEventListener( 'load', reposition );
window.addEventListener( 'load', render );

window.addEventListener( 'blur', function ( ) { clock.stop( ); } );
window.addEventListener( 'focus', function ( ) { clock.start( ); } );
