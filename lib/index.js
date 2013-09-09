exports.utils               = require( 'utils' );

exports.Emitter             = require( 'emitter' ).Emitter;
exports.Factory             = require( 'factory' ).Factory;

exports.positionInitializer = require( 'initializers/position' ).position;
exports.velocityInitializer = require( 'initializers/velocity' ).velocity;
exports.lifeTimeInitializer = require( 'initializers/lifetime' ).lifeTime;

exports.accelerateAction    = require( 'actions/accelerate' ).accelerate;
exports.ageAction           = require( 'actions/age' ).age;
exports.moveAction          = require( 'actions/move' ).move;
exports.fadeAction          = require( 'actions/fade' ).fade;
exports.pulseAction         = require( 'actions/pulse' ).pulse;

exports.lineZone            = require( 'zones/line' ).line;
exports.cuboidZone          = require( 'zones/cuboid' ).cuboid;
exports.sphereZone          = require( 'zones/sphere' ).sphere;
exports.asyncZone           = require( 'zones/async' ).async;
exports.arrayZone           = require( 'zones/array' ).array;

exports.translateZone       = require( 'zones/translate' ).translate;
