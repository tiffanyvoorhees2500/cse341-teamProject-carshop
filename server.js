const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const connectDB = require('./data/database');
const app = express();

// Load Config
dotenv.config({ path: './.env' });

// Passport Config
require('./passport')(passport);

connectDB();

const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
  })
);
// init passport on every route call
app.use(passport.initialize())
app.use(passport.session())
// Used for Swagger/Rest API calls & allows passport to use "express-session"
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
app.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }))
app.use(cors({ origin: '*' }))

app.use('/', require('./routes'));

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
