module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({ message: 'You are not authorized.' });
    } else {
      return next();
    }
  },
  ensureAdmin: (req, res, next) => {
    if (req.session.user.isAdmin === undefined || req.session.user.isAdmin === false) {
      res.status(401).json({ message: 'You are not authorized.' });
    } else {
      return next();
    }
  },
};
