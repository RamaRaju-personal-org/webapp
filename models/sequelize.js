// Filename: ../../models/sequelize.js

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Extracting environment variables
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;

// Creating a new Sequelize instance with the database connection details
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql',
  logging: false, // Set to console.log to enable logging of SQL queries
  pool: {
    max: 5, // Maximum number of connection in pool
    min: 0, // Minimum number of connection in pool
    acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000 // The maximum time, in milliseconds, that a connection can be idle before being released
  }
});

// Export the sequelize instance for use in other parts of the application
module.exports = sequelize;
