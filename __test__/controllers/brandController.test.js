const { json } = require('body-parser');
const {getBrands, getBrandById, addBrand, editBrandById, deleteBrandById} = require('../../controllers/brandController');
const Brand = require('../../models/Brand');

// Mock the Brand model's methods
jest.mock('../../models/Brand');


// GET brands
describe('Brand Controller', () => {
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

// PUT edit brand by ID
describe('editBrandById', () => {
    it('should update a brand and return status 202', async () =>{
        let mockBrand = {_id: '1', brandName: 'Toyota'};
        Brand.findOneAndUpdate.mockResolvedValue(mockBrand);

        const req = {
            params: {brandId: '1'},
            body: {brandName: 'Toyota'},
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        await editBrandById(req, res, next);

        expect(Brand.findOneAndUpdate).toHaveBeenCalledWith(
            {_id: '1'}, 
            {$set: {brandName: 'Toyota'}},
            {new: true}
        );
        expect(res.status).toHaveBeenCalledWith(202);
        expect(res.json).toHaveBeenCalledWith(mockBrand)
    });

    it('should return status 404 if brand is not found', async () => {
        Brand.findOneAndUpdate.mockResolvedValue(null);

        const req = {
            params: {brandId: '1'}, 
            body: {brandName: 'Toyota'},
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        await editBrandById(req, res, next);

        expect(Brand.findOneAndUpdate).toHaveBeenCalledWith(
            {_id: '1'}, 
            {$set: {brandName: 'Toyota'}},
            {new: true}
        );
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'This brand could not be updated.',
        });


    })
});