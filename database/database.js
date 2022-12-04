// get the module "sequelize" to make a connection with the database
const Sequelize = require("sequelize");

// [...] = new Sequelize(database name, database user, database password, server [host: where's the server, dialect: what's the database])
const connection = new Sequelize("guia_press", "root", "breno8anos", {host: 'localhost', dialect: 'mysql', timezone: '-03:00'});

// exporting the module 'connection' where the server is
module.exports = connection;  