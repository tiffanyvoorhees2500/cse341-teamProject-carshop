const routes = require('express').Router();
const brandController = require('../controllers/brandController');
const utilities = require('../utilities/index.js');
const brandRules = require('../validation/brand-validation.js');
const { ensureAuth, ensureAdmin } = require('../validation/auth-validation.js');

// GET Brand Route... Must be logged in to see
routes.get('/', ensureAuth, brandController.getBrands, utilities.handleErrors);
routes.get(
  '/:brandId',
  ensureAuth,
  brandController.getBrandById,
  utilities.handleErrors
);

// POST Brand... Must be logged and admin to add new brands
routes.post(
  '/',
  ensureAuth,
  ensureAdmin,
  brandRules.brandValidationRules(),
  utilities.validate,
  brandController.addBrand,
  utilities.handleErrors
);

// UPDATE Brand Route... Must be logged in and admin to edit brands
routes.put(
  '/:brandId',
  ensureAuth,
  ensureAdmin,
  brandRules.brandValidationRules(),
  utilities.validate,
  brandController.editBrandById,
  utilities.handleErrors
);

// DELETE Brand Route... Must be logged in and admin to edit brands
routes.delete(
  '/:brandId',
  ensureAuth,
  ensureAdmin,
  brandController.deleteBrandById,
  utilities.handleErrors
);

module.exports = routes;
