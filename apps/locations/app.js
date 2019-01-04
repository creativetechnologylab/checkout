var __home = __dirname + "/../..";
var __src = __home + '/src';
var __js = __src + '/js';

var	express = require( 'express' ),
	app = express();

var db = require( __js + '/database' )(),
	Locations = db.Locations,
	Items = db.Items;

var auth = require( __js + '/authentication' );

app.set( 'views', __dirname + '/views' );

app.get( '/', auth.isLoggedIn, function ( req, res ) {
	Locations.get( function( err, locations ) {
		res.render( 'index', { locations: locations } );
	} )
} );

app.get( '/create', auth.isLoggedIn, function ( req, res ) {
	res.render( 'create', { location: {} } );
} )

app.post( '/create', auth.isLoggedIn, function( req, res ) {
	if ( req.body.name == '' ) {
		req.flash( 'danger', 'The location requires a name' );
		res.redirect( app.mountpath + '/create' );
	}

	Locations.create( req.body.name, function( err, result ) {
		if ( err ) {
			req.flash( 'danger', 'Location not created' );
			res.redirect( app.mountpath );
		} else {
			req.flash( 'success', 'Location created' );
			res.redirect( app.mountpath );
		}
	} );
} )

app.get( '/:id/edit', auth.isLoggedIn, function( req, res ) {
	Locations.getById( req.params.id, function( err, location ) {
		if ( ! location ) {
			req.flash( 'danger', 'Location not found' );
			res.redirect( app.mountpath );
		} else {
			res.render( 'edit', { location: location } );
		}
	} )
} )

app.post( '/:id/edit', auth.isLoggedIn, function( req, res ) {
	if ( req.body.name == '' ) {
		req.flash( 'danger', 'The location requires a name' );
		res.redirect( app.mountpath + '/edit' );
	}

	Locations.update( req.params.id, req.body.name, function( err ) {
		if ( err ) {
			req.flash( 'danger', 'Location not updated' );
			res.redirect( app.mountpath );
			console.log( err );
		} else {
			req.flash( 'success', 'Location updated' );
			res.redirect( app.mountpath );
		}
	} );
} )

app.get( '/:id/remove', auth.isLoggedIn, function( req, res ) {
	Locations.get( function( err, locations ) {
		var selected = locations.filter( function( location ) {
			return ( location.id == req.params.id ? location : null );
		} );

		if ( selected[0] ) selected = selected[0];

		var list = locations.filter( function( location ) {
			if ( location.id == req.params.id ) location.disabled = true;
			return location;
		} );

		if ( selected ) {
			res.render( 'confirm-remove', {
				selected: selected,
				locations: list
			} );
		} else {
			req.flash( 'danger', 'Locations not found' );
			res.redirect( app.mountpath );
		}
	} )
} )

app.post( '/:id/remove', auth.isLoggedIn, function( req, res ) {
	Locations.getById( req.params.id, function( err, location_to_remove ) {
		if ( ! location_to_remove ) {
			req.flash( 'danger', 'Location not found' );
			res.redirect( app.mountpath );
			return;
		}
		Locations.getById( req.body.location, function( err, location_to_become ) {
			if ( ! location_to_become ) {
				req.flash( 'danger', 'New location not found' );
				res.redirect( app.mountpath );
				return;
			}

			Items.updateLocation( location_to_remove.id, location_to_become.id, function( err ) {
				if ( err ) {
					req.flash( 'danger', 'Could not transfer items to new location' );
					res.redirect( app.mountpath );
					return;
				}

				Locations.remove( location_to_remove.id, function( err ) {
					if ( err ) {
						req.flash( 'danger', 'Could not remove location' );
						res.redirect( app.mountpath );
						return;
					}

					req.flash( 'success', 'Location deleted and items transferred' );
					res.redirect( app.mountpath );
				} );
			} );
		} );
	} );
} )

module.exports = function( config ) { return app; };