const swaggerAutogen = require('swagger-autogen')();
// Import 'spawn' from the 'child_process' module
const { spawn } = require('child_process');

// Set Environment-specific configurations
const isProduction = process.env.NODE_ENV === 'production';

const doc = {
  info: {
    title: 'CSE 341 Final Project - API',
    description:
      'CSE 341 Final Project for Tiffany Voorhees and Luke Briggs and Jonathan Aloya',
  },
  host: isProduction
    ? 'cse341-teamproject-carshop.onrender.com'
    : 'localhost:3001',
  schemes: isProduction ? ['https'] : ['http'],
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc).then(() => {
  console.log('Swagger documentation generated successfully!');

  //After generating, start the appropriate server
  const serverCommand = isProduction ? 'node' : 'npx';
  const serverArgs = isProduction ? ['server.js'] : ['nodemon','server.js'];

  const server = spawn(serverCommand, serverArgs, {
    stdio: 'inherit', //Pipe the output to the current process
    shell: true, // Ensures cross-platform compatibility (Windows/Linux/Mac)
  });

  // Handle any errors in the child process
  server.on('error', (err) => {
    console.error(`Failed to start server: ${err.message}`);
  });

  // Exit event
  server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
});
