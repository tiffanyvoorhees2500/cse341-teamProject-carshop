const request = require('supertest');
const express = require('express');
const carRoutes = require('../../routes/cars');
const Car = require('../../models/Car');
const Brand = require('../../models/Brand');
const mongoose = require('mongoose');
const {
  ensureLogin,
  ensureEmployee,
  ensureAdmin,
} = require('../../validation/auth-validation');

// Apply mocks to modules
jest.mock('../../validation/auth-validation', () => ({
  ensureLogin: jest.fn((req, res, next) => next()),
  ensureEmployee: jest.fn((req, res, next) => next()),
  ensureAdmin: jest.fn((req, res, next) => next()),
}));

// Mock Car model
jest.mock('../../models/Car', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
}));

// Mock Brand model
jest.mock('../../models/Brand', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
}));

describe('Car Route Middleware Tests', () => {
  const app = express();
  app.use(express.json());
  app.use('/Cars', carRoutes);

  it('should apply ensureLogin and ensureAdmin middleware on POST /Cars', async () => {
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

    const res = await request(app).post('/Cars').send(mockCar);
    expect(ensureLogin).toHaveBeenCalled();
    expect(ensureEmployee).toHaveBeenCalled();
  });

  it('should apply ensureLogin and ensureEmployee middleware on PUT /Cars/CarId', async () => {
    // Arrange - Set up the mock data and return value for Car.find
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

    // Act - Perform the GET request using supertest
    await request(app).put('/Cars/car123');

    // Assert - Check that middleware functions were called
    expect(ensureLogin).toHaveBeenCalled();
    expect(ensureEmployee).toHaveBeenCalled();
  });

  it('should apply ensureLogin and ensureEmployee middleware on DELETE /Cars/CarId', async () => {
    // Mocking the car deletion to return the deleted car
    Car.findOneAndDelete.mockResolvedValue({ _id: 'car123' });

    // Act - Perform the GET request using supertest
    await request(app).delete('/Cars/car123');

    // Assert - Check that middleware functions were called
    expect(ensureLogin).toHaveBeenCalled();
    expect(ensureAdmin).toHaveBeenCalled();
  });
});
