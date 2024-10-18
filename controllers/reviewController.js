const Review = require('../models/Review'); // Assuming you have a Review model

// Get all Review
const getReview = async (req, res, next) => {
  /*
      #swagger.tags=['Review']
    */
  try {
    const Review = await Review.find();
    res.status(200).json(Review);
  } catch (error) {
    next(error);
    // res.status(500).json({ message: 'Error fetching Review', error });
  }
};

const getReviewById = async (req, res, next) => {
  /*
      #swagger.tags=['Review']
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
    #swagger.tags=['Review']
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Create a new Review',
      schema: {
        reviewName: 'Honda'
      }
    }
  */

  const reviewName = req.body.reviewName;
  try {
    const existingReview = await Review.findOne({
      reviewName: reviewName,
    });
    if (existingReview) {
      return res.status(400).json({
        message: `You already have a review with the name: ${reviewName}.  We cannot add it again.`,
      });
    }

    const savedReview = await Review.create(reviewName);
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: 'Error adding review', error });
  }
};

const editReviewById = async (req, res, next) => {
  /*
      #swagger.tags=['Review']
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Create a new Review',
        schema: {
          reviewName: 'Toyota'
        }
      }
    */
  const reviewId = req.params.reviewId;

  try {
    const existingReview = await Review.findOne({
      reviewName: reviewName,
    });
    if (existingReview) {
      return res.status(400).json({
        message: `You already have a review with the name: ${reviewName}.  We cannot add it again.`,
      });
    }

    const updateCriteria = { _id: reviewId };
    const updatedReview = await Review.findOneAndUpdate(
      updateCriteria,
      {
        $set: {
          reviewName: req.body.reviewName,
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
      #swagger.tags=['Review']
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
  getReview,
  getReviewById,
  addReview,
  editReviewById,
  deleteReviewById,
};
