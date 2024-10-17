const { body } = require('express-validator');

const carValidationRules = () => {
  return [
    body('brandName')
      .trim()
      .escape()
      .notEmpty()
      .isString()
      .withMessage('An brand name is requires'),
    body('model')
      .trim()
      .notEmpty()
      .isString()
      .withMessage('Model is required.'),
    body('year')
      .trim()
      .notEmpty()
      .isInt()
      .isLength({ min: 4, max: 4 })
      .withMessage('This must be a 4 digit year'),
    body('engine')
      .trim()
      .notEmpty()
      .isString()
      .withMessage('Model is required.'),
    body('horsepower')
      .trim()
      .notEmpty()
      .isInt()
      .withMessage('Horsepower must be a number.'),
    body('top_speed')
      .trim()
      .notEmpty()
      .isString()
      .withMessage('Top Speed is required.'),
  ];
};

module.exports = {
  carValidationRules,
};
