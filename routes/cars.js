const routes = require('express').Router();
const carController = require('../controllers/carController');
const utilities = require('../utilities/index.js');
const carRules = require('../validation/car-validation.js');
const { ensureLogin, ensureEmployee, ensureAdmin } = require('../validation/auth-validation.js');

// GET Car Route... Anyone can view cars
routes.get('/', carController.getCars, utilities.handleErrors);
routes.get('/:carId', carController.getCarById, utilities.handleErrors);

// Must be logged in, and an admin to add new cars
routes.post(
  '/',
  ensureLogin,
  ensureEmployee,
  carRules.carValidationRules(),
  utilities.validate,
  carController.addCar,
  utilities.handleErrors
);

// UPDATE Car Route... Must be logged in, but not necessarily and admin to edit
routes.put(
  '/:carId',
  ensureLogin,
  ensureEmployee,
  carRules.carValidationRules(),
  utilities.validate,
  carController.editCarById,
  utilities.handleErrors
);

// DELETE Car Route... Must be logged in, and an admin to delete a car
routes.delete(
  '/:carId',
  ensureLogin,
  ensureAdmin,
  carController.deleteCarById,
  utilities.handleErrors
);

module.exports = routes;
