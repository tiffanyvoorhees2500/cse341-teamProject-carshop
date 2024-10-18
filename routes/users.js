const routes = require('express').Router();
const userController = require('../controllers/userController');
const utilities = require('../utilities/index.js');
const userRules = require('../validation/user-validation.js');
const { ensureAuth, ensureAdmin } = require('../validation/auth-validation.js');

// GET user Route... must be logged in and an admin to see users
routes.get(
  '/',
  ensureAuth,
  ensureAdmin,
  userController.getUsers,
  utilities.handleErrors
);
routes.get(
  '/:userId',
  ensureAuth,
  ensureAdmin,
  userController.getUserById,
  utilities.handleErrors
);

// No POST route... Users must login via google

// UPDATE user Route... the only thing editable is whether they are an admin or not
// Must be logged in and an admin to change admin status
routes.put(
  '/:userId',
  ensureAuth,
  ensureAdmin,
  userRules.userValidationRules(),
  utilities.validate,
  userController.editAdminStatus,
  utilities.handleErrors
);

// DELETE user Route
routes.delete(
  '/:userId',
  ensureAuth,
  ensureAdmin,
  userController.deleteUserById,
  utilities.handleErrors
);

module.exports = routes;
