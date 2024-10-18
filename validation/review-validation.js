const { body, param } = require('express-validator');

// Validation for adding a review
const validateAddReview = [
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
    param('reviewId')
        .isString()
        .withMessage('Review ID must be a string')
        .notEmpty()
        .withMessage('Review ID is required')
];

// Validation for deleting a review by review and reviewId
const validateDeleteReview = [
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
