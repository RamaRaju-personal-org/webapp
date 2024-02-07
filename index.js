require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
// const checkPayload = require("./middleware/checkPayload");
// const checkQueryParams = require("./middleware/checkQueryParams");
const mainRoute = require('./api-routes/mainRoute');
const { initializeDatabase } = require('./models/mysql-db-connect');
const Sequelize = require('sequelize'); // Make sure to have Sequelize for checking DB errors

// Use bodyParser middleware to parse JSON requests
app.use(bodyParser.json());

// Custom middlewares
// app.use(checkPayload);
// app.use(checkQueryParams);

// Main route
app.use('/', mainRoute);


// Global error handler
app.use((err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes
  res.status(503).json({ error: 'Service Unavailable' }); // Respond with 503 for any error
});

const PORT = process.env.PORT || 3307;

// Initialize the database
initializeDatabase().then(() => {
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Error initializing database:', error);
  // Consider handling fatal startup errors more gracefully here
  // For example, you might want to shut down the application or alert an admin
});
