// this is my code ive been working on

const Brand = require('../models/Brand'); // Assuming you have a Brand model

// Get all brands
const getBrands = async (req, res, next) => {
  /*
      #swagger.tags=['Brands']
    */
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    next(error);
    // res.status(500).json({ message: 'Error fetching brands', error });
  }
};

const getBrandById = async (req, res, next) => {
  /*
      #swagger.tags=['Brands']
    */

  const brandId = req.params.brandId;

  try {
    const brand = await Brand.findById(brandId).exec();

    // Check if brand exists
    if (!brand) {
      return res.status(404).json({
        error: `Brand with id: '${brandId}' does not exist.`,
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(brand);
  } catch (error) {
    console.log('Error:', error.message);
    next(error);
    // res.status(500).json({ error: error.message });
  }
};

// Add a new brand
const addBrand = async (req, res, next) => {
  /*
    #swagger.tags=['Brands']
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Create a new Brand',
      schema: {
        brandName: 'Honda'
      }
    }
  */

  const brandName = req.body.brandName;
  try {
    const existingBrand = await Brand.findOne({
      brandName: brandName,
    });
    if (existingBrand) {
      return res.status(400).json({
        message: `You already have a brand with the name: ${brandName}.  We cannot add it again.`,
      });
    }

    const savedBrand = await Brand.create(brandName);
    res.status(201).json(savedBrand);
  } catch (error) {
    res.status(400).json({ message: 'Error adding brand', error });
  }
};

const editBrandById = async (req, res, next) => {
  /*
      #swagger.tags=['Brands']
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Create a new Brand',
        schema: {
          brandName: 'Toyota'
        }
      }
    */
  const brandId = req.params.brandId;

  try {
    const existingBrand = await Brand.findOne({
      brandName: brandName,
    });
    if (existingBrand) {
      return res.status(400).json({
        message: `You already have a brand with the name: ${brandName}.  We cannot add it again.`,
      });
    }

    const updateCriteria = { _id: brandId };
    const updatedBrand = await Brand.findOneAndUpdate(
      updateCriteria,
      {
        $set: {
          brandName: req.body.brandName,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedBrand) {
      return res
        .status(404)
        .json({ message: 'This brand could not be updated.' });
    }

    //if all goes well, return accepted status
    res.status(202).json(updatedBrand);
  } catch (error) {
    console.log('Error:', error.message);
    next(error);
  }
};

//DELETE
const deleteBrandById = async (req, res, next) => {
  /*
      #swagger.tags=['Brands']
    */
  const brandId = req.params.brandId;

  try {
    const brand = await Brand.findOneAndDelete({
      _id: brandId,
    });

    if (!brand) {
      return res.status(404).json({
        message: `You are not authorized to delete that brand.`,
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
  getBrands,
  getBrandById,
  addBrand,
  editBrandById,
  deleteBrandById,
};
