const { body } = require('express-validator');

const brandValidationRules = () => {
  return [
    body('brandName')
      .trim()
      .escape()
      .notEmpty()
      .isString()
      .withMessage('An brand name is requires'),
  ];
};

module.exports = {
    brandValidationRules,
};
