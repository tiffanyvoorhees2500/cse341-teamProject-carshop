module.exports = {
  ensureLogin: (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({ message: 'You must be logged in to make changes.' });
    } else {
      return next();
    }
  },
  ensureAdmin: (req, res, next) => {
    if (req.session.user.userType === 'Admin') {
      return next();
    } else {
      res.status(401).json({ message: 'You must be an admin to make these changes.' });
    }
  },
  ensureEmployee: (req,res,next) => {
    if(req.session.user.userType === "Employee" || req.session.user.userType === "Admin"){
      return next()
    }else{
      res.status(401).json({message: 'You must be an employee or an admin to make these changes.'});
    }
  },
};
