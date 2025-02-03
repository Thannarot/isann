'use strict';
const config = require('../config');
const pgp = require('pg-promise')({
    connect: (client) => {
        console.log('Connected to PostgreSQL server.');
    },
    error: (err) => {
        console.error('Error in PostgreSQL connection:', err);
    }
});

const dbconfig = {
    database: config.db.options.database,
	host: config.db.options.host,
	user: config.db.options.user,
	password: config.db.options.password,
	port: config.db.options.port,
};

const db = pgp(dbconfig);

(async () => {
    try {
        console.log("Attempting to connect to the database...");
        const obj = await db.connect();
        console.log("Database connected successfully!");
        obj.done();
    } catch (error) {
        console.error("Database connection failed:", error.message);
        console.error("Detailed error:", error);
    }
})();

module.exports = db;
