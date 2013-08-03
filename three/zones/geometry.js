var triangleArea = function ( a, b, c ) {
    return .5 * Math.sqrt(
        Math.pow( b.x * c.y - c.x * b.y, 2 ) +
        Math.pow( c.x * a.y - a.x * c.y, 2 ) +
        Math.pow( a.x * b.y - b.x * a.y, 2 ) ); };

var Geometry = exports.Geometry = function ( geometry ) {

    this._total = 0;
    this._faces = [ ];

    geometry.faces.forEach( function ( face ) {

        if ( face instanceof THREE.Face4 )
            throw new Error( 'Unsupported' );

        var triangle = {
            a : geometry.vertices[ face.a ],
            b : geometry.vertices[ face.b ],
            c : geometry.vertices[ face.c ]
        };

        var area = triangleArea( triangle.a, triangle.b, triangle.c );
        this._faces.push( { position : this._total, face : triangle } );
        this._total += area;

    }, this );

};

Geometry.prototype.random = function ( ) {

    var r = Math.random( ) * this._total, closest = null, diff = Number.POSITIVE_INFINITY;
    for ( var t = 0, T = this._faces.length; t < T; ++ t ) {
        var currentDiff = Math.abs( r - this._faces[ t ].position );
        if ( currentDiff < diff ) {
            closest = t;
            diff = currentDiff;
        }
    }

    var face = this._faces[ closest ];

    var b0 = Math.random( );
    var b1 = ( 1 - b0 ) * Math.random( );
    var b2 = 1 - b0 - b1;

    var coord = SPARKLE.coordFactory.alloc( );
    coord.x = face.face.a.x * b0 + face.face.b.x * b1 + face.face.c.x * b2;
    coord.y = face.face.a.y * b0 + face.face.b.y * b1 + face.face.c.y * b2;
    coord.z = face.face.a.z * b0 + face.face.b.z * b1 + face.face.c.z * b2;
    return coord;

};

Geometry.prototype.free = function ( coord ) {

    SPARKLE.coordFactory.free( coord );

};
