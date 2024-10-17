const swaggerAutogen = require('swagger-autogen')();

//Use this for DEV
const doc = {
  info: {
    title: 'CSE 341 Final Project - API',
    description: 'CSE 341 Final Project for Tiffany Voorhees and Luke Briggs and Jonathan Aloya',
  },
  host: 'localhost:3001',
  schemes: ['http', 'https'],
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
