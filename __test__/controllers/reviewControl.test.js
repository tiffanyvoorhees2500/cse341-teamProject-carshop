const {getReviews, getReviewById, addReview, editReviewById, deleteReviewById} = require('../../controllers/reviewController');
const Review = require('../../models/Review');
const Car = require('../../models/Car');
const mongoose = require('mongoose');
const { json } = require('body-parser');


// Mock mongoose objectId
const ObjectId = mongoose.Types.ObjectId;


// Mock the Review and Car model methods
jest.mock('../../models/Review', () => {
    return{
        find: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        findOneAndUpdate: jest.fn(),
        findOneAndDelete: jest.fn(),
        findOne: jest.fn(),
    };
});


jest.mock('../../models/Car', () => {
    return {
        findOne: jest.fn(),
    };
});

describe('Review Controller', () => {

    afterEach( () => {
        jest.clearAllMocks();
    });

    describe('getReview', () => {
        it('should return a review and return status 200', async () => {
            mockReview = {
                _id: 'review123',
                user: 'Emma123',
                car: 'car123',
                rating: 5,
                comment: 'Good car!',
            };

            const req = {}
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                
            }
            const next = jest.fn();

            Review.find.mockResolvedValue(mockReview);

            await getReviews(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockReview);
        });

        it('should call next with an error if Review.find throws an error', async () => {
            const errorMessage = 'Database error';
            Review.find.mockRejectedValue(new Error(errorMessage));
      
            const req = {};
            const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
            };
            const next = jest.fn();
      
            await getReviews(req, res, next);
      
            expect(next).toHaveBeenCalledWith(new Error(errorMessage));
          });
    });

    describe('getReviewById', () => {
        it('should return a review by ID with status 200', async () => {
          const mockReview = {
            _id: 'review123',
            user: 'user123',
            car: 'car123',
            rating: 5,
            comment: 'Great car!',
          };
    
          const req = { params: { reviewId: 'review123' } };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            setHeader: jest.fn(),
          };
          const next = jest.fn();
    
          Review.findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockReview),
          });
    
          await getReviewById(req, res, next);
    
          expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith(mockReview);
        });
    
        it('should return 404 if review is not found', async () => {
            const req = { params: { reviewId: 'review123' } };
            const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
            };
            const next = jest.fn();
      
            Review.findById.mockReturnValue({
              exec: jest.fn().mockResolvedValue(null),
            });
      
            await getReviewById(req, res, next);
      
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
              error: `Review with id: 'review123' does not exist.`,
            });
          });
    });


    describe('addReview', () => {
        it('should add a new review and return status 201', async () => {
            const mockCar = { _id: new ObjectId('670fee462c904f621ec06b12') };
            const mockReview = {
            _id: 'review123',
            user: new ObjectId('670fee462c904f621ec06b12'), // Keep as ObjectId
            car: new ObjectId('670fee462c904f621ec06b12'),  // Keep as ObjectId
            rating: 5,
            comment: 'Great car!',
          };
      
          // Mock implementations
          Car.findOne.mockResolvedValue(mockCar);
          Review.create.mockResolvedValue(mockReview);
      
          const req = {
            body: {
              carId: '670fee462c904f621ec06b12',  
              rating: 5,
              comment: 'Great car!',
            },
            session: {
              user: {_id: '670fee462c904f621ec06b12',},
            },
          };
    
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
          const next = jest.fn();

          // Create the ObjectId in the test using createFromHexString for both carId and userId
          const carId = ObjectId.createFromHexString(req.body.carId);
          const userId = ObjectId.createFromHexString(req.session.user._id);

          // Mock Car and Review models' behavior
          Car.findOne.mockResolvedValue(mockCar);  
          Review.create.mockResolvedValue(mockReview);
      
          // Call the function under test
          await addReview(req, res, next);
      
          // Assert that findOne was called with the correct ObjectId
          expect(Car.findOne).toHaveBeenCalledWith({ _id: carId });
      
          // Assert that create was called with ObjectId values
          expect(Review.create).toHaveBeenCalledWith({
            user: userId,  // Ensure this is an ObjectId
            car: carId,          // Ensure this is an ObjectId
            rating: req.body.rating,
            comment: req.body.comment,
          });
      
          // Assert that response status is set correctly
          expect(res.status).toHaveBeenCalledWith(201);
          
          // Ensure the response contains the correct data with converted ObjectIds to strings for output
          expect(res.json).toHaveBeenCalledWith({
            ...mockReview,
            user: mockReview.user.toString(),  // Convert ObjectId to string for response comparison
            car: mockReview.car.toString(),     // Convert ObjectId to string for response comparison
          });
        });
      
      
    
        

      });


      describe('editReviewById', () => {
        it('should edit a review and return status 202', async () => {
          const mockReview = { _id: 'review123', rating: 5, comment: 'Updated review' };
          const req = {
            params: { reviewId: 'review123' },
            body: { rating: 5, comment: 'Updated review' },
            session: { user: { _id: 'user123' } },
          };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
          const next = jest.fn();
    
          Review.findOne.mockResolvedValue(mockReview);
          Review.findOneAndUpdate.mockResolvedValue(mockReview);
    
          await editReviewById(req, res, next);
    
          expect(Review.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: ObjectId('review123'), user: ObjectId('user123') },
            { $set: { rating: 5, comment: 'Updated review' } },
            { new: true }
          );
          expect(res.status).toHaveBeenCalledWith(202);
          expect(res.json).toHaveBeenCalledWith(mockReview);
        });
      });
});