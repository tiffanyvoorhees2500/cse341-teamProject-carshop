const routes = require('express').Router();
const brandController = require('../controllers/brandController');
const utilities = require('../utilities/index.js');
const brandRules = require('../validation/brand-validation.js');
const {
  ensureLogin,
  ensureEmployee,
  ensureAdmin,
} = require('../validation/auth-validation.js');

// GET Brand Route... Must be logged in to see
routes.get(
  '/',
  ensureLogin,
  ensureEmployee,
  brandController.getBrands,
  utilities.handleErrors
);
routes.get(
  '/:brandId',
  ensureLogin,
  ensureEmployee,
  brandController.getBrandById,
  utilities.handleErrors
);

// POST Brand... Must be logged and admin to add new brands
routes.post(
  '/',
  ensureLogin,
  ensureAdmin,
  brandRules.brandValidationRules(),
  utilities.validate,
  brandController.addBrand,
  utilities.handleErrors
);

// UPDATE Brand Route... Must be logged in and admin to edit brands
routes.put(
  '/:brandId',
  ensureLogin,
  ensureAdmin,
  brandRules.brandValidationRules(),
  utilities.validate,
  brandController.editBrandById,
  utilities.handleErrors
);

// DELETE Brand Route... Must be logged in and admin to edit brands
routes.delete(
  '/:brandId',
  ensureLogin,
  ensureAdmin,
  brandController.deleteBrandById,
  utilities.handleErrors
);

module.exports = routes;
