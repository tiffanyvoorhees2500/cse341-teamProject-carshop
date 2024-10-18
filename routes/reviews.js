const routes = require('express').Router();
const reviewController = require('../controllers/reviewController');
const utilities = require('../utilities/index.js');
const reviewRules = require('../validation/review-validation.js');
const { ensureLogin, ensureAdmin } = require('../validation/auth-validation.js');

// GET Review Route... Must be logged in to see
routes.get('/', reviewRules.validateGetReview, reviewController.getReviews, utilities.handleErrors);
routes.get(
  '/:reviewId',
  reviewRules.validateGetReview, 
  reviewController.getReviewById,
  utilities.handleErrors
);

// POST Review... Must be logged and admin to add new reviews
routes.post(
  '/',
  ensureLogin,
  reviewRules.validateAddReview,
  utilities.validate,
  reviewController.addReview,
  utilities.handleErrors
);

// UPDATE Review Route... Must be logged in and admin to edit reviews
routes.put(
  '/:reviewId',
  ensureLogin,
  reviewRules.validateAddReview,
  utilities.validate,
  reviewController.editReviewById,
  utilities.handleErrors
);

// DELETE Review Route... Must be logged in and admin to edit reviews
routes.delete(
  '/:reviewId',
  reviewRules.validateDeleteReview,
  ensureLogin,
  ensureAdmin,
  reviewController.deleteReviewById,
  utilities.handleErrors
);

module.exports = routes;
