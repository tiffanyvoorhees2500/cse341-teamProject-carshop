const routes = require('express').Router();
const carController = require('../controllers/carController');
const utilities = require('../validation/');
// const carRules = require('../utilities/car-validation.js');
// const { ensureAuth } = require('../utilities/auth.js');

// GET Car Route
routes.get('/', carController.getCars, utilities.handleErrors);
routes.get('/:carId', carController.getCarById, utilities.handleErrors);

routes.post(
  '/',
  //   ensureAuth,
  //   carRules.carValidationRules(),
  //   utilities.validate,
  carController.addCar,
  utilities.handleErrors
);

// UPDATE Car Route
routes.put(
  '/:carId',
  //   ensureAuth,
  //   carRules.carValidationRules(),
  //   utilities.validate,
  carController.editCarById,
  utilities.handleErrors
);

// DELETE Car Route
routes.delete(
  '/:carId',
  //   ensureAuth,
  carController.deleteCarById,
  utilities.handleErrors
);

module.exports = routes;
