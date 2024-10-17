const Car = require('../models/Car'); // Assuming you have a Car model

// Get all cars
const getCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars', error });
    }
};

// Add a new car
const addCar = async (req, res) => {
    const newCar = new Car(req.body);
    try {
        const savedCar = await newCar.save();
        res.status(201).json(savedCar);
    } catch (error) {
        res.status(400).json({ message: 'Error adding car', error });
    }
};

module.exports = { getCars, addCar };

