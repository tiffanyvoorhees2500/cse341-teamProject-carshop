const User = require('../models/User'); // Assuming you have a User model

// Get all Users
const getUsers = async (req, res, next) => {
  /*
      #swagger.tags=['Users']
    */
  try {
    const users = await user.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
    // res.status(500).json({ message: 'Error fetching Users', error });
  }
};

const getUserById = async (req, res, next) => {
  /*
    #swagger.tags=['Users']
  */

  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).exec();

    // Check if User exists
    if (!user) {
      return res.status(404).json({
        error: `User with id: '${userId}' does not exist.`,
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user);
  } catch (error) {
    console.log('Error:', error.message);
    next(error);
    // res.status(500).json({ error: error.message });
  }
};

// Add a new User... done when person logs into google

const editAdminStatus = async (req, res, next) => {
  /*
      #swagger.tags=['Users']
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Make a user an admin',
        schema: {
          isAdmin: true
        }
      }
    */
  const userId = req.params.userId;

  try {
    const updateCriteria = { _id: userId };
    const updatedUser = await User.findOneAndUpdate(
      updateCriteria,
      {
        $set: {
          isAdmin: req.body.isAdmin,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: 'This User could not be updated.' });
    }

    //if all goes well, return accepted status
    // and update session user
    req.session.user.isAdmin = req.body.isAdmin;
    res.status(202).json(updatedUser);
  } catch (error) {
    console.log('Error:', error.message);
    next(error);
  }
};

//DELETE
const deleteUserById = async (req, res, next) => {
  /*
      #swagger.tags=['Users']
    */
  const userId = req.params.userId;

  try {
    const user = await User.findOneAndDelete({
      _id: userId,
    });

    if (!User) {
      return res.status(404).json({
        message: `You are not authorized to delete that User.`,
      });
    }

    res.status(204).send();
  } catch (error) {
    console.log('Error:', error.message);
    next(error);
    // res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  editAdminStatus,
  deleteUserById,
};
