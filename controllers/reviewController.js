const Review = require('../models/Review'); // Assuming you have a Review model
const Car = require('../models/Car');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


// Get all Review
const getReviews = async (req, res, next) => {
  /*
      #swagger.tags=['Reviews']
    */
  try {
    const review = await Review.find();
    res.status(200).json(review);
  } catch (error) {
    next(error);
    // res.status(500).json({ message: 'Error fetching Review', error });
  }
};

const getReviewById = async (req, res, next) => {
  /*
      #swagger.tags=['Reviews']
    */

  const reviewId = req.params.reviewId;

  try {
    const review = await Review.findById(reviewId).exec();

    // Check if review exists
    if (!review) {
      return res.status(404).json({
        error: `Review with id: '${reviewId}' does not exist.`,
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(review);
  } catch (error) {
    console.log('Error:', error.message);
    next(error);
    // res.status(500).json({ error: error.message });
  }
};

// Add a new review
const addReview = async (req, res, next) => {
  /*
    #swagger.tags=['Reviews']
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Create a new Review',
      schema: {
        carId: "any",
        rating: 1,
        comment: "This car is a lemon"
      }
    }
  */

  const { rating, comment } = req.body;
  const carId = ObjectId.createFromHexString(req.body.carId);
  const userId = req.session.user._id;

  try {
    const existingCar = await Car.findOne({
      _id: carId,
    });
    if (!existingCar) {
      return res
        .status(400)
        .json({ message: `The car you trying to review does not exist.` });
    }

    const existingReview = await Review.findOne({
      car: carId,
      user: userId,
    });
    if (existingReview) {
      return res.status(400).json({
        message: `You already have a review with the id: ${existingReview._id}.  You cannot add another review.`,
      });
    }

    const savedReview = await Review.create({
      user: userId,
      car: carId,
      rating: rating,
      comment: comment,
    });

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: 'Error adding review', error });
  }
};

const editReviewById = async (req, res, next) => {
  /*
      #swagger.tags=['Reviews']
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Create a new Review',
        schema: {
          rating: 5,
          comment: "This car runs great!"
        }
      }
    */
  const reviewId = ObjectId.createFromHexString(req.params.reviewId);
  const userId = ObjectId.createFromHexString(req.session.user._id);
  const { rating, comment } = req.body;

  try {
    const existingReview = await Review.findOne({
      user: userId,
      _id: reviewId,
    });
    if (!existingReview) {
      return res.status(400).json({
        message: `We did not find a review with id: ${reviewId} for you.`,
      });
    }

    const updateCriteria = { _id: reviewId, user: userId };
    const updatedReview = await Review.findOneAndUpdate(
      updateCriteria,
      {
        $set: {
          rating: rating,
          comment: comment,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedReview) {
      return res
        .status(404)
        .json({ message: 'This review could not be updated.' });
    }

    //if all goes well, return accepted status
    res.status(202).json(updatedReview);
  } catch (error) {
    console.log('Error:', error.message);
    next(error);
  }
};

//DELETE
const deleteReviewById = async (req, res, next) => {
  /*
      #swagger.tags=['Reviews']
    */
  const reviewId = req.params.reviewId;

  try {
    const review = await Review.findOneAndDelete({
      _id: reviewId,
    });

    if (!review) {
      return res.status(404).json({
        message: `You are not authorized to delete that review.`,
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
  getReviews,
  getReviewById,
  addReview,
  editReviewById,
  deleteReviewById,
};
