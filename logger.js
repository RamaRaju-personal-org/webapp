const fs = require('fs-extra');
const Logger = require('node-json-logger');

// Define the log file path
const logFilePath = '/var/log/google-cloud-ops-agent/myapp.log';

// Ensure the log file exists before attempting to write to it
fs.ensureFileSync(logFilePath);

// Create a write stream for the logger
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Logger configuration
const options = {
  // The default level is not necessary since we're specifying it manually below
  stream: logStream
};

// Create a new logger instance with the above options
const logger = new Logger(options);

// Function to write a log entry with the appropriate severity level
function writeLogEntry(message, level) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    severity: level.toUpperCase(),
    message: typeof message === 'string' ? message : JSON.stringify(message)
  };

  // Ensure that the log entry is a single line of JSON
  logStream.write(`${JSON.stringify(logEntry)}\n`);
}

// Map of log functions by severity level
const logFunctions = {
  info: (message) => writeLogEntry(message, 'INFO'),
  warn: (message) => writeLogEntry(message, 'WARNING'),
  error: (message) => writeLogEntry(message, 'ERROR'),
  fatal: (message) => writeLogEntry(message, 'CRITICAL'),
  debug: (message) => writeLogEntry(message, 'DEBUG'),
};

// Export the log functions
module.exports = logFunctions;

// Handle uncaught exceptions and unhandled promise rejections with logging
process.on('uncaughtException', (err) => {
  logFunctions.error('There was an uncaught error', err);
  process.exit(1); // Exiting the process after logging
});

process.on('unhandledRejection', (reason, promise) => {
  logFunctions.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
