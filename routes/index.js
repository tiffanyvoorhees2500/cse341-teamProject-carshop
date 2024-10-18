const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.use('/', require('./auth'));
router.use('/', require('./swagger'));
router.use('/cars', require('./cars'));
router.use('/brands', require('./brands'));
router.use('/users', require('./users'));
router.use('/reviews', require('./reviews'));

router.get('/', (req, res) => {
  res.send(
    req.session.user !== undefined
      ? `${req.session.user.displayName}: Welcome to Team Car Shop`
      : 'Logged Out'
  );
});

module.exports = router;
