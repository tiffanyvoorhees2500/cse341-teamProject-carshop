
const mongoose = require('mongoose')
const User = require('../../models/User');
const { getUsers, getUserById, editUserType, deleteUserById } = require('../../controllers/userController');

// Mock the User model
jest.mock('../../models/User');

describe("userController", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    
describe('getUsers', () => {
    it('should return all users with status 200', async () => {
      const mockUsers = [
        {
            _id: new mongoose.Types.ObjectId(),
            googleId: '123',
            displayName: 'John Doe',
            firstName: 'John',
            lastName: 'Doe',
            image: 'imageUrl',
            userType: 'Customer',
          },
      ];
      
      User.find.mockResolvedValue(mockUsers);
  
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
  
      await getUsers(req, res, next);
  
      expect(User.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });
  
    it('should call next with an error if User.find fails', async () => {
      const error = new Error('Database error');
      User.find.mockRejectedValue(error);
  
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
  
      await getUsers(req, res, next);
  
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getUserById', () => {
    it('should return a user if found with status 200', async () => {
        const mockUser = {
            _id: new mongoose.Types.ObjectId(),
            googleId: '123',
            displayName: 'John Doe',
            firstName: 'John',
            lastName: 'Doe',
            userType: 'Customer',
        };

        // Mocking User.findById to resolve with mockUser
        User.findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUser)
        });

        const req = { params: { userId: mockUser._id.toString() } }; // Mock request with userId
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            setHeader: jest.fn(), // Mock setHeader
        };
        const next = jest.fn();

        await getUserById(req, res, next);

        // Expectations
        expect(User.findById).toHaveBeenCalledWith(mockUser._id.toString()); // Ensure User.findById called with correct ID
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json'); // Ensure correct header
        expect(res.status).toHaveBeenCalledWith(200); // Expect status 200
        expect(res.json).toHaveBeenCalledWith(mockUser); // Expect the mock user data in response
    });

    it('should return 404 if user is not found', async () => {
        User.findById.mockResolvedValue(null); // Mock findById to return null (user not found)
  
        const req = { params: { userId: 'nonexistentUserId' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        const next = jest.fn();

        User.findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
          });
  
        await getUserById(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(404); // Verify status 404
        expect(res.json).toHaveBeenCalledWith({
          error: `User with id: 'nonexistentUserId' does not exist.`,
        });
      });


      it('should call next with an error if something goes wrong', async () => {
        const errorMessage = 'Error fetching user';

        User.findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue(new Error(errorMessage)),
          });
        
  
        const req = { params: { userId: 'someUserId' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        const next = jest.fn();
  
        await getUserById(req, res, next);
  
        expect(next).toHaveBeenCalledWith(expect.any(Error)); // Ensure next was called with an error
      });
});

describe('editUserType', () => {
    it('should update the user type and return status 202', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        googleId: '123',
        displayName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        userType: 'Customer',
      };

      const updatedUser = {
        ...mockUser,
        userType: 'Employee',
      };

      User.findOneAndUpdate.mockResolvedValue(updatedUser); // Mock findOneAndUpdate to return updatedUser

      const req = {
        params: { userId: mockUser._id.toString() },
        body: { userType: 'Employee' },
        session: { user: { userType: 'Customer' } },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await editUserType(req, res, next);

      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockUser._id.toString() },
        { $set: { userType: 'Employee' } },
        { new: true }
      );
      expect(req.session.user.userType).toBe('Employee'); // Verify session update
      expect(res.status).toHaveBeenCalledWith(202); // Verify status 202
      expect(res.json).toHaveBeenCalledWith(updatedUser); // Verify response sends the updated user
    });

    it('should return 404 if user is not found for update', async () => {
        User.findOneAndUpdate.mockResolvedValue(null); // Mock findOneAndUpdate to return null
  
        const req = { params: { userId: 'nonexistentUserId' }, body: { userType: 'Employee' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        const next = jest.fn();
  
        await editUserType(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(404); // Verify status 404
        expect(res.json).toHaveBeenCalledWith({ message: 'This User could not be updated.' });
      });

      it('should call next with an error if something goes wrong', async () => {
        const errorMessage = 'Error updating user type';
        User.findOneAndUpdate.mockRejectedValue(new Error(errorMessage)); // Mock rejection
  
        const req = { params: { userId: 'someUserId' }, body: { userType: 'Employee' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        const next = jest.fn();
  
        await editUserType(req, res, next);
  
        expect(next).toHaveBeenCalledWith(expect.any(Error)); // Ensure next was called with an error
      });
})

describe('deleteUserById', () => {
    it('should delete a user and return status 204', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        googleId: '123',
        displayName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
      };

      User.findOneAndDelete.mockResolvedValue(mockUser); // Mock findOneAndDelete to return mockUser

      const req = { params: { userId: mockUser._id.toString() } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const next = jest.fn();

      await deleteUserById(req, res, next);

      expect(User.findOneAndDelete).toHaveBeenCalledWith({ _id: mockUser._id.toString() });
      expect(res.status).toHaveBeenCalledWith(204); // Verify status 204
      expect(res.send).toHaveBeenCalled(); // Verify response sends empty content
    });

    
    it('should return 404 if user is not found for deletion', async () => {
        const req = { params: { userId: 'nonexistentUserId' } }; // Use a simple string for the userId
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        const next = jest.fn();
    
        // Mock findOneAndDelete to return null (user not found)
        User.findOneAndDelete.mockResolvedValue(null);
    
        await deleteUserById(req, res, next);
    
        // Ensure findOneAndDelete was called with the correct ID
        expect(User.findOneAndDelete).toHaveBeenCalledWith({ _id: 'nonexistentUserId' });
    
        // Expect a 404 status and a proper error message
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          message: `User with id 'nonexistentUserId' not found.`,
        });
    });
    

})

  

});