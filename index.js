require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const mainRoute = require('./api-routes/mainRoute');
const { initializeDatabase } = require('./models/mysql-db-connect');
const Sequelize = require('sequelize'); 

app.use(bodyParser.json());


app.use('/', mainRoute);


app.use((err, req, res, next) => {
  console.error(err); 
  res.status(503).json({ error: 'Service Unavailable' }); 
});

const PORT = process.env.PORT || 3307;

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Error initializing database:', error);
  
});
