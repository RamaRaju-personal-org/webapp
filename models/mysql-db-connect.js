// Filename: mysql-db-connect.js

const dotenv = require('dotenv');
dotenv.config();
const Sequelize = require('sequelize');

let databaseInitialized = false; // Prevent multiple initializations

async function initializeDatabase() {
  if (databaseInitialized) {
    console.log("Database initialization already in progress or completed.");
    return;
  }
  databaseInitialized = true;

  const tempSequelize = new Sequelize('', process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
  });

  console.log('Starting database initialization...');
  
  try {
    console.log('Attempting to drop the database if it exists...');
    await tempSequelize.query(`DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\`;`);
    console.log('Database dropped successfully.');

    console.log('Attempting to create the database...');
    await tempSequelize.query(`CREATE DATABASE \`${process.env.DB_NAME}\`;`);
    console.log('Database created successfully.');

    await tempSequelize.close();

    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      dialect: 'mysql',
      host: process.env.DB_HOST,
    });

    console.log('Reconnecting to the new database...');
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    return sequelize;
  } catch (error) {
    console.error('Unable to initialize the database:', error);
    process.exit(1); // Consider more graceful error handling for production
  }
}

module.exports = { initializeDatabase };
