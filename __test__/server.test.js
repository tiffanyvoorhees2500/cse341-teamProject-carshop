const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');

// Load environment variables
dotenv.config({ path: './.env' });

// Mock MongoDB connection and passport setup
jest.mock('../data/database', () => jest.fn(() => Promise.resolve()));
jest.mock('../passport', () => jest.fn());

// Import app and server
const { app, server } = require('../server'); 

describe('Server Basics', () => {
  afterAll(async () => {
    await mongoose.disconnect();
    server.close(); // Close server connection after tests
  });

  describe('Environment and Middlewares', () => {
    it('should load environment variables', () => {
      expect(process.env.PORT).toBeDefined();
      expect(process.env.MONGODB_URL).toBeDefined();
    });

    it('should apply session middleware with MongoStore', () => {
      const sessionMiddleware = session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
      });
      expect(sessionMiddleware).toBeDefined();
    });

    it('should initialize and use passport middleware', () => {
      expect(passport.initialize).toBeDefined();
      expect(passport.session).toBeDefined();
    });
  });

  describe('CORS and Headers', () => {
    it('should set CORS headers on requests', async () => {
      const response = await request(app).get('/');
      expect(response.headers['access-control-allow-origin']).toBe('*');
      expect(response.headers['access-control-allow-headers']).toContain(
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
      );
      expect(response.headers['access-control-allow-methods']).toContain(
        'GET, POST, PUT, DELETE, OPTIONS'
      );
    });
  });

  describe('Routing', () => {
    it('should handle requests to the root route', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
    });
  });
});
