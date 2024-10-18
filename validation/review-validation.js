const { body, param } = require('express-validator');

// Validation for adding a review
const validateAddReview = [
    body('user')
        .isString()
        .withMessage('User ID must be a string')
        .notEmpty()
        .withMessage('User ID is required'),
    body('car')
        .isString()
        .withMessage('Car ID must be a string')
        .notEmpty()
        .withMessage('Car ID is required'),
    body('rating')
        .isNumeric()
        .withMessage('Rating must be a number')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('comment')
        .isString()
        .withMessage('Comment must be a string')
        .isLength({ max: 500 })
        .withMessage('Comment must not exceed 500 characters')
];

// Validation for getting a review by review and reviewId
const validateGetReview = [
    param('review')
        .isString()
        .withMessage('Review must be a string')
        .notEmpty()
        .withMessage('Review is required'),
    param('reviewId')
        .isString()
        .withMessage('Review ID must be a string')
        .notEmpty()
        .withMessage('Review ID is required')
];

// Validation for deleting a review by review and reviewId
const validateDeleteReview = [
    param('review')
        .isString()
        .withMessage('Review must be a string')
        .notEmpty()
        .withMessage('Review is required'),
    param('reviewId')
        .isString()
        .withMessage('Review ID must be a string')
        .notEmpty()
        .withMessage('Review ID is required')
];

module.exports = {
    validateAddReview,
    validateGetReview,
    validateDeleteReview
};
