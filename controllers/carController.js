const Car = require('../models/Car'); // Assuming you have a Car model
const Brand = require('../models/Brand');

// Get all cars
const getCars = async (req, res, next) => {
  /*
      #swagger.tags=['Cars']
    */
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    next(error);
    // res.status(500).json({ message: 'Error fetching cars', error });
  }
};

const getCarById = async (req, res, next) => {
  /*
      #swagger.tags=['Cars']
    */

  const carId = req.params.carId;

  try {
    const car = await Car.findById(carId).exec();

    // Check if car exists
    if (!car) {
      return res.status(404).json({
        error: `Car with id: '${carId}' does not exist.`,
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(car);
  } catch (error) {
    console.log('Error:', error.message);
    next(error);
    // res.status(500).json({ error: error.message });
  }
};

// Add a new car
const addCar = async (req, res, next) => {
  /*
    #swagger.tags=['Cars']
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Create a new Car',
      schema: {
        brandName: 'Ferrari',
        model: 'Ferrari Test',
        year: 2024,
        engine: '3.9L V8',
        horsepower: 661,
        top_speed: "205 mph",
      }
    }
    #swagger.parameters=[
        {
        "name": "carImageFile",
        "in": "formData",
        "description": "Car Image file to upload",
        "required": false,
        "type": "file"
        }
    ] 
  */
  const { brandName, model, year, engine, horsepower, top_speed, image } =
    req.body;

  try {
    const brand = await Brand.findOne({
      brandName: brandName,
    });

    if (!brand) {
      return res.status(401).json({
        message: 'A car with this brand name cannot be created at this time.',
      });
    }

    const newCar = {
      brand: brand._id,
      model: model,
      year: year,
      engine: engine,
      horsepower: horsepower,
      top_speed: top_speed,
      image: image,
    };

    const savedCar = await Car.create(newCar);
    res.status(201).json(savedCar);
  } catch (error) {
    next(error)
  }
};

const editCarById = async (req, res, next) => {
  /*
      #swagger.tags=['Cars']
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Create a new Car',
        schema: {
          brandName: 'Ferrari',
          model: 'Ferrari Testing',
          year: 2024,
          engine: '3.9L V8',
          horsepower: 661,
          top_speed: "300 mph",
        }
      }
      #swagger.description = 'Change model to Ferrari Testing instead of Ferrari Test and top_speed to 300 mph instead of 205 mph'
    */
  const carId = req.params.carId;

  const { brandName, model, year, engine, horsepower, top_speed } = req.body;

  try {
    // Get the brand if it exists
    let brand = await Brand.findOne({
      brandName: brandName,
    });

    if (!brand) {
      return res.status(401).json({
        message: 'The brand name you are trying to use does not exist.',
      });
    }

    const updateCriteria = { _id: carId };
    const updatedCar = await Car.findOneAndUpdate(
      updateCriteria,
      {
        $set: {
          brand: brand._id,
          model: model,
          year: year,
          engine: engine,
          horsepower: horsepower,
          top_speed: top_speed,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedCar) {
      return res
        .status(404)
        .json({ message: 'This car could not be updated.' });
    }

    //if all goes well, return accepted status
    res.status(202).json(updatedCar);
  } catch (error) {
    console.log('Error:', error.message);
    next(error);
  }
};

//DELETE
const deleteCarById = async (req, res, next) => {
  /*
      #swagger.tags=['Cars']
    */
  const carId = req.params.carId;

  try {
    const car = await Car.findOneAndDelete({
      _id: carId,
    });

    console.log(car);
    if (!car) {
      return res.status(404).json({
        message: `You are not authorized to delete that car.`,
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
  getCars,
  getCarById,
  addCar,
  editCarById,
  deleteCarById,
};
