const routes = require('express').Router();
const brandController = require('../controllers/brandController');
const utilities = require('../validation/');
// const brandRules = require('../utilities/brand-validation.js');
// const { ensureAuth } = require('../utilities/auth.js');

// GET Brand Route
routes.get('/', brandController.getBrands, utilities.handleErrors);
routes.get('/:brandId', brandController.getBrandById, utilities.handleErrors);

routes.post(
  '/',
  //   ensureAuth,
  //   brandRules.brandValidationRules(),
  //   utilities.validate,
  brandController.addBrand,
  utilities.handleErrors
);

// UPDATE Brand Route
routes.put(
  '/:brandId',
  //   ensureAuth,
  //   brandRules.brandValidationRules(),
  //   utilities.validate,
  brandController.editBrandById,
  utilities.handleErrors
);

// DELETE Brand Route
routes.delete(
  '/:brandId',
  //   ensureAuth,
  brandController.deleteBrandById,
  utilities.handleErrors
);

module.exports = routes;
