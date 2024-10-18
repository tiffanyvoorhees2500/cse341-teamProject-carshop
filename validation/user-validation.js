const { body } = require('express-validator');

const userValidationRules = () => {
  return [
    body('isAdmin')
      .trim()
      .escape()
      .notEmpty()
      .isBoolean()
      .withMessage('Must be true or false'),
  ];
};

module.exports = {
    userValidationRules,
};
