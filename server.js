const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./data/database');
const app = express();

// Load Config
dotenv.config({ path: './.env' });

connectDB();

const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use('/', require('./routes'));

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
