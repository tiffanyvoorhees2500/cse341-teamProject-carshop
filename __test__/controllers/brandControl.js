const { json } = require('body-parser');
const {getBrands, getBrandById, addBrand, editBrandById, deleteBrandById} = require('../../controllers/brandController');
const Brand = require('../../models/Brand');


// Mock the Brand model's methods
jest.mock('../../models/Brand');


// GET brands
describe('Brand Controller', () => {
   describe('getBrand', () => {
    it('should return a list of brands with status of 200', async () => {
      const mockBrand = [{brandName: 'Gac'}, {brandName: 'Toyota'}];
      Brand.find.mockResolvedValue(mockBrand);

      // Create a stub req, res & next
      const req = {}
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };
      const next = jest.fn();

      await getBrands(req, res, next);

      expect(Brand.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBrand);
  });

  it('should call the next() with error if it fails to fetch brand', async () => {
      let errorMsg = 'Database error';
      Brand.find.mockRejectedValue(new Error(errorMsg));

       // Create a stub req, res & next
       const req = {}
       const res = {
           status: jest.fn().mockReturnThis(),
           json: jest.fn(),
       };
       const next = jest.fn();

       await getBrands(req, res, next);

       expect(next).toHaveBeenCalledWith(new Error(errorMsg));

  });
   })
});
  

// GET brand by ID
describe('getBrandId', () => {
    it('should return a brand id with status 200', async () => {
        let mockBrand = {_id: '1', brandName: 'Honda'};
        Brand.findById.mockResolvedValue(mockBrand);

        const req = {params: {brandId: '1'}};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            setHeader: jest.fn(),
        };
        const next = jest.fn();

        await getBrandById(req, res, next);

        expect(Brand.findById).toHaveBeenCalledWith('1');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockBrand);
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json')
    });
    
    it('should return 404 if brand is not found',  async () => {
        Brand.findById.mockResolvedValue(null);

        const req = {params: {brandId: '1'}};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            setHeader: jest.fn(),
        };
        const next = jest.fn();

        await getBrandById(req, res, next);

        expect(Brand.findById).toHaveBeenCalledWith('1')
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({error: `Brand with id: '1' does not exist.`});
    });


    // POST, add new brand

describe('addBrand', () => {
  it('should create a new brand and return with status 201', async () =>{
      let mockBrand = {brandName: 'Honda'};
      Brand.findOne.mockResolvedValue(null);
      Brand.create.mockResolvedValue(mockBrand);

      const req = {body: {brandName: 'Honda'}};
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };
      const next = jest.fn();

      await addBrand(req, res, next);

      expect(Brand.findOne).toHaveBeenCalledWith({brandName: 'Honda'});
      expect(Brand.create).toHaveBeenCalledWith('Honda');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBrand)
  });

  it('should also return 400 if brand already exists', async () => {
      let existingBrand = {brandName: 'Honda'};

      Brand.findOne.mockResolvedValue(existingBrand);

      const req = {body: {brandName: 'Honda'}};
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };
      const next = jest.fn();

      await addBrand(req, res, next);

      expect(Brand.findOne).toHaveBeenCalledWith({brandName: 'Honda'});
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
          message: `You already have a brand with the name: Honda. We cannot add it again.`,
      });
   });
  });

  describe('editBrandById', () => {
  
    it('should update a brand and return status 202', async () => {
    // Mock brand data
    const mockUpdatedBrand = {
      _id: { $oid: '670febee2c904f621ec06b0b' },
      brandName: 'Toyota',
    };

    // Mock request and response objects
    const req = {
      params: { brandId: '670febee2c904f621ec06b0b' },
      body: { brandName: 'Toyota' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Mocking the database operations
    Brand.findOne.mockResolvedValue(null); // No existing brand with the same name
    Brand.findOneAndUpdate.mockResolvedValue(mockUpdatedBrand); // Simulating update success

    // Call the controller function
    await editBrandById(req, res, next);

    // Assert that the functions are called correctly
    expect(Brand.findOne).toHaveBeenCalledWith({ brandName: 'Toyota' });
    expect(Brand.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '670febee2c904f621ec06b0b' },
      { $set: { brandName: 'Toyota' } },
      { new: true }
    );

    // Assert response
    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.json).toHaveBeenCalledWith(mockUpdatedBrand);
  });
  
  it('should return status 404 if the brand is not found', async () => {
    const req = {
      params: { brandId: '670febee2c904f621ec06b0b' },
      body: { brandName: 'Toyota' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Simulating that no brand is found to update
    Brand.findOne.mockResolvedValue(null); // No existing brand with the same name
    Brand.findOneAndUpdate.mockResolvedValue(null); // No brand found to update

    // Call the controller function
    await editBrandById(req, res, next);

    // Assert that the functions are called correctly
    expect(Brand.findOne).toHaveBeenCalledWith({ brandName: 'Toyota' });
    expect(Brand.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '670febee2c904f621ec06b0b' },
      { $set: { brandName: 'Toyota' } },
      { new: true }
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'This brand could not be updated.',
    });
  });

  it('should return status 400 if the brand name already exists', async () => {
    const mockExistingBrand = {
      _id: { $oid: '670febee2c904f621ec06b0b' },
      brandName: 'Toyota',
    };

    // Mock request and response objects
    const req = {
      params: { brandId: '670febee2c904f621ec06b0b' },
      body: { brandName: 'Toyota' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Simulating that a brand with the same name already exists
    Brand.findOne.mockResolvedValue(mockExistingBrand);

    // Call the controller function
    await editBrandById(req, res, next);

    // Assert that the findOne function is called correctly
    expect(Brand.findOne).toHaveBeenCalledWith({ brandName: 'Toyota' });

    // Assert response
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'You already have a brand with the name: Toyota.  We cannot add it again.',
    });
  });
});

// DELETE a brand with ID

describe('deleteBrandById', () => {
  it('should delete a brand and return status 204', async () => {
      const mockBrand = {_id: '1', brandName: 'Toyota'};
      Brand.findOneAndDelete.mockResolvedValue(mockBrand);

      const req = {
          params: {brandId: '1'},
      };
      const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
      }

      const next = jest.fn();

      await deleteBrandById(req, res, next);

      expect(Brand.findOneAndDelete).toHaveBeenCalledWith({_id: '1'});
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
  })

  it('should return 404 if brand is not found', async () => {
      Brand.findOneAndDelete.mockResolvedValue(null);


      const req = {
          params: {_id: '1'},
      };
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      }
      const next = jest.fn();

      await deleteBrandById(req, res, next);

      expect(Brand.findOneAndDelete).toHaveBeenCalledWith({_id: '1'})
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
          message: 'You are not authorized to delete that brand.',
      })
  });

  it('should handle errors and call next with error', async () => {
      // Mock an error scenario in findOneAndDelete
      const errorMessage = 'Something went wrong';
      Brand.findOneAndDelete.mockRejectedValue(new Error(errorMessage));
  
      const req = {
        params: { brandId: '1' },
      };
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };
      const next = jest.fn();  // Define the next function
  
      await deleteBrandById(req, res, next);
  
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next).toHaveBeenCalledWith(new Error(errorMessage));
    });
  })

});



// PUT edit brand by ID






