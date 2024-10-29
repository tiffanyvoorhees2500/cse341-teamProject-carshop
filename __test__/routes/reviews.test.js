const request = require('supertest');
const express = require('express');
const reviewRoutes = require('../../routes/reviews');
const Review = require('../../models/Review');
const {
  ensureLogin,
  ensureAdmin,
} = require('../../validation/auth-validation');
const reviewRules = require('../../validation/review-validation');
const utilities = require('../../utilities');

// Apply mocks to modules
jest.mock('../../validation/auth-validation', () => ({
  ensureLogin: jest.fn((req, res, next) => next()),
  ensureAdmin: jest.fn((req, res, next) => next()),
}));

jest.mock('../../validation/review-validation', () => ({
  validateGetReview: jest.fn((req, res, next) => next()),
  validateAddReview: jest.fn((req, res, next) => next()),
  validateDeleteReview: jest.fn((req, res, next) => next()),
}));

jest.mock('../../utilities', () => ({
  handleErrors: jest.fn((req, res, next) => next()),
  validate: jest.fn((req, res, next) => next()),
}));

// Mock Review model
jest.mock('../../models/Review', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

describe('Review Route Middleware Tests', () => {
  const app = express();
  app.use(express.json());
  app.use('/reviews', reviewRoutes);

  it('should apply validateGetReview middleware on GET /reviews', async () => {
    const mockReviews = [{ title: 'Great product' }, { title: 'Not so great' }];
    Review.find.mockResolvedValue(mockReviews);

    await request(app).get('/reviews');

    expect(reviewRules.validateGetReview).toHaveBeenCalled();
  });

  it('should apply validateGetReview middleware on GET /reviews/:reviewId', async () => {
    const mockReview = { _id: '1', title: 'Amazing service' };
    Review.findById.mockResolvedValue(mockReview);

    await request(app).get('/reviews/1');

    expect(reviewRules.validateGetReview).toHaveBeenCalled();
  });

  it('should apply ensureLogin and validateAddReview middleware on POST /reviews', async () => {
    const mockNewReview = { title: 'Great product!' };
    Review.create.mockResolvedValue(mockNewReview);

    await request(app)
      .post('/reviews')
      .send({ title: 'Great product!' });

    expect(ensureLogin).toHaveBeenCalled();
    expect(reviewRules.validateAddReview).toHaveBeenCalled();
    expect(utilities.validate).toHaveBeenCalled();
  });

  it('should apply ensureLogin and validateAddReview middleware on PUT /reviews/:reviewId', async () => {
    const mockUpdatedReview = { _id: '1', title: 'Updated review title' };
    Review.findByIdAndUpdate.mockResolvedValue(mockUpdatedReview);

    await request(app)
      .put('/reviews/1')
      .send({ title: 'Updated review title' });

    expect(ensureLogin).toHaveBeenCalled();
    expect(reviewRules.validateAddReview).toHaveBeenCalled();
    expect(utilities.validate).toHaveBeenCalled();
  });

  it('should apply validateDeleteReview, ensureLogin, and ensureAdmin middleware on DELETE /reviews/:reviewId', async () => {
    Review.findByIdAndDelete.mockResolvedValue({ _id: '1', title: 'Review to delete' });

    await request(app).delete('/reviews/1');

    expect(reviewRules.validateDeleteReview).toHaveBeenCalled();
    expect(ensureLogin).toHaveBeenCalled();
    expect(ensureAdmin).toHaveBeenCalled();
  });
});
