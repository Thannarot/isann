'use strict';

var validator = require('validator'),
	path = require('path'),
	db = require(path.resolve('./config/lib/db')),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Load environment variables

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {

	var safeUserObject = null;

	if (req.user) {
		safeUserObject = {
			displayName: validator.escape(req.user.displayName),
			provider: validator.escape(req.user.provider),
			username: validator.escape(req.user.username),
			createdAt: req.user.createdAt.toString(),
			roles: req.user.dataValues.roles,
			profileImageURL: req.user.profileImageURL,
			email: validator.escape(req.user.email),
			lastName: validator.escape(req.user.lastName),
			firstName: validator.escape(req.user.firstName),
			additionalProvidersData: req.user.additionalProvidersData
		};
	}

	res.render('modules/core/server/views/index', {
		user: safeUserObject
	});
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
	res.status(500).render('modules/core/server/views/500', {
		error: 'Oops! Something went wrong...'
	});
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

	res.status(404).format({
		'text/html': function () {
			res.render('modules/core/server/views/404', {
				url: req.originalUrl
			});
		},
		'application/json': function () {
			res.json({
				error: 'Path not found'
			});
		},
		'default': function () {
			res.send('Path not found');
		}
	});
};

exports.getPlaces = function (req, res) {

	db.any("SELECT * FROM ela_places")
		.then(data => {
			// success
			res.setHeader("Content-Type", "application/json");
			res.send(JSON.stringify(data));
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error;
			console.log('ERROR');
		});
};

exports.getTourism = function (req, res) {

	db.any("SELECT * FROM ela_places where tid=1")
		.then(data => {
			// success
			res.setHeader("Content-Type", "application/json");
			res.send(JSON.stringify(data));
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error;
			console.log('ERROR');
		});
};

exports.getHotel = function (req, res) {

	db.any("SELECT * FROM ela_places where tid=2")
		.then(data => {
			// success
			res.setHeader("Content-Type", "application/json");
			res.send(JSON.stringify(data));
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error;
			console.log('ERROR');
		});
};

exports.getResturant = function (req, res) {

	db.any("SELECT * FROM ela_places where tid=6")
		.then(data => {
			// success
			res.setHeader("Content-Type", "application/json");
			res.send(JSON.stringify(data));
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error;
			console.log('ERROR');
		});
};

exports.filterPlace = function (req, res) {
    var params = req.query; 
    // Ensure parameters have default values
    var pname = params.pname !== undefined ? params.pname : '';
    var distance = params.distance !== undefined ? parseFloat(params.distance) : 0;
    var rating = params.rating !== undefined ? parseFloat(params.rating) : 5;
    var ptype = params.ptype !== undefined ? params.ptype : 9999;
    var adm1 = params.adm1 !== undefined ? params.adm1 : 9999;
    var adm2 = params.adm2 !== undefined ? params.adm2 : 9999;
    var adm3 = params.adm3 !== undefined ? params.adm3 : 9999;
    var lat = params.geolocate_lat !== undefined ? parseFloat(params.geolocate_lat) : null;
    var lng = params.geolocate_lng !== undefined ? parseFloat(params.geolocate_lng) : null;

    var main_sql = "SELECT * FROM ela_places JOIN ela_district ON adm2 = ela_district.id_2 WHERE 1=1";

    // Add filters only if values are valid
    if (!isNaN(rating)) main_sql += ` AND rating <= ${rating}`;
    if (pname !== '') main_sql += ` AND name LIKE '%${pname}%'`;
    if (ptype !== 9999) main_sql += ` AND tid = ${ptype}`;
    if (adm1 !== 9999) main_sql += ` AND id_1 = ${adm1}`;
    if (adm2 !== 9999) main_sql += ` AND adm2 = ${adm2}`;
    if (adm3 !== 9999) main_sql += ` AND adm3 = ${adm3}`;

    if (!isNaN(lat) && !isNaN(lng)) {
        main_sql += ` AND ST_DWithin(
            ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography, 
            ST_GeomFromText('POINT(${lng} ${lat})', 4326)::geography, 
            ${distance * 1000}
        )`;
    }

    var query = main_sql + " ORDER BY pid ASC;";
    db.any(query)
        .then(data => {
            res.setHeader("Content-Type", "application/json");
            res.json(data);
        })
        .catch(error => {
            console.error("Database Query Error:", error);
            res.status(500).json({ error: "Database query failed", details: error });
        });
};


exports.getProvinceList = function (req, res) {
	db.any("SELECT * FROM ela_province where region='north-east';")
		.then(data => {
			// success
			res.setHeader("Content-Type", "application/json");
			res.send(JSON.stringify(data));
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error;
			console.log('ERROR');
		});
};


exports.getCityList = function (req, res) {
	var params = req.params;
	var prov_id = params.prov_id;
	db.any("SELECT * FROM ela_district where region='north-east' AND id_1 = " + prov_id)
		.then(data => {
			// success
			res.setHeader("Content-Type", "application/json");
			res.send(JSON.stringify(data));
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error;
			console.log('ERROR');
		});
};

exports.getTownshipList = function (req, res) {
	var params = req.params;
	var dist_id = params.dist_id;
	db.any("SELECT * FROM ela_township where region='north-east' AND id_2 = " + dist_id)
		.then(data => {
			// success
			res.setHeader("Content-Type", "application/json");
			res.send(JSON.stringify(data));
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error;
			console.log('ERROR');
		});
};


