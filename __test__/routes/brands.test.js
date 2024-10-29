const request = require('supertest');
const express = require('express');
const brandRoutes = require('../../routes/brands');
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

// Mock Brand model
jest.mock('../../models/Brand', () => ({
  find: jest.fn(),
  findById: jest.fn(),
}));

describe('Brand Route Middleware Tests', () => {
  const app = express();
  app.use(express.json());
  app.use('/brands', brandRoutes);

  it('should apply ensureLogin and ensureEmployee middleware on GET /brands', async () => {
    // Arrange - Set up the mock data and return value for Brand.find
    const mockBrand = [{ brandName: 'Gac' }, { brandName: 'Toyota' }];
    Brand.find.mockResolvedValue(mockBrand);

    // Act - Perform the GET request using supertest
    await request(app).get('/brands');

    // Assert - Check that middleware functions were called
    expect(ensureLogin).toHaveBeenCalled();
    expect(ensureEmployee).toHaveBeenCalled();
  });

  it('should apply ensureLogin and ensureEmployee middleware on GET /brands/brandId', async () => {
    // Arrange - Set up the mock data and return value for Brand.find
    let mockBrand = { _id: '1', brandName: 'Honda' };
    Brand.findById.mockResolvedValue(mockBrand);

    // Act - Perform the GET request using supertest
    await request(app).get('/brands/1');

    // Assert - Check that middleware functions were called
    expect(ensureLogin).toHaveBeenCalled();
    expect(ensureEmployee).toHaveBeenCalled();
  });

  it('should apply ensureLogin and ensureAdmin middleware on POST /brands', async () => {
    const res = await request(app)
      .post('/brands')
      .send({ brandName: 'NewBrand' });
    expect(ensureLogin).toHaveBeenCalled();
    expect(ensureAdmin).toHaveBeenCalled();
  });

  it('should apply ensureLogin and ensureEmployee middleware on PUT /brands/brandId', async () => {
    // Arrange - Set up the mock data and return value for Brand.find
    const mockUpdatedBrand = {
      _id: { $oid: '670febee2c904f621ec06b0b' },
      brandName: 'Toyota',
    };

    // Act - Perform the GET request using supertest
    await request(app).put('/brands/670febee2c904f621ec06b0b');

    // Assert - Check that middleware functions were called
    expect(ensureLogin).toHaveBeenCalled();
    expect(ensureEmployee).toHaveBeenCalled();
  });

  it('should apply ensureLogin and ensureEmployee middleware on PUT /brands/brandId', async () => {
    // Arrange - Set up the mock data and return value for Brand.find
    const mockUpdatedBrand = {
      _id: { $oid: '670febee2c904f621ec06b0b' },
      brandName: 'Toyota',
    };

    // Act - Perform the GET request using supertest
    await request(app).delete('/brands/670febee2c904f621ec06b0b');

    // Assert - Check that middleware functions were called
    expect(ensureLogin).toHaveBeenCalled();
    expect(ensureEmployee).toHaveBeenCalled();
  });
});
