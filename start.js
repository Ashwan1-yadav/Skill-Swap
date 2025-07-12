#!/usr/bin/env node

/**
 * Skill Swap Application Startup Script
 * This script handles environment setup and starts the server
 */

const app = require('./app');
const debug = require('debug')('skill-swap:server');
const http = require('http');

// Get port from environment and store in Express
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Listen on provided port, on all network interfaces
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  
  console.log('🚀 Skill Swap Server is running on ' + bind);
  console.log('📱 Frontend available at: http://localhost:' + addr.port);
  console.log('🔗 API endpoints available at: http://localhost:' + addr.port + '/userModel');
  console.log('📊 Database: MongoDB connected');
  console.log('🔐 Authentication: JWT enabled');
  console.log('✨ Ready to swap skills!');
  
  debug('Listening on ' + bind);
} 