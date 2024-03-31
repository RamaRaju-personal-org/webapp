require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const logger = require('./logger'); 



// Your routes and middleware
const mainRoute = require('./api-routes/mainRoute');
const { initializeDatabase } = require('./models/mysql-db-connect');

app.use(bodyParser.json());
app.use('/', mainRoute);

// Logging middleware for incoming requests
app.use((req, res, next) => {
  // logger.debug({message: 'Request received', method: req.method, url: req.originalUrl});
  next();
});

// Centralized error handling
app.use((err, req, res, next) => {
  // logger.error({message: 'Unhandled exception', error: err.message});
  res.status(503).json({ error: 'Service Unavailable' });
});





// This function starts the server and is called only when this file is run directly
function startServer() {
  const PORT = process.env.PORT || 80;
  initializeDatabase().then(() => {
    app.listen(PORT, () => {
      logger.info({message: `Server is running on port ${PORT}`});
    });
  }).catch(error => {
    logger.error({message: 'Error initializing database', error: error.toString()});
  });
}

// Export the app for testing
module.exports = app;

// The following code checks if this file is the main module and starts the server.
// This is a common pattern for allowing a file to be imported by other modules for testing or other purposes,
// while still being able to run it directly to start the server.
if (require.main === module) {
  startServer();
}
