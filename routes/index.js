const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const homeController = require('../controllers/homeController');

// Root route to check if the user is logged in and render the homepage
router.get('/', (req, res) => {
  const isLoggedIn = req.session.user !== undefined;
  const userName = isLoggedIn ? req.session.user.displayName : null;
  
  // Pass login status and username to homeController to build the homepage
  homeController.buildHome(req, res, isLoggedIn, userName);
});

router.use('/', require('./auth'));
router.use('/', require('./swagger'));
router.use('/cars', require('./cars'));
router.use('/brands', require('./brands'));
router.use('/users', require('./users'));
router.use('/reviews', require('./reviews'));

// router.get('/', (req, res) => {
//   res.send(
//     req.session.user !== undefined
//       ? `${req.session.user.displayName}: Welcome to Team Car Shop`
//       : 'Logged Out'
//   );
// });

module.exports = router;
