const express = require('express');
const router = express.Router();
const decryption = require("../middlewares/decryption")
const encryption = require("../middlewares/encryption")

const tripController = require('../controllers/trip.controller');
const ferryController = require('../controllers/ferry.controller');
const hotelController = require('../controllers/hotel.controller');
const contentController = require('../controllers/content.controller');


router.post('/trip-planner/routes', encryption, decryption, tripController.combineRouteList);
router.post('/trip-planner/ferry', ferryController.fetchFromAlgolia);
router.post('/hotel/get-details',hotelController.getHotelDetails);

router.post('/search-contents',contentController.searchContent);

module.exports = router;