var CommonJSEverywhere = require( 'commonjs-everywhere' );
var ESCodeGen = require( 'escodegen' );
var Fs = require( 'fs' );
var Path = require( 'path' );

var root = Path.resolve( Path.join( __dirname, '..' ) ) + '/';

var plainText = function ( text ) {
    return 'module.exports = ' + JSON.stringify( text ) + ';'; };

var compile = function ( file, directory, destination ) {
    Fs.writeFileSync( root + file, ESCodeGen.generate( CommonJSEverywhere.cjsify( root + directory + '/index.js', root + directory, {
        'export' : destination,
        'handlers' : { '.glsl' : plainText } } ) ) ); };

compile( 'sparkle.js', 'lib', 'SPARKLE' );
compile( 'sparkle-three.js', 'three', 'SPARKLE.THREE' );
