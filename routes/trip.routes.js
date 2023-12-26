const express = require('express');
const router = express.Router();

const tripController = require('../controllers/trip.controller');
// var t = 

router.post('/routes', tripController.combineRouteList);

module.exports = router;