exports.getPlaceTypeList = function (req, res) {

	db.any("SELECT * FROM ela_placetypes")
		.then(data => {
			// success
			res.setHeader("Content-Type", "application/json");
			res.send(JSON.stringify(data));
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error;
			console.log('ERROR');
		});
};

exports.getDetail = function (req, res) {
	var params = req.params;
	var pid = params.pid;
	var query = "SELECT * FROM ela_places JOIN ela_district ON adm2 = ela_district.id_2 WHERE pid=" + pid;
	db.any(query)
		.then(data => {
			// success
			res.setHeader("Content-Type", "application/json");
			res.send(JSON.stringify(data));
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error;
			console.log('ERROR');
		});
};

exports.deletePlace = function (req, res) {
	var params = req.params;
	var pid = params.pid;
	var query = "DELETE FROM ela_places WHERE pid=" + pid;
	db.any(query)
		.then(data => {
			// success
			res.setHeader("Content-Type", "application/json");
			res.send(JSON.stringify(data));
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error;
			console.log('ERROR');
		});
};

exports.addNewPlace = function (req, res) {
	var params = req.params;
	var val_params = "('" + params.pname + "'," + params.plat + "," + params.plng + ",'" + params.desc + "','" + params.entrance_fee + "','" + params.store + "','" + params.cellular_net + "','" + params.travel + "','" + params.agency + "','" + params.plocation + "','" + params.gmap + "','" + params.infosource + "','" + params.photosource + "','" + params.extralink + "','" + params.facilities + "','" + params.contactinfo + "'," + params.ptype + "," + params.adm2 + "," + params.adm3 + "," + params.rating + ", '" + params.imgfeatured + ", '" + params.facilitiesList +"')";
	var query = "INSERT INTO ela_places (name, lat, lng, description, entrance_fee, store, cellular_net, travel, agency, location, gmap, infosource, photosource, extralink, facilities, contactinfo, tid, adm2, adm3, rating, imgfeatured, facilities_list) VALUES " + val_params + "";
	db.any(query)
		.then(data => {
			// success
			res.setHeader("Content-Type", "application/json");
			res.send(JSON.stringify(data));
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error;
			console.log('ERROR');
		});
};

exports.editPlace = function (req, res) {
	var params = req.params;
	var pid = params.pid;
	var name = "name='" + params.pname + "',";
	var lat = "lat=" + params.plat + ",";
	var lng = "lng=" + params.plng + ",";
	var description = "description='" + params.desc + "',";
	var entrance_fee = "entrance_fee='" + params.entrance_fee + "',";
	var store = "store='" + params.store + "',";
	var cellular_net = "cellular_net='" + params.cellular_net + "',";
	var travel = "travel='" + params.travel + "',";
	var agency = "agency='" + params.agency + "',";
	var location = "location='" + params.plocation + "',";
	var gmap = "gmap='" + params.gmap + "',";
	var infosource = "infosource='" + params.infosource + "',";
	var photosource = "photosource='" + params.photosource + "',";
	var extralink = "extralink='" + params.extralink + "',";
	var facilities = "facilities='" + params.facilities + "',";
	var contactinfo = "contactinfo='" + params.contactinfo + "',";
	var tid = "tid=" + params.ptype + ",";
	var adm2 = "adm2=" + params.adm2 + ",";
	var adm3 = "adm3=" + params.adm3 + ",";
	var rating = "rating=" + params.rating + ", ";
	var imgfeatured = "imgfeatured='" + params.imgfeatured + "', ";
	var facilitiesList = "facilities_list='" + params.facilitiesList + "' ";
	// var audio = "audio='" + params.audio + "' ";

	var query = "UPDATE ela_places SET " + name + lat + lng + description + entrance_fee + store + cellular_net + travel + agency + location + gmap + infosource + photosource + extralink + facilitiesList + contactinfo + tid + adm2 + adm3 + rating + imgfeatured + facilities +" WHERE pid=" + pid
	db.any(query)
		.then(data => {
			// success
			res.setHeader("Content-Type", "application/json");
			res.send(JSON.stringify(data));
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error;
			console.log('ERROR');
		});
};


exports.getAdminPassword = function (req, res) {
	db.any("SELECT * FROM ela_users where username='admin'")
		.then(data => {
			// success
			res.setHeader("Content-Type", "application/json");
			res.send(JSON.stringify(data));
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error;
			console.log('ERROR');
		});
};

exports.getAdminPasswordHash = function (req, res) {
	// Get the password securely from environment variables
	const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "fallbackpassword"; // Default if env is missing
	// Hash the password before sending (This prevents exposure)
	bcrypt.hash(ADMIN_PASSWORD, 10, function (err, hash) {
		if (err) {
			return res.status(500).json({ error: "Error generating password hash" });
		}
		res.json({ passwordHash: hash });
	});
};
// API to validate admin login
exports.validateAdminLogin = function (req, res) {
    const userPassword = req.body.password; // Password entered by the user
	const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "fallbackpassword"; 
    // Compare input password with stored password
    if (userPassword === ADMIN_PASSWORD) {
        console.log("Password match, login successful!");
        return res.json({ success: true });
    } else {
        console.log("Password mismatch!");
        return res.status(401).json({ error: "Invalid password" });
    }
};