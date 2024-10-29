const request = require('supertest');
const express = require('express');
const reviewRoutes = require('../../routes/reviews');
const reviewController = require('../../controllers/reviewController');
const {
  ensureLogin,
  ensureAdmin,
} = require('../../validation/auth-validation');
const reviewRules = require('../../validation/review-validation');
const utilities = require('../../utilities/index');

// Mock the required middleware and controller methods
jest.mock('../../validation/auth-validation', () => ({
  ensureLogin: jest.fn((req, res, next) => next()),
  ensureAdmin: jest.fn((req, res, next) => next()),
}));

jest.mock('../../validation/review-validation', () => ({
  validateGetReview: jest.fn((req, res, next) => next()),
  validateAddReview: jest.fn((req, res, next) => next()),
  validateDeleteReview: jest.fn((req, res, next) => next()),
}));

jest.mock('../../utilities/index', () => ({
  handleErrors: jest.fn((err, req, res, next) => next(err)),
  validate: jest.fn((req, res, next) => next()),
}));

jest.mock('../../controllers/reviewController', () => ({
  getReviews: jest.fn((req, res) => res.status(200).json({ message: 'Reviews fetched' })),
  getReviewById: jest.fn((req, res) => res.status(200).json({ message: 'Review fetched by ID' })),
  addReview: jest.fn((req, res) => res.status(201).json({ message: 'Review added' })),
  editReviewById: jest.fn((req, res) => res.status(202).json({ message: 'Review updated' })),
  deleteReviewById: jest.fn((req, res) => res.status(204).json({ message: 'Review deleted' })),
}));

describe('Review Routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/reviews', reviewRoutes);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /reviews', () => {
    it('should call validateGetReview middleware and getReviews controller', async () => {
      await request(app).get('/reviews');

      expect(reviewRules.validateGetReview).toHaveBeenCalled();
      expect(reviewController.getReviews).toHaveBeenCalled();
    });
  });

  describe('GET /reviews/:reviewId', () => {
    it('should call validateGetReview middleware and getReviewById controller', async () => {
      await request(app).get('/reviews/review123');

      expect(reviewRules.validateGetReview).toHaveBeenCalled();
      expect(reviewController.getReviewById).toHaveBeenCalled();
    });
  });

  describe('POST /reviews', () => {
    it('should apply ensureLogin, validateAddReview, and call addReview controller', async () => {
      await request(app).post('/reviews').send({
        carId: '670fee462c904f621ec06b12',
        rating: 5,
        comment: 'Great car!',
      });

      expect(ensureLogin).toHaveBeenCalled();
      expect(reviewRules.validateAddReview).toHaveBeenCalled();
      expect(utilities.validate).toHaveBeenCalled();
      expect(reviewController.addReview).toHaveBeenCalled();
    });
  });

  describe('PUT /reviews/:reviewId', () => {
    it('should apply ensureLogin, validateAddReview, and call editReviewById controller', async () => {
      await request(app)
        .put('/reviews/review123')
        .send({ rating: 4, comment: 'Updated comment' });

      expect(ensureLogin).toHaveBeenCalled();
      expect(reviewRules.validateAddReview).toHaveBeenCalled();
      expect(utilities.validate).toHaveBeenCalled();
      expect(reviewController.editReviewById).toHaveBeenCalled();
    });
  });

  describe('DELETE /reviews/:reviewId', () => {
    it('should apply validateDeleteReview, ensureLogin, ensureAdmin, and call deleteReviewById controller', async () => {
      await request(app).delete('/reviews/review123');

      expect(reviewRules.validateDeleteReview).toHaveBeenCalled();
      expect(ensureLogin).toHaveBeenCalled();
      expect(ensureAdmin).toHaveBeenCalled();
      expect(reviewController.deleteReviewById).toHaveBeenCalled();
    });
  });
});
