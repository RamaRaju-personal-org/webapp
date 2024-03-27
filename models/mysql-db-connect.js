const dotenv = require('dotenv');
dotenv.config();
const Sequelize = require('sequelize');

let sequelizeInstance = null;

async function initializeDatabase() {
  if (sequelizeInstance) {
    return sequelizeInstance;
  }

  const tempSequelize = new Sequelize('', process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    logging: console.log,
  });

  try {
    await tempSequelize.authenticate();
    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await tempSequelize.close();

    sequelizeInstance = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      dialect: 'mysql',
      host: process.env.DB_HOST,
      logging: console.log,
    });

    await sequelizeInstance.authenticate();

    console.log('Connection to the database has been established successfully.');
    return sequelizeInstance;
  } catch (error) {
    console.error('Unable to initialize the database:', error);
    process.exit(1);
  }
}

module.exports = { initializeDatabase };
