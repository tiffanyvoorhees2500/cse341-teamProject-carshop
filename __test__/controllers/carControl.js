const { getCars, getCarById, addCar, editCarById, deleteCarById } = require('../../controllers/carController');
const Car = require('../../models/Car');
const Brand = require('../../models/Brand');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { json } = require('body-parser');



// Mock the Car and Brand model methods
jest.mock('../../models/Car', () => {
  return {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
  };
});

jest.mock('../../models/Brand', () => {
  return {
    findOne: jest.fn(),
  };
});

describe('Car Controller', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('getCars', () => {
    it('should get all cars and return status 200', async () => {
      const mockCars = [
        { model: 'Test Car 1', year: 2020, engine: 'V6', horsepower: 300, top_speed: '150 mph' },
        { model: 'Test Car 2', year: 2021, engine: 'V8', horsepower: 400, top_speed: '180 mph' },
      ];

      Car.find.mockResolvedValue(mockCars); // Mock the Mongoose Car.find method

      const req = {}; 
      const res = {
        status: jest.fn().mockReturnThis(), 
        json: jest.fn(), 
      };
      const next = jest.fn(); 

      // Call the getCars controller method
      await getCars(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200); 
      expect(res.json).toHaveBeenCalledWith(mockCars); 
    });

    it('should call next with an error if Car.find throws an error', async () => {
      const errorMessage = 'Database error';
      Car.find.mockRejectedValue(new Error(errorMessage)); // Mock a database error

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await getCars(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    });
  });

  describe('getCarById', () => {
    it('should get a car by ID and return status 200', async () => {
      const mockCar = { model: 'Test Car', year: 2020, engine: 'V6', horsepower: 300, top_speed: '150 mph' };
      const req = { params: { carId: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn(),
        
      };
      const next = jest.fn();

      // Mock Car.findById().exec()
      Car.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockCar),
    });

      await getCarById(req, res, next);

      console.log(res.status.mock.calls);    
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCar);
     
  
    });

    it('should return 404 if car is not found ', async () => {
      const req = {params: {carId: '1'}};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const next = jest.fn();

      // Mock Car.findById().exec()
      Car.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });


      await getCarById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: `Car with id: '1' does not exist.`,
      });
    })

    describe('Car Controller - addCar', () => {

      it('should add a new car and return status 201', async () => {
          const mockBrand = { _id: 'brand123', brandName: 'Ferrari' };
          const mockCar = {
            _id: 'car123',
            brand: mockBrand._id,
            model: 'Ferrari Test',
            year: 2024,
            engine: '3.9L V8',
            horsepower: 661,
            top_speed: '205 mph',
          };
    
          Brand.findOne.mockResolvedValue(mockBrand);
          Car.create.mockResolvedValue(mockCar);
      
          const req = {
            body: {
              brandName: 'Ferrari',
              model: 'Ferrari Test',
              year: 2024,
              engine: '3.9L V8',
              horsepower: 661,
              top_speed: '205 mph',
              image: 'ferrari-test.png',
            },
          };
    
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
    
          const next = jest.fn();
      
          await addCar(req, res, next);
      
          expect(Brand.findOne).toHaveBeenCalledWith({ brandName: 'Ferrari' });
          expect(Car.create).toHaveBeenCalledWith({
            brand: mockBrand._id,
            model: 'Ferrari Test',
            year: 2024,
            engine: '3.9L V8',
            horsepower: 661,
            top_speed: '205 mph',
            image: 'ferrari-test.png',
          });
          expect(res.status).toHaveBeenCalledWith(201);
          expect(res.json).toHaveBeenCalledWith(mockCar);
        });
      });

      it('should return 401 if brand is not found', async () => {
        // Mocking Brand.findOne to return null
        Brand.findOne.mockResolvedValue(null);
  
        const req = {
          body: {
            brandName: 'Nonexistent Brand',
            model: 'Nonexistent Model',
            year: 2024,
            engine: 'Nonexistent Engine',
            horsepower: 0,
            top_speed: '0 mph',
            image: 'nonexistent.png',
          },
        };
  
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        const next = jest.fn();
  
        await addCar(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          message: 'A car with this brand name cannot be created at this time.',
        });
      });


    });

    describe('editCarById', () => {
      afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
      });
    
      it('should update a car and return status 202', async () => {
        const mockBrand = { _id: 'brand123', brandName: 'Ferrari' };
        const mockUpdatedCar = {
          _id: 'car123',
          brand: mockBrand._id,
          model: 'Ferrari Testing',
          year: 2024,
          engine: '3.9L V8',
          horsepower: 661,
          top_speed: '300 mph',
        };
    
        Brand.findOne.mockResolvedValue(mockBrand); // Mock brand found
        Car.findOneAndUpdate.mockResolvedValue(mockUpdatedCar); // Mock car update
    
        const req = {
          params: { carId: 'car123' },
          body: {
            brandName: 'Ferrari',
            model: 'Ferrari Testing',
            year: 2024,
            engine: '3.9L V8',
            horsepower: 661,
            top_speed: '300 mph',
          },
        };
    
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        const next = jest.fn();
    
        await editCarById(req, res, next);
    
        expect(Brand.findOne).toHaveBeenCalledWith({ brandName: 'Ferrari' });
        expect(Car.findOneAndUpdate).toHaveBeenCalledWith(
          { _id: 'car123' },
          {
            $set: {
              brand: mockBrand._id,
              model: 'Ferrari Testing',
              year: 2024,
              engine: '3.9L V8',
              horsepower: 661,
              top_speed: '300 mph',
            },
          },
          { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(202);
        expect(res.json).toHaveBeenCalledWith(mockUpdatedCar);
      });

      it('should return 401 if brand does not exist', async () => {
        Brand.findOne.mockResolvedValue(null); // Mock brand not found
    
        const req = {
          params: { carId: 'car123' },
          body: {
            brandName: 'Nonexistent Brand',
            model: 'Nonexistent Model',
            year: 2024,
            engine: 'Nonexistent Engine',
            horsepower: 0,
            top_speed: '0 mph',
          },
        };
    
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        const next = jest.fn();
    
        await editCarById(req, res, next);
    
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          message: 'The brand name you are trying to use does not exist.',
        });
      });
    
      it('should return 404 if car cannot be found', async () => {
        const mockBrand = { _id: 'brand123', brandName: 'Ferrari' };
        Brand.findOne.mockResolvedValue(mockBrand); // Mock brand found
        Car.findOneAndUpdate.mockResolvedValue(null); // Mock car not found
    
        const req = {
          params: { carId: 'car123' },
          body: {
            brandName: 'Ferrari',
            model: 'Ferrari Testing',
            year: 2024,
            engine: '3.9L V8',
            horsepower: 661,
            top_speed: '300 mph',
          },
        };
    
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        const next = jest.fn();
    
        await editCarById(req, res, next);
    
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          message: 'This car could not be updated.',
        });
      });
    });
  
    // DELETE car by ID
    describe('deleteCarById', () => {
      afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
      });
    
      it('should delete a car and return status 204', async () => {
        const req = { params: { carId: 'car123' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        };
        const next = jest.fn();
    
        // Mocking the car deletion to return the deleted car
        Car.findOneAndDelete.mockResolvedValue({ _id: 'car123' });
    
        await deleteCarById(req, res, next);
    
        expect(Car.findOneAndDelete).toHaveBeenCalledWith({ _id: 'car123' });
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
      });
    
      it('should return 404 if the car does not exist', async () => {
        const req = { params: { carId: 'car123' } };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        const next = jest.fn();
    
        // Mocking the car deletion to return null
        Car.findOneAndDelete.mockResolvedValue(null);
    
        await deleteCarById(req, res, next);
    
        expect(Car.findOneAndDelete).toHaveBeenCalledWith({ _id: 'car123' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          message: 'You are not authorized to delete that car.',
        });
      });
    });
    
})
      
  


  