var triangleArea = function ( a, b, c ) {
    return .5 * Math.sqrt(
        Math.pow( b.x * c.y - c.x * b.y, 2 ) +
        Math.pow( c.x * a.y - a.x * c.y, 2 ) +
        Math.pow( a.x * b.y - b.x * a.y, 2 ) ); };

exports.geometry = function ( geometry ) {

    var total = 0;
    var faces = [ ];

    geometry.faces.forEach( function ( face ) {

        var triangle = {
            a : geometry.vertices[ face.a ],
            b : geometry.vertices[ face.b ],
            c : geometry.vertices[ face.c ]
        };

        var area = triangleArea( triangle.a, triangle.b, triangle.c );
        faces.push( { position : total, face : triangle } );
        total += area;

    } );

    return function ( vector ) {

        var r = Math.random( ) * total, closest = null, diff = Number.POSITIVE_INFINITY;
        for ( var t = 0, T = faces.length; t < T; ++ t ) {
            var currentDiff = Math.abs( r - faces[ t ].position );
            if ( currentDiff < diff ) {
                closest = t;
                diff = currentDiff;
            }
        }

        var face = faces[ closest ];

        var b0 = Math.random( );
        var b1 = ( 1 - b0 ) * Math.random( );
        var b2 = 1 - b0 - b1;

        vector[ 0 ] = face.face.a.x * b0 + face.face.b.x * b1 + face.face.c.x * b2;
        vector[ 1 ] = face.face.a.y * b0 + face.face.b.y * b1 + face.face.c.y * b2;
        vector[ 2 ] = face.face.a.z * b0 + face.face.b.z * b1 + face.face.c.z * b2;

    };

};
