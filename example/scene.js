var m = new MersenneTwister( );
Math.random = function ( ) {
    return m.random( );
};

var renderer = new THREE.WebGLRenderer( { canvas : document.getElementById( 'canvas' ) } );
renderer.setClearColor( new THREE.Color( 0x000000 ), 1 );

var scene = new THREE.Scene( );

var clock = new THREE.Clock( );

var horse = new THREE.Object3D( );
horse.position.x = 100;
horse.position.z = - 40;
horse.rotation.x = Math.PI / 2 * 3;
horse.scale.set( .8, .8, .8 );
horse.updateMatrixWorld( );
scene.add( horse );

var camera = new THREE.PerspectiveCamera( 60, 0, .1, 10000 );
camera.position.set( 0, 10, 0 );
camera.updateMatrixWorld( );
camera.lookAt( new THREE.Vector3( 100, 10, 0 ) );
scene.add( camera );

var emitter;
horse.add( emitter = new SPARKLE.THREE.Emitter( {

    count : 3000,

    frequency : .001,
    velocity : new SPARKLE.SphereZone( 1.5, 1.5, 1.5 ),
    lifeTime : [ 2, 4 ],

    position : new SPARKLE.AsyncZone( function ( update ) {

        var loader = new THREE.OBJLoader( );

        loader.load( 'horse.obj', function ( object ) {

            update( new SPARKLE.THREE.GeometryZone( object.children[ 1 ].geometry ) );

        } );

    } )

} ) );

var render = function ( ) {
    window.requestAnimationFrame( render );
    emitter.update( clock.getDelta( ) );
    renderer.render( scene, camera );
};

var setSize = function ( ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix( );
};

window.addEventListener( 'resize', setSize );
window.addEventListener( 'load', setSize );
window.addEventListener( 'load', render );
