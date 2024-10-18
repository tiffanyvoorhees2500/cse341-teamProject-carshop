const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car', // Assuming you have a Car model
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5 // Assuming a rating scale of 1 to 5
    },
    comment: {
        type: String,
        required: true,
        maxlength: 500 // Limit the length of the comment
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the date when the review is created
    }
});

module.exports = mongoose.model('Review', reviewSchema);
