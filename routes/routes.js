const express = require('express');
const router = express.Router();
const decryption = require("../middlewares/decryption")
const encryption = require("../middlewares/encryption")

const tripController = require('../controllers/trip.controller');
const ferryController = require('../controllers/ferry.controller');
const hotelController = require('../controllers/hotel.controller');


router.post('/trip-planner/routes', encryption, decryption, tripController.combineRouteList);
router.post('/trip-planner/ferry', ferryController.fetchFromAlgolia);
router.post('/hotel/get-details',hotelController.getHotelDetails);

module.exports = router;