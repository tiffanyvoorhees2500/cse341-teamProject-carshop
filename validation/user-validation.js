const { body } = require('express-validator');

const userValidationRules = () => {
  return [
    body('userType')
      .trim()
      .escape()
      .notEmpty()
      .isString()
  ];
};

module.exports = {
    userValidationRules,
};
