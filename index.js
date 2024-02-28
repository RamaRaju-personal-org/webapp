require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Your routes and middleware
const mainRoute = require('./api-routes/mainRoute');
const { initializeDatabase } = require('./models/mysql-db-connect');

app.use(bodyParser.json());
app.use('/', mainRoute);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(503).json({ error: 'Service Unavailable' });
});

// This function starts the server and is called only when this file is run directly
function startServer() {
  const PORT = process.env.PORT || 3307;
  initializeDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }).catch(error => {
    console.error('Error initializing database:', error);
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
