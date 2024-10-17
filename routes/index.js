const router = require('express').Router();

router.use('/', require('./swagger'));
router.use('/cars', require('./cars'));
// router.use('/brands', require('./brands'));

router.get('/', (req, res) => {
  res.send('Welcome to Team Car Shop! We will have a homepage up soon.');
});

module.exports = router;
