var __home = __dirname + '/../..';
var __config = __home + '/config/config.json';

var session = require( 'express-session' ),
	config = require( __config ),
	cookie = require('cookie-parser'),
	passport = require( 'passport' )
	passportSocketIo = require('passport.socketio');

var MongoDBStore = require( 'connect-mongodb-session' )( session );

module.exports =  function( app, io ) {
	app.use( cookie() );
	app.use( session( {
		secret: config.secret,
		cookie: { maxAge: 31*24*60*60*1000 },
		saveUninitialized: false,
		resave: false,
		rolling: true
	} ) );

	var store = new MongoDBStore( {
		uri: config.mongo,
		collection: 'sessionStore'
	} );
	store.on( 'error', function( error ) {
		console.log( error );
	} );

	io.use( passportSocketIo.authorize( {
		key: 'connect.sid',
		secret: config.secret,
		store: store,
		passport: passport,
		cookieParser: cookie
	} ) );

	app.use( passport.initialize() );
	app.use( passport.session() );
};